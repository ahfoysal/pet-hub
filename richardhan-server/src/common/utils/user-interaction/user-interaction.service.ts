import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';

type ContentType = 'POST' | 'REEL';

@Injectable()
export class UserInteractionService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns NOT filters for blocked users, muted users, and hidden content
   */
  async getVisibilityFilters<
    T extends Prisma.PostWhereInput | Prisma.ReelWhereInput,
  >(userId: string, contentType: ContentType): Promise<T[]> {
    const [blocks, mutes, hidden] = await Promise.all([
      this.prisma.userBlock.findMany({
        where: { OR: [{ blockerId: userId }, { blockedUserId: userId }] },
        select: { blockerId: true, blockedUserId: true },
      }),
      this.prisma.userMute.findMany({
        where: { mutedById: userId },
        select: { mutedUserId: true },
      }),
      this.prisma.hiddenContent.findMany({
        where: { userId, contentType },
        select: { contentId: true },
      }),
    ]);

    const notFilters: T[] = [];

    // 1️⃣ Blocked users
    if (blocks.length) {
      const blockedIds = blocks.map((b) =>
        b.blockerId === userId ? b.blockedUserId : b.blockerId
      );
      notFilters.push({ userId: { in: blockedIds } } as T);
    }

    // 2️⃣ Muted users
    if (mutes.length) {
      const mutedIds = mutes.map((m) => m.mutedUserId);
      notFilters.push({ userId: { in: mutedIds } } as T);
    }

    // 3️⃣ Hidden content
    if (hidden.length) {
      const hiddenIds = hidden.map((h) => h.contentId);
      notFilters.push({ id: { in: hiddenIds } } as T);
    }

    return notFilters;
  }

  async getHiddenPostIds(userId: string) {
    const hidden = await this.prisma.hiddenContent.findMany({
      where: { userId, contentType: 'POST' },
      select: { contentId: true },
    });
    return hidden.map((h) => h.contentId);
  }

  async isUserBlocked(userId: string, targetUserId: string): Promise<boolean> {
    const count = await this.prisma.userBlock.count({
      where: {
        OR: [
          { blockerId: userId, blockedUserId: targetUserId },
          { blockerId: targetUserId, blockedUserId: userId },
        ],
      },
    });

    return count > 0;
  }

  async getBlockedUserIds(userId: string): Promise<string[]> {
    const blocks = await this.prisma.userBlock.findMany({
      where: { OR: [{ blockerId: userId }, { blockedUserId: userId }] },
      select: { blockerId: true, blockedUserId: true },
    });

    return blocks.map((b) =>
      b.blockerId === userId ? b.blockedUserId : b.blockerId
    );
  }

  async getMutedUserIds(userId: string): Promise<string[]> {
    const mutes = await this.prisma.userMute.findMany({
      where: { mutedById: userId },
      select: { mutedUserId: true },
    });

    return mutes.map((m) => m.mutedUserId);
  }

  async getStoryVisibilityFilters(userId: string) {
    const [blockedIds, mutedIds] = await Promise.all([
      this.getBlockedUserIds(userId),
      this.getMutedUserIds(userId),
    ]);

    const notFilters: Prisma.StoryWhereInput[] = [];

    if (blockedIds.length) {
      notFilters.push({ userId: { in: blockedIds } });
    }

    if (mutedIds.length) {
      notFilters.push({ userId: { in: mutedIds } });
    }

    return notFilters;
  }
}
