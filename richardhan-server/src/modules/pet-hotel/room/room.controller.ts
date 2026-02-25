import {
  Body,
  Controller,
  Delete,
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
import { CurrentHotel } from 'src/common/decorators/current-hotel.decorator';
import { RequireVerifiedProfile } from 'src/common/decorators/require-verified-profile.decorator';
import { Roles } from 'src/common/decorators/role.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ProfileGuard } from 'src/common/guards/profile.guard';
import { VerifiedProfileGuard } from 'src/common/guards/verified-profile.guard';
import { Role } from 'src/common/types/auth.types';
import { storageConfig } from 'src/config/storage.config';
import { CreateHotelRoomDto } from './dto/create-room.dto';
import { UpdateHotelRoomDto } from './dto/update-room.dto';
import { RoomService } from './room.service';

@ApiTags('Pet Hotel Room')
@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @ApiOperation({ summary: 'Create room' })
  @ApiConsumes('multipart/form-data')
  @UseGuards(AuthGuard, VerifiedProfileGuard)
  @RequireVerifiedProfile()
  @Roles(Role.PET_HOTEL)
  @UseInterceptors(FilesInterceptor('images', 10, { storage: storageConfig() }))
  @Post()
  create(
    @Body() dto: CreateHotelRoomDto,
    @CurrentHotel('id') profileId: string,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    return this.roomService.create(dto, profileId, files);
  }

  @ApiOperation({ summary: 'Get all rooms' })
  @Get('/all')
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.roomService.findAll(page, limit);
  }

  @ApiOperation({ summary: 'Get my hotel' })
  @UseGuards(AuthGuard, ProfileGuard)
  @Roles(Role.PET_HOTEL)
  @Get('/me')
  getMyHotelRooms(@CurrentHotel('id') profileId: string) {
    return this.roomService.getMyHotelRooms(profileId);
  }

  @ApiOperation({ summary: 'Get all rooms by hotel id' })
  @UseGuards(AuthGuard)
  @Get('/:hotelId')
  findAllByHotel(@Param('hotelId') profileId: string) {
    return this.roomService.findAllByHotel(profileId);
  }

  @ApiOperation({ summary: 'Get single room details' })
  @UseGuards(AuthGuard)
  @Get('/details/:roomId')
  findOne(@Param('roomId') roomId: string) {
    return this.roomService.findOne(roomId);
  }

  @ApiOperation({ summary: 'Update room by hotel admin' })
  @UseGuards(AuthGuard, VerifiedProfileGuard)
  @UseInterceptors(FilesInterceptor('images', 10, { storage: storageConfig() }))
  @ApiConsumes('multipart/form-data')
  @RequireVerifiedProfile()
  @Roles(Role.PET_HOTEL)
  @Patch('/update/:roomId')
  update(
    @Param('roomId') roomId: string,
    @Body() dto: UpdateHotelRoomDto,
    @CurrentHotel('id') hotelId: string,
    @UploadedFiles() files?: Express.Multer.File[]
  ) {
    return this.roomService.update(roomId, hotelId, dto, files);
  }

  @ApiOperation({ summary: 'Remove room by hotel admin' })
  @UseGuards(AuthGuard, ProfileGuard)
  @Roles(Role.PET_HOTEL)
  @Delete('/remove/:roomId')
  remove(
    @Param('roomId') roomId: string,
    @CurrentHotel('id') profileId: string
  ) {
    return this.roomService.remove(roomId, profileId);
  }
}
