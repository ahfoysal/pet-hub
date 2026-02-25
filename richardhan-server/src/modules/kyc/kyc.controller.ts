import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/get-user.decorator';
import { Roles } from 'src/common/decorators/role.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Role } from 'src/common/types/auth.types';
import type { User } from 'src/common/types/user.type';
import { storageConfig } from 'src/config/storage.config';
import { CreateKycDto } from './dto/submit-kyc.dto';
import { KycService } from './kyc.service';
import type { KycFiles } from './types/kyc-files.type';

@ApiTags('KYC')
@Controller('kyc')
export class KycController {
  constructor(private readonly kycService: KycService) {}

  // Submit KYC
  @ApiOperation({ summary: 'Submit KYC' })
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'identificationFrontImage', maxCount: 1 },
        { name: 'identificationBackImage', maxCount: 1 },
        { name: 'signatureImage', maxCount: 1 },
        { name: 'businessRegistrationCertificate', maxCount: 1 },
        { name: 'hotelLicenseImage', maxCount: 1 },
        { name: 'hygieneCertificate', maxCount: 1 },
        { name: 'facilityPhotos', maxCount: 10 },
      ],
      {
        storage: storageConfig(),
        limits: {
          fileSize: 10 * 1024 * 1024, // 10 MB per file
        },
      }
    )
  )
  @ApiConsumes('multipart/form-data')
  @Post('submit')
  async createKyc(
    @CurrentUser() user: User,
    @Body() dto: CreateKycDto,
    @UploadedFiles()
    files: KycFiles
  ) {
    const result = await this.kycService.createKyc(user, dto, files);
    return result;
  }

  // Get all kyc
  @ApiOperation({ summary: 'Get all kyc by admin' })
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @Get()
  async getAllKyc() {
    const result = await this.kycService.getAllKyc();
    return result;
  }

  // Get my kyc
  @ApiOperation({ summary: 'Get my kyc' })
  @UseGuards(AuthGuard)
  @Get('my-kyc')
  async getMyKyc(@CurrentUser('id') userId: string) {
    const result = await this.kycService.getMyKyc(userId);
    return result;
  }

  // Get kyc by id
  @ApiOperation({ summary: 'Get kyc by id by admin' })
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @Get(':id')
  async getKycById(@Param('id') id: string) {
    const result = await this.kycService.getKycById(id);
    return result;
  }

  // Approve kyc by admin
  @ApiOperation({ summary: 'Approve kyc by admin' })
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @Patch('approval/:id')
  async approveKyc(@Param('id') id: string, @CurrentUser('id') userId: string) {
    const result = await this.kycService.approveKyc(id, userId);
    return result;
  }

  // Reject kyc by admin
  @ApiOperation({ summary: 'Reject kyc by admin' })
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @Patch('rejection/:id')
  async rejectKyc(@Param('id') id: string, @CurrentUser('id') userId: string) {
    const result = await this.kycService.rejectKyc(id, userId);
    return result;
  }
}
