import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';

type TrendingEntity = 'Post' | 'Reel';

@Injectable()
export class CronJobService {
  private readonly logger = new Logger(CronJobService.name);

  private readonly BASE_SCORE = 1;

  private readonly WEIGHTS = {
    LIKE: 1,
    COMMENT: 3,
    BOOKMARK: 4,
  };

  constructor(private readonly prisma: PrismaService) {}

  // ======================================================
  // ENTITY CONFIG FOR SAFE SQL
  // ======================================================
  private readonly ENTITY_SQL_MAP = {
    Post: {
      table: Prisma.raw('"Post"'),
      likeTable: Prisma.raw('"PostLike"'),
      commentTable: Prisma.raw('"Comment"'),
      idField: Prisma.raw('"postId"'),
      bookmarkType: 'POST',
    },
    Reel: {
      table: Prisma.raw('"Reel"'),
      likeTable: Prisma.raw('"ReelLike"'),
      commentTable: Prisma.raw('"ReelComment"'),
      idField: Prisma.raw('"reelId"'),
      bookmarkType: 'REEL',
    },
  } as const;

  // ======================================================
  // 🔁 HOURLY CRON
  // ======================================================
  @Cron(CronExpression.EVERY_HOUR)
  async updateTrendingScoresHourly() {
    try {
      await this.updateStoriesTrendingScore();
      await this.updateTrendingScore('Post', '3 days');
      await this.updateTrendingScore('Reel', '3 days');
      await this.applyBaseScore('Post', '3 days');
      await this.applyBaseScore('Reel', '3 days');

      this.logger.log('Hourly trending scores updated');
    } catch (e) {
      this.logger.error('Hourly trending cron failed', e.stack);
    }
  }

  // ======================================================
  // 🔁 DAILY CRON
  // ======================================================
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateTrendingScoresDaily() {
    try {
      await this.updateTrendingScore('Post');
      await this.updateTrendingScore('Reel');
      await this.resetInactive('Post');
      await this.resetInactive('Reel');

      this.logger.log('Daily trending scores recalculated');
    } catch (e) {
      this.logger.error('Daily trending cron failed', e.stack);
    }
  }

  // ======================================================
  // 📊 TRENDING SCORE
  // ======================================================
  private async updateTrendingScore(entity: TrendingEntity, interval?: string) {
    const cfg = this.ENTITY_SQL_MAP[entity];
    const intervalSql = interval
      ? Prisma.sql`AND "createdAt" >= NOW() - INTERVAL ${Prisma.raw(`'${interval}'`)}`
      : Prisma.empty;

    await this.prisma.$executeRaw(
      Prisma.sql`
        UPDATE ${cfg.table} e
        SET "trendingScore" =
          COALESCE(l.likes_count,0) * ${this.WEIGHTS.LIKE} +
          COALESCE(c.comments_count,0) * ${this.WEIGHTS.COMMENT} +
          COALESCE(b.bookmarks_count,0) * ${this.WEIGHTS.BOOKMARK}
        FROM (
          SELECT ${cfg.idField}, COUNT(*) AS likes_count
          FROM ${cfg.likeTable}
          WHERE 1=1
          ${intervalSql}
          GROUP BY ${cfg.idField}
        ) l
        LEFT JOIN (
          SELECT ${cfg.idField}, COUNT(*) AS comments_count
          FROM ${cfg.commentTable}
          WHERE 1=1
          ${intervalSql}
          GROUP BY ${cfg.idField}
        ) c ON c.${cfg.idField} = l.${cfg.idField}
        LEFT JOIN (
          SELECT ${cfg.idField}, COUNT(*) AS bookmarks_count
          FROM "Bookmark"
          WHERE "bookMarkType" = ${Prisma.raw(`'${cfg.bookmarkType}'::"BookmarkType"`)}
          ${intervalSql}
          GROUP BY ${cfg.idField}
        ) b ON b.${cfg.idField} = l.${cfg.idField}
        WHERE e.id = l.${cfg.idField}
          AND e."isDeleted" = false
          AND e."isHidden" = false;
      `
    );
  }

  // ======================================================
  // 🧹 RESET INACTIVE CONTENT
  // ======================================================
  private async resetInactive(entity: TrendingEntity) {
    const cfg = this.ENTITY_SQL_MAP[entity];

    await this.prisma.$executeRaw(
      Prisma.sql`
        UPDATE ${cfg.table}
        SET "trendingScore" = 0
        WHERE "isDeleted" = false
          AND "isHidden" = false
          AND NOT EXISTS (
            SELECT 1 FROM ${cfg.likeTable} l WHERE l.${cfg.idField} = ${cfg.table}.id
            UNION
            SELECT 1 FROM ${cfg.commentTable} c WHERE c.${cfg.idField} = ${cfg.table}.id
            UNION
            SELECT 1 FROM "Bookmark" b WHERE b.${cfg.idField} = ${cfg.table}.id
          );
      `
    );
  }

  // ======================================================
  // ⭐ BASE SCORE
  // ======================================================
  private async applyBaseScore(entity: TrendingEntity, interval: string) {
    const cfg = this.ENTITY_SQL_MAP[entity];

    await this.prisma.$executeRaw(
      Prisma.sql`
        UPDATE ${cfg.table}
        SET "trendingScore" = ${this.BASE_SCORE}
        WHERE "trendingScore" = 0
          AND "createdAt" >= NOW() - INTERVAL ${Prisma.raw(`'${interval}'`)}
          AND "isDeleted" = false
          AND "isHidden" = false;
      `
    );
  }

  // ======================================================
  // 📖 STORIES TRENDING
  // ======================================================
  private async updateStoriesTrendingScore() {
    await this.prisma.$executeRaw(
      Prisma.sql`
        UPDATE "Story"
        SET "trendingScore" =
          "viewCount" * 0.6 +
          "likeCount" * 0.4
        WHERE "isPublished" = true
          AND "isDeleted" = false
          AND "createdAt" >= NOW() - INTERVAL '1 day';
      `
    );
  }

  // ======================================================
  // ⏱ STORY EXPIRATION
  // ======================================================
  @Cron(CronExpression.EVERY_5_MINUTES)
  async expireStories() {
    try {
      const now = new Date();
      const stories = await this.prisma.story.findMany({
        where: { expiresAt: { lt: now }, isPublished: true, isDeleted: false },
        select: { id: true, userId: true },
      });

      if (!stories.length) return;

      const BATCH_SIZE = 100;

      for (let i = 0; i < stories.length; i += BATCH_SIZE) {
        const batch = stories.slice(i, i + BATCH_SIZE);

        await this.prisma.$transaction(async (tx) => {
          await tx.story.updateMany({
            where: { id: { in: batch.map((s) => s.id) } },
            data: { isPublished: false },
          });

          await tx.moment.createMany({
            data: batch.map((s) => ({
              storyId: s.id,
              userId: s.userId,
            })),
            skipDuplicates: true,
          });
        });
      }

      this.logger.log(`Expired ${stories.length} stories`);
    } catch (e) {
      this.logger.error('Story expiration cron failed', e.stack);
    }
  }

  // ======================================================
  // ⛔ USER SUSPENSION EXPIRATION
  // ======================================================
  @Cron(CronExpression.EVERY_5_MINUTES)
  async suspendUserExpiration() {
    try {
      const result = await this.prisma.user.updateMany({
        where: {
          status: 'SUSPENDED',
          suspendUntil: { not: null, lt: new Date() },
        },
        data: {
          status: 'ACTIVE',
          suspendUntil: null,
          suspendReason: null,
        },
      });

      if (result.count > 0) {
        this.logger.log(`Reactivated ${result.count} suspended users`);
      }
    } catch (e) {
      this.logger.error('User suspension expiration cron failed', e.stack);
    }
  }

  // Late Pet Sitter Bookings
  @Cron(CronExpression.EVERY_5_MINUTES)
  async markLatePetSitterBookings() {
    const now = new Date();
    const BATCH_SIZE = 50;

    try {
      // fetch bookings to update
      const bookings = await this.prisma.petSitterBooking.findMany({
        where: {
          status: 'CONFIRMED',
          startingTime: { lt: now },
          isLate: false,
        },
        select: { id: true },
        take: 500, // max to process per cron run
      });

      if (!bookings.length) {
        this.logger.log('No late bookings found in this run');
        return;
      }

      for (let i = 0; i < bookings.length; i += BATCH_SIZE) {
        const batch = bookings.slice(i, i + BATCH_SIZE);
        const result = await this.prisma.petSitterBooking.updateMany({
          where: { id: { in: batch.map((b) => b.id) } },
          data: { status: 'LATE', isLate: true },
        });

        this.logger.log(`Marked ${result.count} bookings as LATE`);
      }
    } catch (e) {
      this.logger.error('Late bookings cron failed', e.stack);
    }
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async expirePendingBookings() {
    const now = new Date();
    const GRACE_MS = 15 * 60 * 1000; // 15 minutes
    const cutoff = new Date(now.getTime() - GRACE_MS);
    const BATCH_SIZE = 50;

    try {
      // fetch bookings to expire
      const bookings = await this.prisma.petSitterBooking.findMany({
        where: {
          status: 'PENDING',
          startingTime: { lt: cutoff },
        },
        select: { id: true },
        take: 500, // max per run
      });

      if (!bookings.length) {
        this.logger.log('No pending bookings to expire');
        return;
      }

      for (let i = 0; i < bookings.length; i += BATCH_SIZE) {
        const batch = bookings.slice(i, i + BATCH_SIZE);
        const result = await this.prisma.petSitterBooking.updateMany({
          where: { id: { in: batch.map((b) => b.id) } },
          data: { status: 'EXPIRED' },
        });

        this.logger.log(`Expired ${result.count} pending bookings`);
      }
    } catch (e) {
      this.logger.error('Pending bookings expiration cron failed', e.stack);
    }
  }
}
