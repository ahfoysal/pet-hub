import { Module } from '@nestjs/common';
import { RoomAvailabilityController } from './room-availability.controller';
import { RoomAvailabilityService } from './room-availability.service';

@Module({
  controllers: [RoomAvailabilityController],
  providers: [RoomAvailabilityService],
  exports: [RoomAvailabilityService],
})
export class RoomAvailabilityModule {}
