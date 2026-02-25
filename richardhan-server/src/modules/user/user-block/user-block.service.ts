import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ApiResponse } from 'src/common/response/api-response';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class UserBlockService {
  constructor(private readonly prisma: PrismaService) {}

  // ---------------- BLOCK USER ----------------
  async blockUser(userId: string, blockedUserId: string) {
    if (userId === blockedUserId) {
      throw new BadRequestException('You cannot block yourself');
    }

    // Check if target user exists and is active
    const blockedUser = await this.prisma.user.findFirst({
      where: { id: blockedUserId, status: 'ACTIVE' },
      select: {
        id: true,
        fullName: true,
        email: true,
        image: true,
      },
    });

    if (!blockedUser) {
      throw new NotFoundException(
        'The user you are trying to block does not exist or is unavailable'
      );
    }

    // Check ONLY if I already blocked this user
    const alreadyBlocked = await this.prisma.userBlock.findUnique({
      where: {
        blockerId_blockedUserId: {
          blockerId: userId,
          blockedUserId,
        },
      },
    });

    if (alreadyBlocked) {
      throw new BadRequestException('You have already blocked this user');
    }

    // Transaction for consistency
    await this.prisma.$transaction([
      // Create block
      this.prisma.userBlock.create({
        data: {
          blockerId: userId,
          blockedUserId,
        },
      }),

      // Update friendship if exists
      this.prisma.friendship.updateMany({
        where: {
          OR: [
            { userAId: userId, userBId: blockedUserId },
            { userAId: blockedUserId, userBId: userId },
          ],
        },
        data: { status: 'BLOCKED' },
      }),
    ]);

    return ApiResponse.success('User blocked successfully', {
      result: blockedUser,
    });
  }

  // ---------------- UNBLOCK USER ----------------
  async unblockUser(userId: string, blockedUserId: string) {
    return this.prisma.$transaction(async (tx) => {
      // Find ONLY my block
      const blockRecord = await tx.userBlock.findUnique({
        where: {
          blockerId_blockedUserId: {
            blockerId: userId,
            blockedUserId,
          },
        },
        include: {
          blockedUser: {
            select: {
              id: true,
              fullName: true,
              email: true,
              image: true,
            },
          },
        },
      });

      if (!blockRecord) {
        throw new NotFoundException('You have not blocked this user');
      }

      // Delete my block
      await tx.userBlock.delete({
        where: { id: blockRecord.id },
      });

      // Check if the other user still blocks me
      const stillBlocked = await tx.userBlock.findUnique({
        where: {
          blockerId_blockedUserId: {
            blockerId: blockedUserId,
            blockedUserId: userId,
          },
        },
      });

      // Only update friendship if NO blocks remain
      if (!stillBlocked) {
        await tx.friendship.updateMany({
          where: {
            OR: [
              { userAId: userId, userBId: blockedUserId },
              { userAId: blockedUserId, userBId: userId },
            ],
            status: 'BLOCKED',
          },
          data: { status: 'UNFRIENDED' },
        });
      }

      return ApiResponse.success('User unblocked successfully', {
        result: blockRecord.blockedUser,
      });
    });
  }

  // ---------------- GET BLOCKED USERS ----------------
  async getMyBlockedUsers(userId: string, cursor?: string, limit = 20) {
    limit = Math.min(limit, 50);

    const where: Prisma.UserBlockWhereInput = {
      blockerId: userId,
      blockedUser: { status: 'ACTIVE' },
    };

    const findManyArgs: Prisma.UserBlockFindManyArgs = {
      where,
      take: limit + 1,
      orderBy: { id: 'asc' },
      include: {
        blockedUser: {
          select: {
            id: true,
            fullName: true,
            image: true,
          },
        },
      },
    };

    if (cursor) {
      findManyArgs.cursor = { id: cursor };
      findManyArgs.skip = 1;
    }

    const blockedUsers = await this.prisma.userBlock.findMany(findManyArgs);

    const nextCursor =
      blockedUsers.length > limit ? blockedUsers[limit].id : null;

    // @ts-expect-error Property 'blockedUser' does not exist on type
    const users = blockedUsers.slice(0, limit).map((b) => b.blockedUser);

    return ApiResponse.success('Blocked users found', {
      result: users,
      nextCursor,
    });
  }
}
