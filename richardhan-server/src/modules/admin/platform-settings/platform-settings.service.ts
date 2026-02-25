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
    });

    if (!settings) {
      await this.prisma.platformSettings.create({
        data: { id: this.SETTINGS_ID, ...payload },
      });
      return ApiResponse.success('Settings created successfully');
    }

    // ✅ CHANGE DETECTION (number vs Decimal)
    const hasChanged =
      (payload.platformFee !== undefined &&
        Number(settings.platformFee) !== payload.platformFee) ||
      (payload.commissionRate !== undefined &&
        Number(settings.commissionRate) !== payload.commissionRate);

    if (!hasChanged) {
      return ApiResponse.success('No changes detected');
    }

    const now = new Date();

    await this.prisma.$transaction([
      // Save old + new values in history
      this.prisma.platformSettingsHistory.create({
        data: {
          platformSettingsId: settings.id,
          updatedById: userId,
          version: settings.version,
          updatedAt: now,
          platformFeeOld: settings.platformFee,
          platformFeeNew: payload.platformFee ?? settings.platformFee,
          commissionRateOld: settings.commissionRate,
          commissionRateNew: payload.commissionRate ?? settings.commissionRate,
        },
      }),
      // Update current settings
      this.prisma.platformSettings.update({
        where: { id: this.SETTINGS_ID },
        data: {
          ...payload,
          version: { increment: 1 },
          updatedAt: now,
        },
      }),
    ]);

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
    });

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
