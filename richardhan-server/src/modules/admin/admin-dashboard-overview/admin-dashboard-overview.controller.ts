import {
  Controller,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminDashboardOverviewService } from './admin-dashboard-overview.service';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/types/auth.types';

@ApiTags('Admin - Dashboard Overview')
@UseGuards(AuthGuard)
@Roles(Role.ADMIN)
@Controller('admin-dashboard-overview')
export class AdminDashboardOverviewController {
  constructor(
    private readonly adminDashboardOverviewService: AdminDashboardOverviewService
  ) {}

  @Get('roles/count')
  @ApiOperation({
    summary: 'Get users count grouped by role',
    description:
      'Returns the total number of users grouped by each non-admin role.',
  })
  async getRolesCount() {
    return this.adminDashboardOverviewService.getUsersCountByRole();
  }

  @Get('/admins/analytics')
  @ApiOperation({
    summary: 'Get Admin Analytics',
    description: 'Returns the analytics related to Admin users (total, active, suspended, actions taken).',
  })
  async getAdminAnalytics() {
    return this.adminDashboardOverviewService.getAdminAnalytics();
  }

  @Get('/admins')
  @ApiOperation({
    summary: 'Get all admins',
    description: 'Returns a paginated list of admin users.',
  })
  @ApiQuery({ name: 'search', required: false, description: 'Search by name, email, or username' })
  @ApiQuery({ name: 'cursor', required: false, description: 'Cursor for pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Limit' })
  async getAllAdmins(
    @Query('search') search?: string,
    @Query('cursor') cursor?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 20
  ) {
    return this.adminDashboardOverviewService.getAllAdmins(search, cursor, limit);
  }

  @Get('/kyc/recent')
  @ApiOperation({
    summary: 'Get recent kyc',
    description: 'Returns the recent kyc.',
  })
  async getRecentKyc() {
    return this.adminDashboardOverviewService.getRecentKyc();
  }

  @Get('/pet-sitter')
  @ApiOperation({
    summary: 'Get all pet sitters',
    description: 'Returns paginated list of active pet sitters.',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by full name or email',
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    description: 'Cursor for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of records per page (max 50)',
    type: Number,
  })
  async getAllPetSitters(
    @Query('search') search?: string,
    @Query('cursor') cursor?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 20
  ) {
    return this.adminDashboardOverviewService.getAllPetSitters(
      search,
      cursor,
      limit
    );
  }

  @ApiOperation({ summary: 'Get all vendors with cursor pagination' })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'cursor', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @Get('vendors')
  async getAllVendors(
    @Query('search') search?: string,
    @Query('cursor') cursor?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number
  ) {
    return this.adminDashboardOverviewService.getAllVendors(
      search,
      cursor,
      limit ?? 20
    );
  }

  @Get('/hotels')
  @ApiOperation({ summary: 'Get all hotels with cursor pagination' })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'cursor', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  async getAllHotels(
    @Query('search') search?: string,
    @Query('cursor') cursor?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number
  ) {
    return this.adminDashboardOverviewService.getAllPetHotels(
      search,
      cursor,
      limit ?? 20
    );
  }

  @Get('/schools')
  @ApiOperation({ summary: 'Get all schools with cursor pagination' })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'cursor', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  async getAllSchools(
    @Query('search') search?: string,
    @Query('cursor') cursor?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number
  ) {
    return this.adminDashboardOverviewService.getAllSchool(
      search,
      cursor,
      limit ?? 20
    );
  }

  @Get('pet-owners')
  @ApiOperation({ summary: 'Get all pet owners with cursor pagination' })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'cursor', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  async getAllPetOwners(
    @Query('search') search?: string,
    @Query('cursor') cursor?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 20
  ) {
    return this.adminDashboardOverviewService.getPetOwners(
      search?.trim() || undefined,
      cursor,
      limit
    );
  }

  @Get('finance-stats')
  @ApiOperation({
    summary: 'Get platform finance statistics',
    description: 'Returns aggregated revenue, fees, and booking totals.',
  })
  async getFinanceStats() {
    return this.adminDashboardOverviewService.getFinanceStats();
  }

  @Get('transactions')
  @ApiOperation({
    summary: 'Get all transactions',
    description: 'Returns a detailed list of all payment transactions.',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'cursor', required: false, type: String })
  async getTransactions(
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 20,
    @Query('cursor') cursor?: string
  ) {
    return this.adminDashboardOverviewService.getTransactions(limit, cursor);
  }

  @Get('analytics/growth')
  @ApiOperation({
    summary: 'Get platform growth analytics',
    description: 'Returns monthly user and booking growth data.',
  })
  async getGrowthAnalytics() {
    return this.adminDashboardOverviewService.getGrowthAnalytics();
  }

  @Get('analytics/categories')
  @ApiOperation({
    summary: 'Get revenue by provider category',
    description: 'Returns breakdown of revenue and bookings by provider type.',
  })
  async getCategoryAnalytics() {
    return this.adminDashboardOverviewService.getCategoryAnalytics();
  }
}
