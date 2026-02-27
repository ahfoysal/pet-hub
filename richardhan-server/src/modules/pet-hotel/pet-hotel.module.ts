import { Module } from '@nestjs/common';
import { AnalyticsModule } from './analytics/analytics.module';
import { HotelReviewModule } from "./review/hotel-review.module";
import { FinanceModule } from './finance/finance.module';
import { FoodModule } from './food/food.module';
import { PetHotelController } from './pet-hotel.controller';
import { PetHotelService } from './pet-hotel.service';
import { RoomAvailabilityModule } from './room-availability/room-availability.module';
import { RoomModule } from './room/room.module';
import { BookingModule } from './booking/booking.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { HotelSettingsModule } from './hotel-settings/hotel-settings.module';

@Module({
  controllers: [PetHotelController],
  providers: [PetHotelService],
  imports: [
    RoomModule,
    FoodModule,
    RoomAvailabilityModule,
    BookingModule,
    DashboardModule,
    HotelSettingsModule,
    AnalyticsModule,
    FinanceModule,
    HotelReviewModule,
  ],
})
export class PetHotelModule {}
