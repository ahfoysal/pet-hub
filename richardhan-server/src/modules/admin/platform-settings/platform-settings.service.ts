import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { PlatformSettingsDto } from './dto/platform-settings.dto';
import { ApiResponse } from 'src/common/response/api-response';

@Injectable()
export class PlatformSettingsService {
  constructor(private readonly prisma: PrismaService) {}

  private SETTINGS_ID = 'PLATFORM_SETTINGS';

  // Service function
  async updatePlatformSettings(payload: PlatformSettingsDto, userId: string) {
    const admin = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!admin) throw new NotFoundException('Admin not found');
    if (admin.role !== 'ADMIN')
      throw new ForbiddenException(
        'You do not have permission to update settings'
      );

    const settings = await this.prisma.platformSettings.findUnique({
      where: { id: this.SETTINGS_ID },
      include: { providerCategoryLevels: true },
    });

    if (!settings) {
      const { providerCategoryLevels, ...rest } = payload;
      await this.prisma.platformSettings.create({
        data: {
          id: this.SETTINGS_ID,
          ...rest,
          providerCategoryLevels: providerCategoryLevels
            ? { create: providerCategoryLevels }
            : undefined,
        },
      });
      return ApiResponse.success('Settings created successfully');
    }

    // ✅ CHANGE DETECTION (number vs Decimal)
    const hasChanged =
      (payload.platformFee !== undefined &&
        Number(settings.platformFee) !== payload.platformFee) ||
      (payload.commissionRate !== undefined &&
        Number(settings.commissionRate) !== payload.commissionRate) ||
      (payload.freeCancellationWindow !== undefined &&
        settings.freeCancellationWindow !== payload.freeCancellationWindow) ||
      (payload.refundPercentage !== undefined &&
        Number(settings.refundPercentage) !== payload.refundPercentage) ||
      (payload.isKycAutomatic !== undefined &&
        settings.isKycAutomatic !== payload.isKycAutomatic) ||
      (payload.isEmailNotificationEnabled !== undefined &&
        settings.isEmailNotificationEnabled !==
          payload.isEmailNotificationEnabled) ||
      (payload.isTwoFactorEnabled !== undefined &&
        settings.isTwoFactorEnabled !== payload.isTwoFactorEnabled);

    // If only category levels changed, we still process it
    const categoryLevelsChanged = payload.providerCategoryLevels !== undefined;

    if (!hasChanged && !categoryLevelsChanged) {
      return ApiResponse.success('No changes detected');
    }

    const now = new Date();

    const { providerCategoryLevels, ...restPayload } = payload;

    await this.prisma.$transaction(async (tx) => {
      if (hasChanged) {
        // Save old + new values in history (only for fee/rate typically, but we can store version)
        await tx.platformSettingsHistory.create({
          data: {
            platformSettingsId: settings.id,
            updatedById: userId,
            version: settings.version,
            updatedAt: now,
            platformFeeOld: settings.platformFee,
            platformFeeNew: payload.platformFee ?? settings.platformFee,
            commissionRateOld: settings.commissionRate,
            commissionRateNew:
              payload.commissionRate ?? settings.commissionRate,
          },
        });
      }

      // Update current settings
      await tx.platformSettings.update({
        where: { id: this.SETTINGS_ID },
        data: {
          ...restPayload,
          version: { increment: 1 },
          updatedAt: now,
        },
      });

      // Update Provider Category Levels if provided
      if (providerCategoryLevels) {
        // Simple approach: Delete existing and recreate or update
        // Here we recreate for simplicity in syncing levels
        await tx.providerCategoryLevel.deleteMany({
          where: { platformSettingsId: this.SETTINGS_ID },
        });

        await tx.providerCategoryLevel.createMany({
          data: providerCategoryLevels.map((lvl) => ({
            platformSettingsId: this.SETTINGS_ID,
            name: lvl.name,
            bookingThreshold: lvl.bookingThreshold,
            benefits: lvl.benefits,
          })),
        });
      }
    });

    return ApiResponse.success('Settings updated successfully');
  }

  async getPlatformSettings(userId: string) {
    const admin = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!admin) throw new NotFoundException('Admin not found');

    if (admin.role !== 'ADMIN')
      throw new ForbiddenException(
        'You do not have permission to access settings'
      );

    const settings = await this.prisma.platformSettings.upsert({
      where: { id: this.SETTINGS_ID },
      update: {}, // read-only
      create: {
        id: this.SETTINGS_ID, // defaults applied automatically
      },
      include: {
        providerCategoryLevels: {
          orderBy: { bookingThreshold: 'asc' },
        },
      },
    });

    // If no levels exist, initialize defaults
    if (settings.providerCategoryLevels.length === 0) {
      const defaultLevels = [
        { name: 'Bronze', bookingThreshold: 0, benefits: 'Standard benefits' },
        { name: 'Silver', bookingThreshold: 50, benefits: 'Increased visibility' },
        { name: 'Gold', bookingThreshold: 150, benefits: 'Premium support' },
        { name: 'Platinum', bookingThreshold: 300, benefits: 'Low commission' },
      ];

      await this.prisma.providerCategoryLevel.createMany({
        data: defaultLevels.map((lvl) => ({
          platformSettingsId: this.SETTINGS_ID,
          ...lvl,
        })),
      });

      // Re-fetch with levels
      return this.getPlatformSettings(userId);
    }

    return ApiResponse.success('Settings fetched successfully', settings);
  }

  async getPlatformSettingsHistory(
    userId: string,
    cursor?: string,
    limit = 20,
    search?: string
  ) {
    limit = Math.min(limit, 50);

    const admin = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!admin) throw new NotFoundException('Admin not found');
    if (admin.role !== 'ADMIN')
      throw new ForbiddenException(
        'You do not have permission to view history'
      );

    const history = await this.prisma.platformSettingsHistory.findMany({
      take: limit + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
      where: {
        ...(search && {
          updatedBy: {
            OR: [
              { fullName: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ],
          },
        }),
      },
      select: {
        id: true,
        platformFeeOld: true,
        platformFeeNew: true,
        commissionRateOld: true,
        commissionRateNew: true,
        updatedAt: true,
        version: true,
        updatedBy: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    const hasNextPage = history.length > limit;
    const data = hasNextPage ? history.slice(0, limit) : history;

    const nextCursor = hasNextPage ? data[data.length - 1].id : null;

    return ApiResponse.success('Settings history fetched successfully', {
      items: data,
      nextCursor,
    });
  }

  // helper
  async getPlatformSettingsValues(): Promise<{
    platformFee: number;
    commissionRate: number;
  }> {
    const settings = await this.prisma.platformSettings.findUnique({
      where: { id: this.SETTINGS_ID },
      select: {
        platformFee: true,
        commissionRate: true,
      },
    });

    if (!settings) {
      throw new Error('Platform settings not initialized');
    }

    return {
      platformFee: Number(settings.platformFee),
      commissionRate: Number(settings.commissionRate),
    };
  }
}
