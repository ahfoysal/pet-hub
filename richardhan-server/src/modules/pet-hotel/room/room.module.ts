import { Module } from '@nestjs/common';
import { RoomAvailabilityModule } from '../room-availability/room-availability.module';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';

@Module({
  imports: [RoomAvailabilityModule],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}
