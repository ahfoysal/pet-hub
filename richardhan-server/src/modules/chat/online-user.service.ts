import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface GetOnlineFriendsArgs {
  userId: string;
  limit?: number;
  cursor?: string; // friendId to start after
}

@Injectable()
export class OnlineUsersService {
  constructor(private readonly prisma: PrismaService) {}

  private onlineUsers = new Map<string, number>();

  setOnline(userId: string) {
    const count = this.onlineUsers.get(userId) || 0;
    this.onlineUsers.set(userId, count + 1);
  }

  setOffline(userId: string) {
    const count = this.onlineUsers.get(userId) || 0;
    if (count <= 1) this.onlineUsers.delete(userId);
    else this.onlineUsers.set(userId, count - 1);
  }

  isOnline(userId: string): boolean {
    return this.onlineUsers.has(userId);
  }

  async getOnlineFriends({ userId, limit = 20, cursor }: GetOnlineFriendsArgs) {
    // Step 1: Fetch all friend IDs (active friendships)
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

    // Step 2: Filter only online friends
    const onlineFriendIds = friendIds.filter((id) => this.isOnline(id));

    // Step 3: Apply cursor-based pagination
    let startIndex = 0;
    if (cursor) {
      startIndex = onlineFriendIds.findIndex((id) => id === cursor) + 1;
    }
    const paginatedIds = onlineFriendIds.slice(startIndex, startIndex + limit);

    // Step 4: Fetch user info from DB
    const onlineFriends = await this.prisma.user.findMany({
      where: { id: { in: paginatedIds } },
      select: { id: true, userName: true, fullName: true, image: true },
    });

    // Step 5: Determine next cursor
    const nextCursor =
      paginatedIds.length === limit
        ? paginatedIds[paginatedIds.length - 1]
        : null;

    return {
      data: onlineFriends,
      nextCursor,
      limit,
    };
  }
}
