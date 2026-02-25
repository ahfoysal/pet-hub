import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentVendor } from 'src/common/decorators/current-vendor.decorator';
import { RequireVerifiedProfile } from 'src/common/decorators/require-verified-profile.decorator';
import { Roles } from 'src/common/decorators/role.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { VerifiedProfileGuard } from 'src/common/guards/verified-profile.guard';
import { Role } from 'src/common/types/auth.types';
import { DashboardService } from './dashboard.service';

@UseGuards(AuthGuard, VerifiedProfileGuard)
@ApiTags('Vendor')
@Controller('vendor/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiOperation({ summary: 'Get vendor dashboard page data' })
  @RequireVerifiedProfile()
  @Roles(Role.VENDOR)
  @Get()
  getVendorDashboard(
    @CurrentVendor('id') vendorId: string,
    @Query('period') period: 'Daily' | 'Weekly' | 'Monthly' = 'Daily'
  ) {
    return this.dashboardService.getVendorDashboard(vendorId, period);
  }

  @ApiOperation({ summary: 'Get inventory page data' })
  @RequireVerifiedProfile()
  @Roles(Role.VENDOR)
  @Get('inventory')
  getInventoryPageData(@CurrentVendor('id') vendorId: string) {
    return this.dashboardService.getInventoryPageData(vendorId);
  }

  @ApiOperation({ summary: 'Get analytics page data' })
  @RequireVerifiedProfile()
  @Roles(Role.VENDOR)
  @Get('analytics')
  getAnalytics(@CurrentVendor('id') vendorId: string) {
    return this.dashboardService.getAnalyticsPageData(vendorId);
  }

  @ApiOperation({ summary: 'Get finance page data' })
  @RequireVerifiedProfile()
  @Roles(Role.VENDOR)
  @Get('finance')
  getFinance(@CurrentVendor('id') vendorId: string) {
    return this.dashboardService.getFinancePageData(vendorId);
  }
}
