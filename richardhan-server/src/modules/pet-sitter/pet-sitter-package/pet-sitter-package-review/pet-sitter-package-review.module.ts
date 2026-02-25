import { Module } from '@nestjs/common';
import { PetSitterPackageReviewService } from './pet-sitter-package-review.service';
import { PetSitterPackageReviewController } from './pet-sitter-package-review.controller';

@Module({
  controllers: [PetSitterPackageReviewController],
  providers: [PetSitterPackageReviewService],
})
export class PetSitterPackageReviewModule {}
