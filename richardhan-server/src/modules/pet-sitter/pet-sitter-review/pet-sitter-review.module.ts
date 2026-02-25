import { Module } from '@nestjs/common';
import { PetSitterReviewService } from './pet-sitter-review.service';
import { PetSitterReviewController } from './pet-sitter-review.controller';

@Module({
  controllers: [PetSitterReviewController],
  providers: [PetSitterReviewService],
})
export class PetSitterReviewModule {}
