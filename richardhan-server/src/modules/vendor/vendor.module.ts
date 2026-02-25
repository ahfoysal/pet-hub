import { Module } from '@nestjs/common';
import { VendorController } from './vendor.controller';
import { VendorService } from './vendor.service';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { VariantModule } from './variant/variant.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { VendorSettingsModule } from './vendor-settings/vendor-settings.module';

@Module({
  imports: [
    ProductModule,
    OrderModule,
    VariantModule,
    DashboardModule,
    VendorSettingsModule,
  ],
  controllers: [VendorController],
  providers: [VendorService],
})
export class VendorModule {}
