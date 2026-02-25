import { Module } from '@nestjs/common';
import { PlatformSettingsModule } from 'src/modules/admin/platform-settings/platform-settings.module';
import { RoomAvailabilityModule } from '../room-availability/room-availability.module';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';

@Module({
  controllers: [BookingController],
  providers: [BookingService],
  imports: [RoomAvailabilityModule, PlatformSettingsModule],
})
export class BookingModule {}
