import { Module } from '@nestjs/common';
import { PetOwnerSummaryService } from './pet-owner-summary.service';
import { PetOwnerSummaryController } from './pet-owner-summary.controller';

@Module({
  controllers: [PetOwnerSummaryController],
  providers: [PetOwnerSummaryService],
})
export class PetOwnerSummaryModule {}
