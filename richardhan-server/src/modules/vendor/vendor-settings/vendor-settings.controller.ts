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
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/get-user.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { VendorSettingsService } from './vendor-settings.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateVendorDetailsDto } from './dto/update-vendor-details.dto';
import { UpdateNotificationSettingsDto } from './dto/update-notification-settings.dto';
import { UpdateBankingDto } from './dto/update-banking.dto';

@ApiTags('Vendor Settings')
@Controller('vendor/settings')
@UseGuards(AuthGuard)
export class VendorSettingsController {
  constructor(private readonly vendorSettingsService: VendorSettingsService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get Vendor Profile' })
  async getProfile(@CurrentUser('id') userId: string) {
    return await this.vendorSettingsService.getProfile(userId);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update Vendor Profile' })
  async updateProfile(@CurrentUser('id') userId: string, @Body() dto: UpdateProfileDto) {
    return await this.vendorSettingsService.updateProfile(userId, dto);
  }

  @Get('vendor-details')
  @ApiOperation({ summary: 'Get Vendor Details' })
  async getVendorDetails(@CurrentUser('id') userId: string) {
    return await this.vendorSettingsService.getVendorDetails(userId);
  }

  @Patch('vendor-details')
  @ApiOperation({ summary: 'Update Vendor Details' })
  async updateVendorDetails(@CurrentUser('id') userId: string, @Body() dto: UpdateVendorDetailsDto) {
    return await this.vendorSettingsService.updateVendorDetails(userId, dto);
  }

  @Get('notifications')
  @ApiOperation({ summary: 'Get Notification Settings' })
  async getNotificationSettings(@CurrentUser('id') userId: string) {
    return await this.vendorSettingsService.getNotificationSettings(userId);
  }

  @Patch('notifications')
  @ApiOperation({ summary: 'Update Notification Settings' })
  async updateNotificationSettings(@CurrentUser('id') userId: string, @Body() dto: UpdateNotificationSettingsDto) {
    return await this.vendorSettingsService.updateNotificationSettings(userId, dto);
  }

  @Get('banking')
  @ApiOperation({ summary: 'Get Banking Info' })
  async getBankingInfo(@CurrentUser('id') userId: string) {
    return await this.vendorSettingsService.getBankingInfo(userId);
  }

  @Patch('banking')
  @ApiOperation({ summary: 'Update Banking Info' })
  async updateBankingInfo(@CurrentUser('id') userId: string, @Body() dto: UpdateBankingDto) {
    return await this.vendorSettingsService.updateBankingInfo(userId, dto);
  }

  @Get('documents')
  @ApiOperation({ summary: 'Get Documents' })
  async getDocuments(@CurrentUser('id') userId: string) {
    return await this.vendorSettingsService.getDocuments(userId);
  }

  @Post('documents')
  @ApiOperation({ summary: 'Upload Documents' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadDocuments(@CurrentUser('id') userId: string, @UploadedFiles() files: Express.Multer.File[]) {
    return await this.vendorSettingsService.uploadDocuments(userId, files);
  }
}
