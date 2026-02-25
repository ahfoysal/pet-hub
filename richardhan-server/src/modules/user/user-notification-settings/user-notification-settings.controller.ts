import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UserNotificationSettingsService } from './user-notification-settings.service';
import { CurrentUser } from 'src/common/decorators/get-user.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { UpdateUserNotificationSettingsDto } from './dto/user-notification-settings.dto';

@ApiTags('Notification Settings')
@UseGuards(AuthGuard)
@Controller('user-notification-settings')
export class UserNotificationSettingsController {
  constructor(
    private readonly userNotificationSettingsService: UserNotificationSettingsService
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get my notification settings' })
  async getMyNotificationSettings(@CurrentUser('id') userId: string) {
    return this.userNotificationSettingsService.getMyNotificationSettings(
      userId
    );
  }

  @Patch()
  @ApiOperation({ summary: 'Update my notification settings' })
  async updateUserNotificationSettings(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateUserNotificationSettingsDto
  ) {
    return this.userNotificationSettingsService.updateUserNotificationSettings(
      userId,
      dto
    );
  }
}
