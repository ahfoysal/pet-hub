import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentSchool } from 'src/common/decorators/current-school.decorator';
import { RequireVerifiedProfile } from 'src/common/decorators/require-verified-profile.decorator';
import { Roles } from 'src/common/decorators/role.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ProfileGuard } from 'src/common/guards/profile.guard';
import { Role } from 'src/common/types/auth.types';
import { DashboardService } from './dashboard.service';

@ApiTags('Pet School Dashboard')
@Controller('pet-school/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  // @UseGuards(AuthGuard, ProfileGuard)
  // @Roles(Role.PET_SCHOOL)
  // @RequireVerifiedProfile()
  // @Get('stats')
  // getDashboardStats(@CurrentSchool('id') schoolId: string) {
  //   return this.dashboardService.getDashboardStats(schoolId);
  // }

  @UseGuards(AuthGuard, ProfileGuard)
  @Roles(Role.PET_SCHOOL)
  @RequireVerifiedProfile()
  @Get()
  getDashboardCharts(@CurrentSchool('id') schoolId: string) {
    return this.dashboardService.getDashboardCharts(schoolId);
  }
}
