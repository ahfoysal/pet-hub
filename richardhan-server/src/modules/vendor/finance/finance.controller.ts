import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentVendor } from 'src/common/decorators/current-vendor.decorator';
import { Roles } from 'src/common/decorators/role.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { VerifiedProfileGuard } from 'src/common/guards/verified-profile.guard';
import { Role } from 'src/common/types/auth.types';
import { FinanceService } from './finance.service';
import { FinanceQueryDto } from './dto/finance-query.dto';

@ApiTags('Vendor - Finance')
@Controller('vendor/finance')
@UseGuards(AuthGuard, VerifiedProfileGuard)
@Roles(Role.VENDOR)
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @ApiOperation({ summary: 'Get vendor finance overview (KPI cards)' })
  @Get('overview')
  getOverview(@CurrentVendor('id') vendorId: string) {
    return this.financeService.getOverview(vendorId);
  }

  @ApiOperation({ summary: 'Get vendor payment history (paginated & filtered)' })
  @Get('history')
  getHistory(
    @CurrentVendor('id') vendorId: string,
    @Query() query: FinanceQueryDto,
  ) {
    return this.financeService.getHistory(vendorId, query);
  }

  @ApiOperation({ summary: 'Get payment timeline data' })
  @Get('timeline')
  getTimeline(@CurrentVendor('id') vendorId: string) {
    return this.financeService.getTimeline(vendorId);
  }
}
