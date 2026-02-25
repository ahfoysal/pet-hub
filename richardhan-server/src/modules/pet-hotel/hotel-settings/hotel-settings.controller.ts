import {
  Body,
  Controller,
  Get,
  Patch,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/get-user.decorator';
import { Roles } from 'src/common/decorators/role.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ProfileGuard } from 'src/common/guards/profile.guard';
import { Role } from 'src/common/types/auth.types';
import type { User } from 'src/common/types/user.type';
import { storageConfig } from 'src/config/storage.config';
import { HotelSettingsService } from './hotel-settings.service';
import { UpdateBankingDto } from './dto/update-banking.dto';
import { UpdateHotelDetailsDto } from './dto/update-hotel-details.dto';
import { UpdateNotificationSettingsDto } from './dto/update-notification-settings.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('Pet Hotel Settings')
@Controller('pet-hotel/settings')
@UseGuards(AuthGuard, ProfileGuard)
@Roles(Role.PET_HOTEL)
export class HotelSettingsController {
  constructor(private readonly hotelSettingsService: HotelSettingsService) {}

  @ApiOperation({ summary: 'Get owner profile' })
  @Get('profile')
  getProfile(@CurrentUser() user: User) {
    return this.hotelSettingsService.getProfile(user.id);
  }

  @ApiOperation({ summary: 'Update owner profile' })
  @Patch('profile')
  updateProfile(@CurrentUser() user: User, @Body() dto: UpdateProfileDto) {
    return this.hotelSettingsService.updateProfile(user.id, dto);
  }

  @ApiOperation({ summary: 'Get hotel details' })
  @Get('hotel')
  getHotelDetails(@CurrentUser() user: User) {
    return this.hotelSettingsService.getHotelDetails(user.id);
  }

  @ApiOperation({ summary: 'Update hotel details' })
  @Patch('hotel')
  updateHotelDetails(@CurrentUser() user: User, @Body() dto: UpdateHotelDetailsDto) {
    return this.hotelSettingsService.updateHotelDetails(user.id, dto);
  }

  @ApiOperation({ summary: 'Update password' })
  @Patch('security/password')
  updatePassword(@CurrentUser() user: User, @Body() dto: UpdatePasswordDto) {
    return this.hotelSettingsService.updatePassword(user.id, dto);
  }

  @ApiOperation({ summary: 'Toggle 2FA' })
  @Patch('security/2fa')
  toggle2FA(@CurrentUser() user: User, @Body('enable') enable: boolean) {
    return this.hotelSettingsService.toggle2FA(user.id, enable);
  }

  @ApiOperation({ summary: 'Get notification preferences' })
  @Get('notifications')
  getNotificationSettings(@CurrentUser() user: User) {
    return this.hotelSettingsService.getNotificationSettings(user.id);
  }

  @ApiOperation({ summary: 'Update notification preferences' })
  @Patch('notifications')
  updateNotificationSettings(@CurrentUser() user: User, @Body() dto: UpdateNotificationSettingsDto) {
    return this.hotelSettingsService.updateNotificationSettings(user.id, dto);
  }

  @ApiOperation({ summary: 'Get banking info' })
  @Get('banking')
  getBankingInfo(@CurrentUser() user: User) {
    return this.hotelSettingsService.getBankingInfo(user.id);
  }

  @ApiOperation({ summary: 'Update banking info' })
  @Patch('banking')
  updateBankingInfo(@CurrentUser() user: User, @Body() dto: UpdateBankingDto) {
    return this.hotelSettingsService.updateBankingInfo(user.id, dto);
  }

  @ApiOperation({ summary: 'Get documents' })
  @Get('documents')
  getDocuments(@CurrentUser() user: User) {
    return this.hotelSettingsService.getDocuments(user.id);
  }

  @ApiOperation({ summary: 'Upload/Replace documents' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('documents', 5, { storage: storageConfig() }))
  @Patch('documents')
  uploadDocuments(@CurrentUser() user: User, @UploadedFiles() files: Express.Multer.File[]) {
    return this.hotelSettingsService.uploadDocuments(user.id, files);
  }
}
