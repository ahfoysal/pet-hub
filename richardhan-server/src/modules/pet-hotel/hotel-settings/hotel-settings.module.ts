import { Module } from '@nestjs/common';
import { CloudinaryModule } from 'src/common/utils/cloudinary/cloudinary.module';
import { HotelSettingsController } from './hotel-settings.controller';
import { HotelSettingsService } from './hotel-settings.service';

@Module({
  imports: [CloudinaryModule],
  controllers: [HotelSettingsController],
  providers: [HotelSettingsService],
  exports: [HotelSettingsService],
})
export class HotelSettingsModule {}
