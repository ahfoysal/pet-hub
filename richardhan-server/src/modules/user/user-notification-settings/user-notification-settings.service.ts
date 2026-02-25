import { Injectable } from '@nestjs/common';
import { ApiResponse } from 'src/common/response/api-response';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { UpdateUserNotificationSettingsDto } from './dto/user-notification-settings.dto';

@Injectable()
export class UserNotificationSettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyNotificationSettings(userId: string) {
    const notificationSettings =
      await this.prisma.userNotificationsSettings.upsert({
        where: { userId },
        update: {}, // nothing to update if it exists
        create: { userId }, // defaults from DB/model will apply
      });

    return ApiResponse.success(
      'Notification settings found',
      notificationSettings
    );
  }

  async updateUserNotificationSettings(
    userId: string,
    dto: UpdateUserNotificationSettingsDto
  ) {
    const dataToUpdate: Record<string, any> = {};
    if (dto.email !== undefined) dataToUpdate.enableEmail = dto.email;
    if (dto.pushNotification !== undefined)
      dataToUpdate.enablePush = dto.pushNotification;

    const notificationSettings =
      await this.prisma.userNotificationsSettings.upsert({
        where: { userId },
        update: dataToUpdate,
        create: { userId, ...dataToUpdate },
      });

    return ApiResponse.success(
      'Notification settings updated',
      notificationSettings
    );
  }
}
