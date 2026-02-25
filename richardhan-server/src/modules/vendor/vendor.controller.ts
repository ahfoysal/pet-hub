import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/get-user.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import type { User } from 'src/common/types/user.type';
import { storageConfig } from 'src/config/storage.config';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { VendorService } from './vendor.service';

@ApiTags('Vendor')
@Controller('vendor')
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @ApiOperation({ summary: 'Profile Setup' })
  @UseGuards(AuthGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images', 10, { storage: storageConfig() }))
  @Post('profile-setup')
  async profileSetup(
    @Body() dto: CreateVendorDto,
    @CurrentUser() user: User,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    return await this.vendorService.profileSetup(dto, user, files);
  }

  @ApiOperation({ summary: 'Get Vendor Profile' })
  @UseGuards(AuthGuard)
  @Get('profile')
  async getVendorProfile(@CurrentUser() user: User) {
    return await this.vendorService.getVendorProfile(user.id);
  }

  @ApiOperation({ summary: 'Update Vendor Profile' })
  @UseGuards(AuthGuard)
  @Put('profile')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images', 10, { storage: storageConfig() }))
  async updateVendorProfile(
    @Body() dto: UpdateVendorDto,
    @CurrentUser() user: User,
    @UploadedFiles() files?: Express.Multer.File[]
  ) {
    return await this.vendorService.updateVendorProfile(dto, user, files);
  }

  @ApiOperation({ summary: 'Update Vendor Address' })
  @UseGuards(AuthGuard)
  @Patch('address/:id')
  async updateVendorAddress(
    @CurrentUser() user: User,
    @Param('id') addressId: string,
    @Body() dto: UpdateAddressDto
  ) {
    return await this.vendorService.updateVendorAddress(user, addressId, dto);
  }
}
