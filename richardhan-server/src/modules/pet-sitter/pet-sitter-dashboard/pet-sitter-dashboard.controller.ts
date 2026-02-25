import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/get-user.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { PetSitterDashboardService } from './pet-sitter-dashboard.service';

@Controller('pet-sitter-dashboard')
@UseGuards(AuthGuard)
@ApiTags("Pet Sitter's Dashboard")
export class PetSitterDashboardController {
  constructor(
    private readonly petSitterDashboardService: PetSitterDashboardService
  ) {}

  @Get('overview')
  @ApiOperation({ summary: "Get Pet Sitter's Stats" })
  async getStatsForMe(@CurrentUser('id') userId: string) {
    return await this.petSitterDashboardService.getStatsForMe(userId);
  }

  @Get('bookings/stats')
  @ApiOperation({ summary: "Get Pet Sitter's Booking Ratio for pie chart" })
  async getBookingRatio(@CurrentUser('id') userId: string) {
    return await this.petSitterDashboardService.getPieChartForBookingRatioByPackagesServices(
      userId
    );
  }

  // ---------------- Top performing ----------------
  @Get('performance/top/packages')
  @ApiOperation({ summary: 'Get Top Packages' })
  async getTopPackages(@CurrentUser('id') userId: string) {
    return await this.petSitterDashboardService.getTopPackages(userId);
  }

  @Get('performance/top/services')
  @ApiOperation({ summary: 'Get Top Services' })
  async getTopServices(@CurrentUser('id') userId: string) {
    return await this.petSitterDashboardService.getTopServices(userId);
  }

  // ---------------- Least performing ----------------
  @Get('performance/low/packages')
  @ApiOperation({ summary: 'Get Least Performing Packages' })
  async getLeastPerformingPackages(@CurrentUser('id') userId: string) {
    return await this.petSitterDashboardService.getLeastPerformingPackages(
      userId
    );
  }

  @Get('performance/low/services')
  @ApiOperation({ summary: 'Get Least Performing Services' })
  async getLeastPerformingServices(@CurrentUser('id') userId: string) {
    return await this.petSitterDashboardService.getLeastPerformingServices(
      userId
    );
  }

  // ---------------- Bookings ----------------
  @Get('bookings/recent')
  @ApiOperation({ summary: 'Get Recent Bookings' })
  async getRecentBookings(@CurrentUser('id') userId: string) {
    return await this.petSitterDashboardService.getRecentBookings(userId);
  }

  @Get('bookings/upcoming')
  @ApiOperation({ summary: 'Get Upcoming Bookings' })
  async getUpcomingBookings(@CurrentUser('id') userId: string) {
    return await this.petSitterDashboardService.getUpcomingBookings(userId);
  }

  // ---------------- Customers ----------------
  @Get('customers/top')
  @ApiOperation({ summary: 'Get Top Customers' })
  async getTopCustomers(@CurrentUser('id') userId: string) {
    return await this.petSitterDashboardService.getTopCustomers(userId);
  }

  // ---------------- Booking Trends ----------------
  @Get('bookings/trends')
  @ApiOperation({
    summary: 'Get Monthly Booking Trends',
    description: `Returns booking counts grouped by month for a given year. If no year is provided, the current year is used by default. Useful for line or bar chart visualization.`,
  })
  @ApiQuery({
    name: 'year',
    required: false,
    type: Number,
    example: 2026,
    description:
      'Optional year for filtering booking trends. Defaults to current year.',
  })
  async getBookingTrends(
    @CurrentUser('id') userId: string,
    @Query('year', new ParseIntPipe({ optional: true })) year?: number
  ) {
    return await this.petSitterDashboardService.getBookingTrends(userId, year);
  }

  @Get('clients')
  @ApiOperation({ summary: "Get Pet Sitter's Clients" })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Optional search by client name or email',
    type: String,
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    description: 'Cursor for pagination (last clientId from previous page)',
    type: String,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Maximum number of clients to return (default 10, max 50)',
    type: Number,
  })
  async getClients(
    @CurrentUser('id') userId: string,
    @Query('search') search?: string,
    @Query('cursor') cursor?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number
  ) {
    const finalLimit = limit ?? 10;

    return await this.petSitterDashboardService.getMyClientList(
      userId,
      search,
      cursor,
      finalLimit
    );
  }
  @Get('client/history/:id')
  @ApiOperation({ summary: 'Get booking history with a specific client' })
  @ApiParam({ name: 'id', description: 'Client ID' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by pet name, service, or package',
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    description: 'Cursor for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of bookings to fetch per page',
    type: Number,
  })
  async getClientHistory(
    @CurrentUser('id') userId: string,
    @Param('id') clientId: string,
    @Query('search') search?: string,
    @Query('cursor') cursor?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number
  ) {
    const finalLimit = Math.min(limit ?? 10, 50);
    return await this.petSitterDashboardService.getHistoryWithClients(
      userId,
      clientId,
      finalLimit,
      cursor,
      search
    );
  }
}
