import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ApiResponse } from 'src/common/response/api-response';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class UserMuteService {
  constructor(private readonly prisma: PrismaService) {}

  async muteUser(userId: string, targetUserId: string) {
    if (targetUserId === userId) {
      throw new BadRequestException('You cannot mute yourself');
    }

    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true, status: true },
    });

    if (!targetUser || ['BLOCKED', 'SUSPENDED'].includes(targetUser.status)) {
      throw new BadRequestException('User not found or cannot be muted');
    }

    // Check if already muted
    const existingMute = await this.prisma.userMute.findUnique({
      where: {
        mutedUserId_mutedById: {
          mutedUserId: targetUserId,
          mutedById: userId,
        },
      },
    });

    if (existingMute) {
      throw new BadRequestException('User is already muted');
    }

    // Create mute record
    await this.prisma.userMute.create({
      data: {
        mutedUserId: targetUserId,
        mutedById: userId,
      },
    });

    return ApiResponse.success('User muted successfully');
  }

  async unmuteUser(userId: string, targetUserId: string) {
    // Check if the mute exists
    const existingMute = await this.prisma.userMute.findUnique({
      where: {
        mutedUserId_mutedById: {
          mutedUserId: targetUserId,
          mutedById: userId,
        },
      },
    });

    if (!existingMute) {
      throw new BadRequestException('User is not muted');
    }

    // Delete the mute record
    await this.prisma.userMute.delete({
      where: {
        mutedUserId_mutedById: {
          mutedUserId: targetUserId,
          mutedById: userId,
        },
      },
    });

    return ApiResponse.success('User unmuted successfully');
  }

  async getMutedUsers(userId: string, cursor?: string, limit = 20) {
    limit = Math.min(limit, 50);

    const findManyArgs: Prisma.UserMuteFindManyArgs = {
      where: { mutedById: userId },
      take: limit + 1,
      orderBy: { createdAt: 'asc' },
      include: {
        mutedUser: { select: { id: true, fullName: true, image: true } },
      },
    };

    if (cursor) {
      findManyArgs.cursor = { id: cursor };
      findManyArgs.skip = 1;
    }

    const mutes = await this.prisma.userMute.findMany(findManyArgs);

    const hasNext = mutes.length > limit;
    const nextCursor = hasNext ? mutes[limit].id : null;

    //@ts-expect-error type error
    const result = mutes.slice(0, limit).map((m) => m.mutedUser);

    return ApiResponse.success('Muted users fetched successfully', {
      data: result,
      nextCursor,
    });
  }
}
