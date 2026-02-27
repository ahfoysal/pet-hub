import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CurrentHotel } from 'src/common/decorators/current-hotel.decorator';
import { Roles } from 'src/common/decorators/role.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ProfileGuard } from 'src/common/guards/profile.guard';
import { Role } from 'src/common/types/auth.types';
import { HotelReviewService } from './hotel-review.service';
import { ReplyToReviewDto } from './dto/hotel-review.dto';

@ApiTags('Pet Hotel - Review')
@Controller('pet-hotel/review')
@UseGuards(AuthGuard, ProfileGuard)
@Roles(Role.PET_HOTEL)
export class HotelReviewController {
  constructor(private readonly hotelReviewService: HotelReviewService) {}

  @ApiOperation({ summary: 'Get hotel review stats' })
  @Get('stats')
  getStats(@CurrentHotel('id') hotelProfileId: string) {
    return this.hotelReviewService.getStats(hotelProfileId);
  }

  @ApiOperation({ summary: 'Get all reviews for the hotel' })
  @Get()
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  getReviews(
    @CurrentHotel('id') hotelProfileId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.hotelReviewService.getReviews(hotelProfileId, page || 1, limit || 10);
  }

  @ApiOperation({ summary: 'Reply to a review' })
  @Patch(':id/reply')
  reply(
    @Param('id') reviewId: string,
    @CurrentHotel('id') hotelProfileId: string,
    @Body() dto: ReplyToReviewDto,
  ) {
    return this.hotelReviewService.reply(reviewId, hotelProfileId, dto);
  }
}
