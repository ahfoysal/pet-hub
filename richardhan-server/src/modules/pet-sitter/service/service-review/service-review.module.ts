import { Module } from '@nestjs/common';
import { ServiceReviewService } from './service-review.service';
import { ServiceReviewController } from './service-review.controller';

@Module({
  controllers: [ServiceReviewController],
  providers: [ServiceReviewService],
})
export class ServiceReviewModule {}
