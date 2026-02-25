import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentHotel } from 'src/common/decorators/current-hotel.decorator';
import { Roles } from 'src/common/decorators/role.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ProfileGuard } from 'src/common/guards/profile.guard';
import { Role } from 'src/common/types/auth.types';
import { AnalyticsService } from './analytics.service';

@ApiTags('Pet Hotel - Analytics')
@Controller('pet-hotel/analytics')
@UseGuards(AuthGuard, ProfileGuard)
@Roles(Role.PET_HOTEL)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @ApiOperation({ summary: 'Get analytics overview (KPI cards)' })
  @Get('overview')
  getOverview(@CurrentHotel('id') hotelProfileId: string) {
    return this.analyticsService.getOverview(hotelProfileId);
  }

  @ApiOperation({ summary: 'Get monthly booking trend' })
  @Get('trend')
  getTrend(@CurrentHotel('id') hotelProfileId: string) {
    return this.analyticsService.getOccupancyTrends(hotelProfileId);
  }

  @ApiOperation({ summary: 'Get revenue growth data' })
  @Get('revenue-growth')
  getRevenueGrowth(@CurrentHotel('id') hotelProfileId: string) {
    return this.analyticsService.getRevenueGrowth(hotelProfileId);
  }

  @ApiOperation({ summary: 'Get room type distribution' })
  @Get('distribution')
  getDistribution(@CurrentHotel('id') hotelProfileId: string) {
    return this.analyticsService.getRoomDistribution(hotelProfileId);
  }

  @ApiOperation({ summary: 'Get weekly occupancy rate' })
  @Get('occupancy-weekly')
  getWeeklyOccupancy(@CurrentHotel('id') hotelProfileId: string) {
    return this.analyticsService.getWeeklyOccupancy(hotelProfileId);
  }
}
