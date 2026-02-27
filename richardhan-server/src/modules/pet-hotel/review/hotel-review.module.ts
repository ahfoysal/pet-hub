import { Module } from '@nestjs/common';
import { HotelReviewController } from './hotel-review.controller';
import { HotelReviewService } from './hotel-review.service';

@Module({
  controllers: [HotelReviewController],
  providers: [HotelReviewService],
  exports: [HotelReviewService],
})
export class HotelReviewModule {}
