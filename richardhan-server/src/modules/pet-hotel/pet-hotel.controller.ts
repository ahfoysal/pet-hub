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
import { CurrentHotel } from 'src/common/decorators/current-hotel.decorator';
import { CurrentUser } from 'src/common/decorators/get-user.decorator';
import { Roles } from 'src/common/decorators/role.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ProfileGuard } from 'src/common/guards/profile.guard';
import { Role } from 'src/common/types/auth.types';
import type { User } from 'src/common/types/user.type';
import { storageConfig } from 'src/config/storage.config';
import { UpdateAddressDto } from '../vendor/dto/update-address.dto';
import { CreateHotelProfileDto } from './dto/create-hotel-profile.dto';
import { UpdateHotelProfileDto } from './dto/update-hotel-profile.dto';
import { PetHotelService } from './pet-hotel.service';

@ApiTags('Pet Hotel')
@Controller('pet-hotel')
export class PetHotelController {
  constructor(private readonly petHotelService: PetHotelService) {}

  @ApiOperation({ summary: 'Get all Hotels' })
  @UseGuards(AuthGuard)
  @Get()
  getAllHotels() {
    return this.petHotelService.getAllHotels();
  }

  @ApiOperation({ summary: 'Hotel Profile Setup' })
  @UseGuards(AuthGuard)
  @Roles(Role.PET_HOTEL)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images', 10, { storage: storageConfig() }))
  @Post('profile-setup')
  async profileSetup(
    @Body() dto: CreateHotelProfileDto,
    @CurrentUser() user: User,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    return await this.petHotelService.profileSetup(dto, user, files);
  }

  @ApiOperation({ summary: 'Get My Hotel Profile' })
  @Roles(Role.PET_HOTEL)
  @Get('profile')
  @UseGuards(AuthGuard)
  getHotelProfile(@CurrentUser() user: User) {
    return this.petHotelService.getHotelProfile(user.id);
  }

  @ApiOperation({ summary: 'Update Hotel Profile' })
  @UseGuards(AuthGuard, ProfileGuard)
  @Roles(Role.PET_HOTEL)
  @Put('profile')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images', 10, { storage: storageConfig() }))
  updateHotelProfile(
    @Body() dto: UpdateHotelProfileDto,
    @CurrentUser() user: User,
    @UploadedFiles() files?: Express.Multer.File[]
  ) {
    return this.petHotelService.updateHotelProfile(dto, user, files);
  }

  // @ApiOperation({ summary: 'Get hotel address' })
  // @UseGuards(AuthGuard)
  // @Get('address/:id')
  // getHotelAddress(@Param('id') id: string) {
  //   return this.petHotelService.getHotelAddress(id);
  // }

  @ApiOperation({ summary: 'Update hotel address' })
  @UseGuards(AuthGuard, ProfileGuard)
  @Roles(Role.PET_HOTEL)
  @Patch('address')
  updateHotelAddress(
    @CurrentHotel('id') hotelId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAddressDto
  ) {
    return this.petHotelService.updateHotelAddress(id, hotelId, dto);
  }
}
