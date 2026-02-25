import { Module } from '@nestjs/common';
import { PetSitterDashboardService } from './pet-sitter-dashboard.service';
import { PetSitterDashboardController } from './pet-sitter-dashboard.controller';

@Module({
  controllers: [PetSitterDashboardController],
  providers: [PetSitterDashboardService],
})
export class PetSitterDashboardModule {}
