import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CurrentHotel } from 'src/common/decorators/current-hotel.decorator';
import { Roles } from 'src/common/decorators/role.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ProfileGuard } from 'src/common/guards/profile.guard';
import { Role } from 'src/common/types/auth.types';
import { FinanceService } from './finance.service';

@ApiTags('Pet Hotel - Finance')
@Controller('pet-hotel/finance')
@UseGuards(AuthGuard, ProfileGuard)
@Roles(Role.PET_HOTEL)
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @ApiOperation({ summary: 'Get finance overview (KPI cards)' })
  @Get('overview')
  getOverview(@CurrentHotel('id') hotelProfileId: string) {
    return this.financeService.getOverview(hotelProfileId);
  }

  @ApiOperation({ summary: 'Get payment history (paginated)' })
  @Get('history')
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  getHistory(
    @CurrentHotel('id') hotelProfileId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.financeService.getHistory(hotelProfileId, page || 1, limit || 10);
  }

  @ApiOperation({ summary: 'Get payment timeline data' })
  @Get('timeline')
  getTimeline(@CurrentHotel('id') hotelProfileId: string) {
    return this.financeService.getTimeline(hotelProfileId);
  }
}
