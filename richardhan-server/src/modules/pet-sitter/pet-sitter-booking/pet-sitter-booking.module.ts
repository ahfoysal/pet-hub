import { Module } from '@nestjs/common';
import { PetSitterBookingService } from './pet-sitter-booking.service';
import { PetSitterBookingController } from './pet-sitter-booking.controller';
import { PlatformSettingsService } from 'src/modules/admin/platform-settings/platform-settings.service';

@Module({
  controllers: [PetSitterBookingController],
  providers: [PetSitterBookingService, PlatformSettingsService],
  exports: [],
})
export class PetSitterBookingModule {}
