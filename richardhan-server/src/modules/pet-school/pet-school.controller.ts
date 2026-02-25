import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CourseEnrollmentStatus } from '@prisma/client';
import { CurrentSchool } from 'src/common/decorators/current-school.decorator';
import { CurrentUser } from 'src/common/decorators/get-user.decorator';
import { RequireVerifiedProfile } from 'src/common/decorators/require-verified-profile.decorator';
import { Roles } from 'src/common/decorators/role.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ProfileGuard } from 'src/common/guards/profile.guard';
import { Role } from 'src/common/types/auth.types';
import type { User } from 'src/common/types/user.type';
import { storageConfig } from 'src/config/storage.config';
import { UpdateAddressDto } from '../vendor/dto/update-address.dto';
import { CreatePetSchoolProfileDto } from './dto/pet-school-profile.dto';
import { UpdateSchoolProfileDto } from './dto/update-pet-school.dto';
import { PetSchoolService } from './pet-school.service';

@ApiTags('Pet School')
@Controller('pet-school')
export class PetSchoolController {
  constructor(private readonly petSchoolService: PetSchoolService) {}

  @ApiOperation({ summary: 'Profile Setup' })
  @UseGuards(AuthGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images', 10, { storage: storageConfig() }))
  @Post('profile-setup')
  profileSetup(
    @Body() dto: CreatePetSchoolProfileDto,
    @CurrentUser() user: User,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    return this.petSchoolService.profileSetup(dto, user, files);
  }

  @ApiOperation({ summary: 'Get My Profile' })
  @UseGuards(AuthGuard, ProfileGuard)
  @Roles(Role.PET_SCHOOL)
  @Get('profile')
  getMyProfile(@CurrentUser('id') userId: string) {
    return this.petSchoolService.getMyProfile(userId);
  }

  @ApiOperation({ summary: 'Update Pet School Profile' })
  @UseGuards(AuthGuard)
  @Patch('profile')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images', 10, { storage: storageConfig() }))
  updateSchoolProfile(
    @Body() dto: UpdateSchoolProfileDto,
    @CurrentUser() user: User,
    @UploadedFiles() files?: Express.Multer.File[]
  ) {
    return this.petSchoolService.updateSchoolProfile(dto, user, files);
  }

  @ApiOperation({ summary: 'Update Vendor Address' })
  @UseGuards(AuthGuard)
  @Patch('address/:id')
  async updateSchoolAddress(
    @CurrentUser() user: User,
    @Param('id') addressId: string,
    @Body() dto: UpdateAddressDto
  ) {
    return await this.petSchoolService.updateSchoolAddress(
      user,
      addressId,
      dto
    );
  }

  @ApiOperation({ summary: 'Get My Students' })
  @UseGuards(AuthGuard, ProfileGuard)
  @Roles(Role.PET_SCHOOL)
  @RequireVerifiedProfile()
  @Get('students')
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'status', required: false })
  async getMyStudents(
    @CurrentSchool('id') petSchoolId: string,
    @Query('search') search?: string,
    @Query('status') status?: CourseEnrollmentStatus
  ) {
    return await this.petSchoolService.getMyStudents(
      petSchoolId,
      search,
      status
    );
  }
}
