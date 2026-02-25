import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CurrentHotel } from 'src/common/decorators/current-hotel.decorator';
import { CurrentUser } from 'src/common/decorators/get-user.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ProfileGuard } from 'src/common/guards/profile.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/types/auth.types';
import { BookingService } from './booking.service';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { HotelBookingsQueryDto } from './dto/hotel-bookings-query.dto';

@ApiTags('Pet Hotel Booking')
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @ApiOperation({ summary: 'Create a new room booking' })
  @UseGuards(AuthGuard)
  @Post('create')
  createBooking(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateBookingDto
  ) {
    return this.bookingService.createBooking(userId, dto);
  }

  @ApiOperation({ summary: 'Get my bookings' })
  @UseGuards(AuthGuard)
  @Get('my-bookings')
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  getMyBookings(
    @CurrentUser('id') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    return this.bookingService.getMyBookings(userId, page, limit);
  }

  @ApiOperation({
    summary: 'Get hotel bookings (hotel side)',
    description:
      'List bookings for the current hotel with optional search (owner name, pet name, room name/number) and status filter.',
  })
  @UseGuards(AuthGuard, ProfileGuard)
  @Roles(Role.PET_HOTEL)
  @Get('hotel-bookings')
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED'],
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  getHotelBookings(
    @CurrentHotel('id') hotelProfileId: string,
    @Query() query: HotelBookingsQueryDto
  ) {
    return this.bookingService.getHotelBookings(hotelProfileId, query);
  }

  @ApiOperation({ summary: 'Get booking by ID' })
  @UseGuards(AuthGuard)
  @Get(':id')
  getById(@Param('id') bookingId: string, @CurrentUser('id') userId: string) {
    return this.bookingService.getById(bookingId, userId);
  }

  @ApiOperation({ summary: 'Cancel a booking' })
  @UseGuards(AuthGuard)
  @Patch(':id/cancel')
  cancelBooking(
    @Param('id') bookingId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CancelBookingDto
  ) {
    return this.bookingService.cancelBooking(
      bookingId,
      userId,
      dto.cancelledBy
    );
  }
}
