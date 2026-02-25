import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ApiResponse } from 'src/common/response/api-response';
import { CheckAvailabilityQueriesDto } from './dto/check-availability-queries.dto';
import { SearchRoomsQueryDto } from './dto/search-rooms-query.dto';
import { RoomAvailabilityService } from './room-availability.service';

@ApiTags('Pet Hotel - Room Availability')
@Controller('room-availability')
export class RoomAvailabilityController {
  constructor(
    private readonly roomAvailabilityService: RoomAvailabilityService
  ) {}

  @ApiOperation({ summary: 'Search rooms available for a date range' })
  @Get('search')
  async searchRooms(@Query() query: SearchRoomsQueryDto) {
    const checkIn = new Date(query.checkIn);
    const checkOut = new Date(query.checkOut);
    if (checkOut <= checkIn) {
      return ApiResponse.error('checkOut must be after checkIn');
    }
    const results = await this.roomAvailabilityService.searchAvailableRooms(
      checkIn,
      checkOut,
      query.hotelId
    );
    return ApiResponse.success('Rooms fetched successfully', results);
  }

  @ApiOperation({ summary: 'Check room availability' })
  @ApiParam({
    name: 'roomId',
    example: 'a3f1c9e4-2d9c-4b0a-9b6f-123456789abc',
    description: 'Room ID',
  })
  @ApiParam({
    name: 'checkIn',
    example: '2026-01-20',
    description: 'Check-in date (YYYY-MM-DD)',
  })
  @ApiParam({
    name: 'checkOut',
    example: '2026-01-25',
    description: 'Check-out date (YYYY-MM-DD)',
  })
  @Get('check/:roomId/:checkIn/:checkOut')
  checkAvailability(@Param() params: CheckAvailabilityQueriesDto) {
    return this.roomAvailabilityService.checkAvailability(
      params.roomId,
      new Date(params.checkIn),
      new Date(params.checkOut)
    );
  }
}
