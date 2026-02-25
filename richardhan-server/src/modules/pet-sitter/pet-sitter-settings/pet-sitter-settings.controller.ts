import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/get-user.decorator';
import { PetSitterSettingsService } from './pet-sitter-settings.service';
import { UpdateBankingDto } from './dto/update-banking.dto';
import { UpdateSitterDetailsDto } from './dto/update-sitter-details.dto';
import { UpdateNotificationSettingsDto } from './dto/update-notification-settings.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('Pet Sitter - Settings')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard)
@Controller('pet-sitter/settings')
export class PetSitterSettingsController {
  constructor(private readonly settingsService: PetSitterSettingsService) {}

  @ApiOperation({ summary: 'Get profile settings' })
  @Get('profile')
  getProfile(@CurrentUser('id') userId: string) {
    return this.settingsService.getProfile(userId);
  }

  @ApiOperation({ summary: 'Update profile settings' })
  @Patch('profile')
  updateProfile(@CurrentUser('id') userId: string, @Body() dto: UpdateProfileDto) {
    return this.settingsService.updateProfile(userId, dto);
  }

  @ApiOperation({ summary: 'Get pet sitter details' })
  @Get('sitter-details')
  getSitterDetails(@CurrentUser('id') userId: string) {
    return this.settingsService.getSitterDetails(userId);
  }

  @ApiOperation({ summary: 'Update pet sitter details' })
  @Patch('sitter-details')
  updateSitterDetails(@CurrentUser('id') userId: string, @Body() dto: UpdateSitterDetailsDto) {
    return this.settingsService.updateSitterDetails(userId, dto);
  }

  @ApiOperation({ summary: 'Update password' })
  @Patch('security/password')
  updatePassword(@CurrentUser('id') userId: string, @Body() dto: UpdatePasswordDto) {
    return this.settingsService.updatePassword(userId, dto);
  }

  @ApiOperation({ summary: 'Toggle 2FA' })
  @Patch('security/2fa')
  toggle2FA(@CurrentUser('id') userId: string, @Body('enable') enable: boolean) {
    return this.settingsService.toggle2FA(userId, enable);
  }

  @ApiOperation({ summary: 'Get notification settings' })
  @Get('notifications')
  getNotificationSettings(@CurrentUser('id') userId: string) {
    return this.settingsService.getNotificationSettings(userId);
  }

  @ApiOperation({ summary: 'Update notification settings' })
  @Patch('notifications')
  updateNotificationSettings(@CurrentUser('id') userId: string, @Body() dto: UpdateNotificationSettingsDto) {
    return this.settingsService.updateNotificationSettings(userId, dto);
  }

  @ApiOperation({ summary: 'Get banking info' })
  @Get('banking')
  getBankingInfo(@CurrentUser('id') userId: string) {
    return this.settingsService.getBankingInfo(userId);
  }

  @ApiOperation({ summary: 'Update banking info' })
  @Patch('banking')
  updateBankingInfo(@CurrentUser('id') userId: string, @Body() dto: UpdateBankingDto) {
    return this.settingsService.updateBankingInfo(userId, dto);
  }

  @ApiOperation({ summary: 'Get documents' })
  @Get('documents')
  getDocuments(@CurrentUser('id') userId: string) {
    return this.settingsService.getDocuments(userId);
  }

  @ApiOperation({ summary: 'Upload documents' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('files'))
  @Post('documents')
  uploadDocuments(@CurrentUser('id') userId: string, @UploadedFiles() files: Express.Multer.File[]) {
    return this.settingsService.uploadDocuments(userId, files);
  }
}
