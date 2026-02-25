import { Module } from '@nestjs/common';
import { VendorSettingsController } from './vendor-settings.controller';
import { VendorSettingsService } from './vendor-settings.service';

@Module({
  controllers: [VendorSettingsController],
  providers: [VendorSettingsService],
})
export class VendorSettingsModule {}
