import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import {
  MAX_FRIENDS_LIMIT,
  MAX_PENDING_REQUESTS,
} from 'src/common/constants/constants';
import { FriendshipRelationStatusEnum } from 'src/common/constants/enums';
import { ApiResponse } from 'src/common/response/api-response';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class FriendshipService {
  constructor(private readonly prisma: PrismaService) {}

  private sortIds(userId1: string, userId2: string): [string, string] {
    if (userId1 === userId2) {
      throw new BadRequestException('User IDs must be different');
    }
    return userId1 < userId2 ? [userId1, userId2] : [userId2, userId1];
  }

  async checkFriendShipStatus(
    viewerId: string,
    targetUserIds: string[]
  ): Promise<Record<string, FriendshipRelationStatusEnum>> {
    if (!viewerId) {
      return Object.fromEntries(
        targetUserIds.map((id) => [id, FriendshipRelationStatusEnum.NONE])
      );
    }

    const filteredIds = targetUserIds.filter((id) => id !== viewerId);

    // 1️⃣ Blocked users (both directions)
    const blocks = await this.prisma.userBlock.findMany({
      where: {
        OR: [
          { blockerId: viewerId, blockedUserId: { in: filteredIds } },
          { blockerId: { in: filteredIds }, blockedUserId: viewerId },
        ],
      },
      select: { blockerId: true, blockedUserId: true },
    });

    const blockedMap = new Set(
      blocks.map((b) =>
        b.blockerId === viewerId ? b.blockedUserId : b.blockerId
      )
    );

    // 2️⃣ Friendships (bulk)
    const friendships = await this.prisma.friendship.findMany({
      where: {
        OR: [
          {
            userAId: viewerId,
            userBId: { in: filteredIds },
          },
          {
            userBId: viewerId,
            userAId: { in: filteredIds },
          },
        ],
      },
      select: { userAId: true, userBId: true, status: true },
    });

    const friendshipMap = new Map<string, FriendshipRelationStatusEnum>();
    for (const f of friendships) {
      const otherId = f.userAId === viewerId ? f.userBId : f.userAId;
      if (f.status === 'ACTIVE') {
        friendshipMap.set(otherId, FriendshipRelationStatusEnum.FRIENDS);
      } else if (f.status === 'UNFRIENDED') {
        friendshipMap.set(otherId, FriendshipRelationStatusEnum.NONE);
      }
    }

    // 3️⃣ Pending friend requests (bulk)
    const requests = await this.prisma.friendRequest.findMany({
      where: {
        OR: [
          {
            senderId: viewerId,
            receiverId: { in: filteredIds },
            status: 'PENDING',
          },
          {
            senderId: { in: filteredIds },
            receiverId: viewerId,
            status: 'PENDING',
          },
        ],
      },
      select: { senderId: true, receiverId: true },
    });

    const requestMap = new Map<string, FriendshipRelationStatusEnum>();
    for (const r of requests) {
      const otherId = r.senderId === viewerId ? r.receiverId : r.senderId;
      const status =
        r.senderId === viewerId
          ? FriendshipRelationStatusEnum.REQUEST_SENT
          : FriendshipRelationStatusEnum.REQUEST_RECEIVED;
      requestMap.set(otherId, status);
    }

    // 4️⃣ Build final map
    const result: Record<string, FriendshipRelationStatusEnum> = {};
    for (const id of targetUserIds) {
      if (id === viewerId) {
        result[id] = FriendshipRelationStatusEnum.SELF;
      } else if (blockedMap.has(id)) {
        result[id] = FriendshipRelationStatusEnum.BLOCKED;
      } else if (friendshipMap.has(id)) {
        result[id] = friendshipMap.get(id)!;
      } else if (requestMap.has(id)) {
        result[id] = requestMap.get(id)!;
      } else {
        result[id] = FriendshipRelationStatusEnum.NONE;
      }
    }

    return result;
  }

  private async checkFriendsCountLimit(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { friendsCount: true },
    });
    if (!user) throw new NotFoundException('User not found');
    if (user.friendsCount >= MAX_FRIENDS_LIMIT) {
      throw new ConflictException(
        `You have reached the maximum number of friends (${MAX_FRIENDS_LIMIT})`
      );
    }
  }

  private async checkPendingRequestsLimit(
    senderId: string,
    receiverId: string
  ) {
    const users = await this.prisma.user.findMany({
      where: { id: { in: [senderId, receiverId] } },
      select: { id: true, pendingRequestCount: true },
    });
    const sender = users.find((u) => u.id === senderId);
    const receiver = users.find((u) => u.id === receiverId);
    if (!sender || !receiver)
      throw new NotFoundException('Sender or receiver not found');
    if (sender.pendingRequestCount >= MAX_PENDING_REQUESTS)
      throw new ConflictException(
        `You have reached the maximum number of pending friend requests (${MAX_PENDING_REQUESTS})`
      );
    if (receiver.pendingRequestCount >= MAX_PENDING_REQUESTS)
      throw new ConflictException(
        'The user has too many pending friend requests. Try again later.'
      );
  }

  private async checkBlockStatus(
    senderId: string,
    receiverId: string,
    tx: any
  ) {
    const block = await tx.userBlock.findFirst({
      where: {
        OR: [
          { blockerId: senderId, blockedUserId: receiverId },
          { blockerId: receiverId, blockedUserId: senderId },
        ],
      },
    });
    if (block) throw new ConflictException('Cannot interact with blocked user');
  }

  async sendFriendRequest(senderId: string, receiverId: string) {
    if (senderId === receiverId)
      throw new BadRequestException(
        'You cannot send a friend request to yourself'
      );

    return this.prisma.$transaction(async (tx) => {
      await this.checkFriendsCountLimit(senderId);
      await this.checkFriendsCountLimit(receiverId);
      await this.checkPendingRequestsLimit(senderId, receiverId);
      await this.checkBlockStatus(senderId, receiverId, tx);

      const [userAId, userBId] = this.sortIds(senderId, receiverId);

      const existingFriendship = await tx.friendship.findUnique({
        where: { userAId_userBId: { userAId, userBId } },
      });
      if (existingFriendship && existingFriendship.status === 'ACTIVE') {
        throw new ConflictException('You are already friends');
      }

      const existingRequest = await tx.friendRequest.findFirst({
        where: {
          OR: [
            { senderId, receiverId, status: 'PENDING' },
            { senderId: receiverId, receiverId: senderId, status: 'PENDING' },
          ],
        },
      });
      if (existingRequest)
        throw new ConflictException('Friend request already exists');

      await tx.friendRequest.create({ data: { senderId, receiverId } });
      await tx.user.update({
        where: { id: receiverId },
        data: { pendingRequestCount: { increment: 1 } },
      });

      return ApiResponse.success('Friend request sent successfully');
    });
  }

  async acceptFriendRequest(friendRequestId: string, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const request = await tx.friendRequest.findUnique({
        where: { id: friendRequestId },
      });
      if (!request || request.status !== 'PENDING')
        throw new NotFoundException('Pending friend request not found');
      if (request.receiverId !== userId)
        throw new ConflictException(
          'You are not allowed to accept this request'
        );

      await this.checkBlockStatus(request.senderId, request.receiverId, tx);
      await this.checkFriendsCountLimit(request.senderId);
      await this.checkFriendsCountLimit(request.receiverId);

      const [userAId, userBId] = this.sortIds(
        request.senderId,
        request.receiverId
      );

      await tx.friendRequest.update({
        where: { id: friendRequestId },
        data: { status: 'ACCEPTED' },
      });
      await tx.friendship.upsert({
        where: { userAId_userBId: { userAId, userBId } },
        update: { status: 'ACTIVE', unfriendedAt: null },
        create: { userAId, userBId, status: 'ACTIVE' },
      });
      await tx.user.updateMany({
        where: {
          id: { in: [request.senderId, request.receiverId] },
          friendsCount: { lt: MAX_FRIENDS_LIMIT },
        },
        data: { friendsCount: { increment: 1 } },
      });
      await tx.user.updateMany({
        where: { id: request.receiverId, pendingRequestCount: { gt: 0 } },
        data: { pendingRequestCount: { decrement: 1 } },
      });

      return ApiResponse.success('Friend request accepted successfully');
    });
  }

  async rejectFriendRequest(friendRequestId: string, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const request = await tx.friendRequest.findUnique({
        where: { id: friendRequestId },
      });
      if (!request || request.status !== 'PENDING')
        throw new NotFoundException('Pending friend request not found');
      if (request.receiverId !== userId)
        throw new ConflictException(
          'You are not allowed to reject this request'
        );

      await tx.friendRequest.update({
        where: { id: friendRequestId },
        data: { status: 'DECLINED' },
      });
      await tx.user.updateMany({
        where: { id: request.receiverId, pendingRequestCount: { gt: 0 } },
        data: { pendingRequestCount: { decrement: 1 } },
      });

      return ApiResponse.success('Friend request rejected successfully');
    });
  }

  async getAllFriends(
    userId: string,
    limit: number = 20,
    cursor?: string,
    search?: string
  ) {
    limit = Math.min(limit, 50);
    const fetchLimit = limit + 1;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { friendsCount: true },
    });
    if (!user) throw new NotFoundException('User not found');

    // Get all blocked users (both directions)
    const blockedByMe = await this.prisma.userBlock.findMany({
      where: { blockerId: userId },
      select: { blockedUserId: true },
    });
    const blockedMe = await this.prisma.userBlock.findMany({
      where: { blockedUserId: userId },
      select: { blockerId: true },
    });
    const blockedIds = [
      ...blockedByMe.map((b) => b.blockedUserId),
      ...blockedMe.map((b) => b.blockerId),
    ];

    const friendships = await this.prisma.friendship.findMany({
      where: {
        status: 'ACTIVE',
        OR: [
          {
            userAId: userId,
            userB: {
              status: 'ACTIVE',
              id: { notIn: blockedIds },
              ...(search
                ? {
                    OR: [
                      { fullName: { contains: search, mode: 'insensitive' } },
                      { email: { contains: search, mode: 'insensitive' } },
                      { userName: { contains: search, mode: 'insensitive' } },
                    ],
                  }
                : {}),
            },
          },
          {
            userBId: userId,
            userA: {
              status: 'ACTIVE',
              id: { notIn: blockedIds },
              ...(search
                ? {
                    OR: [
                      { fullName: { contains: search, mode: 'insensitive' } },
                      { email: { contains: search, mode: 'insensitive' } },
                    ],
                  }
                : {}),
            },
          },
        ],
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: fetchLimit,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      include: {
        userA: {
          select: {
            id: true,
            fullName: true,
            email: true,
            image: true,
            status: true,
          },
        },
        userB: {
          select: {
            id: true,
            fullName: true,
            email: true,
            image: true,
            status: true,
          },
        },
      },
    });

    const hasNext = friendships.length > limit;
    const paginated = friendships.slice(0, limit);
    const friends = paginated.map((f) =>
      f.userAId === userId ? f.userB : f.userA
    );

    return ApiResponse.success('Friends found', {
      limit,
      hasNext,
      friendCount: user.friendsCount,
      cursor: hasNext ? paginated[paginated.length - 1].id : null,
      friends: friends.map((f) => ({
        userId: f.id,
        fullName: f.fullName,
        email: f.email,
        image: f.image,
      })),
    });
  }

  async unfriend(userId: string, friendId: string) {
    const [userAId, userBId] = this.sortIds(userId, friendId);

    return this.prisma.$transaction(async (tx) => {
      const friendship = await tx.friendship.findUnique({
        where: { userAId_userBId: { userAId, userBId } },
      });
      if (!friendship || friendship.status !== 'ACTIVE')
        throw new NotFoundException('Active friendship not found');

      await tx.friendship.update({
        where: { userAId_userBId: { userAId, userBId } },
        data: { status: 'UNFRIENDED', unfriendedAt: new Date() },
      });

      await Promise.all(
        [userId, friendId].map((id) =>
          tx.user.update({
            where: { id },
            data: { friendsCount: { decrement: 1 } },
          })
        )
      );

      await Promise.all(
        [userId, friendId].map((id) =>
          tx.user.updateMany({
            where: { id, friendsCount: { lt: 0 } },
            data: { friendsCount: 0 },
          })
        )
      );

      return ApiResponse.success('Friendship removed successfully');
    });
  }

  async getPendingFriendRequests(
    userId: string,
    limit: number = 20,
    cursor?: string,
    search?: string
  ) {
    limit = Math.min(limit, 50);
    const fetchLimit = limit + 1;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { pendingRequestCount: true },
    });

    if (!user) throw new NotFoundException('User not found');

    // Exclude blocked users (sender or blocked by current user)
    const blockedIds = (
      await this.prisma.userBlock.findMany({
        where: { blockerId: userId },
        select: { blockedUserId: true },
      })
    ).map((b) => b.blockedUserId);

    const requests = await this.prisma.friendRequest.findMany({
      where: {
        receiverId: userId,
        status: 'PENDING',
        senderId: { notIn: blockedIds },
        sender: {
          status: 'ACTIVE',
          ...(search
            ? {
                OR: [
                  { fullName: { contains: search, mode: 'insensitive' } },
                  { email: { contains: search, mode: 'insensitive' } },
                  { userName: { contains: search, mode: 'insensitive' } },
                ],
              }
            : {}),
        },
      },
      orderBy: { id: 'desc' },
      take: fetchLimit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      include: {
        sender: {
          select: { id: true, fullName: true, email: true, image: true },
        },
      },
    });

    const hasNext = requests.length > limit;
    const page = requests.slice(0, limit);

    return ApiResponse.success('Pending friend requests found', {
      limit,
      hasNext,
      totalPendingRequests: user.pendingRequestCount,
      requests: page.map((r) => ({
        id: r.id,
        senderId: r.senderId,
        senderName: r.sender.fullName,
        senderEmail: r.sender.email,
        senderImage: r.sender.image,
        createdAt: r.createdAt,
      })),
      cursor: hasNext ? page[page.length - 1].id : null,
    });
  }

  async getFriendsProfile(userId: string, otherUserId: string) {
    const [userAId, userBId] = this.sortIds(userId, otherUserId);

    // Check friendship and block status
    const friendship = await this.prisma.friendship.findUnique({
      where: { userAId_userBId: { userAId, userBId } },
      include: {
        userA: {
          select: {
            id: true,
            fullName: true,
            email: true,
            image: true,
            status: true,
          },
        },
        userB: {
          select: {
            id: true,
            fullName: true,
            email: true,
            image: true,
            status: true,
          },
        },
      },
    });

    if (!friendship || friendship.status !== 'ACTIVE') {
      throw new NotFoundException('Friendship not found');
    }

    // Check if either user has blocked the other
    const blocked = await this.prisma.userBlock.findFirst({
      where: {
        OR: [
          { blockerId: userId, blockedUserId: otherUserId },
          { blockerId: otherUserId, blockedUserId: userId },
        ],
      },
    });

    if (blocked) {
      throw new ConflictException('Cannot view profile due to block');
    }

    // Determine which is the "other" user
    const profile =
      friendship.userAId === userId ? friendship.userB : friendship.userA;

    return {
      userId: profile.id,
      fullName: profile.fullName,
      email: profile.email,
      image: profile.image,
      status: profile.status,
      since: friendship.createdAt,
    };
  }

  async getMutualFriends(userId: string, otherUserId: string) {
    const mutualFriends = await this.prisma.friendship.findMany({
      where: {
        status: 'ACTIVE',
        OR: [
          {
            userAId: { in: [userId, otherUserId] },
            userBId: { in: [userId, otherUserId] },
          },
          {
            userBId: { in: [userId, otherUserId] },
            userAId: { in: [userId, otherUserId] },
          },
        ],
      },
      include: {
        userA: {
          select: {
            id: true,
            fullName: true,
            image: true,
            status: true,
            userName: true,
          },
        },
        userB: {
          select: {
            id: true,
            fullName: true,
            image: true,
            status: true,
            userName: true,
          },
        },
      },
    });

    // Filter out blocked users
    const blockedIds = (
      await this.prisma.userBlock.findMany({
        where: { blockerId: userId },
        select: { blockedUserId: true },
      })
    ).map((b) => b.blockedUserId);

    const mutual = mutualFriends
      .map((f) => (f.userAId === userId ? f.userB : f.userA))
      .filter((f) => !blockedIds.includes(f.id));

    return mutual.map((f) => ({
      userId: f.id,
      fullName: f.fullName,
      image: f.image,
      status: f.status,
    }));
  }

  async getSuggestedFriends(
    userId: string,
    limit: number = 20,
    cursor?: string,
    search?: string
  ) {
    limit = Math.min(limit, 50);
    const fetchLimit = limit + 1;

    type SuggestedFriendDto = {
      userId: string;
      fullName: string;
      email: string;
      image: string | null;
    };

    // 1️⃣ Get blocked users (both directions)
    const blockedByMe = await this.prisma.userBlock.findMany({
      where: { blockerId: userId },
      select: { blockedUserId: true },
    });

    const blockedMe = await this.prisma.userBlock.findMany({
      where: { blockedUserId: userId },
      select: { blockerId: true },
    });

    const blockedIds = [
      ...blockedByMe.map((b) => b.blockedUserId),
      ...blockedMe.map((b) => b.blockerId),
      userId,
    ];

    // 2️⃣ Get current friends
    const friendships = await this.prisma.friendship.findMany({
      where: {
        status: 'ACTIVE',
        OR: [{ userAId: userId }, { userBId: userId }],
      },
      select: { userAId: true, userBId: true },
    });

    const friendIds = friendships.map((f) =>
      f.userAId === userId ? f.userBId : f.userAId
    );

    let suggestedUsers: SuggestedFriendDto[] = [];

    // 3️⃣ Mutual friends (if user has friends)
    if (friendIds.length > 0) {
      const mutualFriendships = await this.prisma.friendship.findMany({
        where: {
          status: 'ACTIVE',
          OR: [
            {
              userAId: { in: friendIds },
              userBId: { notIn: [...friendIds, ...blockedIds] },
            },
            {
              userBId: { in: friendIds },
              userAId: { notIn: [...friendIds, ...blockedIds] },
            },
          ],
        },
        include: {
          userA: {
            select: { id: true, fullName: true, email: true, image: true },
          },
          userB: {
            select: { id: true, fullName: true, email: true, image: true },
          },
        },
        take: fetchLimit,
      });

      const seen = new Set<string>();

      suggestedUsers = mutualFriendships
        .map((f) => (friendIds.includes(f.userA.id) ? f.userB : f.userA))
        .filter((u) => {
          if (seen.has(u.id)) return false;
          seen.add(u.id);
          return true;
        })
        .map((u) => ({
          userId: u.id,
          fullName: u.fullName,
          email: u.email,
          image: u.image,
        }));
    }

    // 4️⃣ Fallback: popular users (new users / no mutuals)
    if (suggestedUsers.length === 0) {
      const users = await this.prisma.user.findMany({
        where: {
          id: { notIn: [...blockedIds, ...friendIds] },
          status: 'ACTIVE',
          ...(search
            ? {
                OR: [
                  { fullName: { contains: search, mode: 'insensitive' } },
                  { email: { contains: search, mode: 'insensitive' } },
                  { userName: { contains: search, mode: 'insensitive' } },
                ],
              }
            : {}),
        },
        orderBy: { friendsCount: 'desc' },
        take: fetchLimit,
        cursor: cursor ? { id: cursor } : undefined,
        skip: cursor ? 1 : 0,
        select: { id: true, fullName: true, email: true, image: true },
      });

      suggestedUsers = users.map((u) => ({
        userId: u.id,
        fullName: u.fullName,
        email: u.email,
        image: u.image,
      }));
    }

    // 5️⃣ Pagination
    const hasNext = suggestedUsers.length > limit;
    const page = suggestedUsers.slice(0, limit);

    return ApiResponse.success('Suggested friends fetched successfully', {
      limit,
      hasNext,
      cursor: hasNext ? page[page.length - 1].userId : null,
      users: page,
    });
  }
}
