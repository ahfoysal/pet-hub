import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentHotel } from 'src/common/decorators/current-hotel.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ProfileGuard } from 'src/common/guards/profile.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/types/auth.types';
import { DashboardService } from './dashboard.service';

@ApiTags('Pet Hotel - Dashboard')
@Controller('pet-hotel/dashboard')
@UseGuards(AuthGuard, ProfileGuard)
@Roles(Role.PET_HOTEL)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiOperation({
    summary: 'Get dashboard data',
    description:
      'Returns stats (total active bookings, avg occupancy rate, avg stay duration, total revenue) and charts (monthly booking trend, weekly occupancy rate, room type distribution).',
  })
  @Get()
  getDashboard(@CurrentHotel('id') hotelProfileId: string) {
    return this.dashboardService.getDashboard(hotelProfileId);
  }
}
