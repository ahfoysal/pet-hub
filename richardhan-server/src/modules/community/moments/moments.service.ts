import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ApiResponse } from 'src/common/response/api-response';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class MomentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyMoments(userId: string, cursor?: string, limit = 20) {
    limit = Math.min(Math.max(limit, 1), 50);

    const queryOptions: Prisma.MomentFindManyArgs = {
      where: { userId, isDeleted: false },
      take: limit + 1,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        createdAt: true,
        story: {
          select: {
            media: true,
            location: true,
            userId: true,
          },
        },
      },
    };

    if (cursor) {
      queryOptions.cursor = { id: cursor };
      queryOptions.skip = 1;
    }

    const moments = await this.prisma.moment.findMany(queryOptions);

    let nextCursor: string | null = null;
    if (moments.length > limit) {
      const nextMoment = moments.pop();
      nextCursor = nextMoment?.id ?? null;
    }

    return ApiResponse.success('Moments fetched successfully', {
      data: moments,
      nextCursor,
    });
  }

  async getMomentsByUser(userId: string, cursor?: string, limit = 20) {
    limit = Math.min(Math.max(limit, 1), 50);

    const queryOptions: Prisma.MomentFindManyArgs = {
      where: {
        userId,
        isDeleted: false,
        isHidden: false,
      },
      take: limit + 1,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        createdAt: true,
        story: {
          select: {
            media: true,
            location: true,
            userId: true,
          },
        },
      },
    };

    if (cursor) {
      queryOptions.cursor = { id: cursor };
      queryOptions.skip = 1;
    }

    const moments = await this.prisma.moment.findMany(queryOptions);

    let nextCursor: string | null = null;
    if (moments.length > limit) {
      const nextMoment = moments.pop();
      nextCursor = nextMoment?.id ?? null;
    }

    return ApiResponse.success('Moments fetched successfully', {
      data: moments,
      nextCursor,
    });
  }

  async toggleHideMoment(userId: string, momentId: string) {
    const moment = await this.prisma.moment.findFirst({
      where: { id: momentId, isDeleted: false },
    });

    if (!moment) {
      throw new NotFoundException('Moment not found');
    }

    if (moment.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this moment'
      );
    }

    // Toggle the isHidden flag
    const updatedMoment = await this.prisma.moment.update({
      where: { id: momentId },
      data: { isHidden: !moment.isHidden },
    });

    return ApiResponse.success(
      `Moment is now ${updatedMoment.isHidden ? 'hidden' : 'visible'}`
    );
  }

  async deleteMoment(userId: string, momentId: string) {
    const moment = await this.prisma.moment.findFirst({
      where: { id: momentId, isDeleted: false },
    });

    if (!moment) {
      throw new NotFoundException('Moment not found');
    }

    if (moment.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this moment'
      );
    }

    await this.prisma.moment.update({
      where: { id: momentId },
      data: { isDeleted: true },
    });

    return ApiResponse.success('Moment deleted successfully');
  }
}
