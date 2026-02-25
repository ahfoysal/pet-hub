import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ReportStatus, ReportType } from '@prisma/client';
import { CurrentUser } from 'src/common/decorators/get-user.decorator';
import { Roles } from 'src/common/decorators/role.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Role } from 'src/common/types/auth.types';
import { AddReportDto, TakeActionDto, UpdateReportDto } from './dto/report.dto';
import { ReportService } from './report.service';

@ApiTags('Community - Report ')
@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '[App] Add report (user, post, or reel)' })
  async addReport(
    @Body() payload: AddReportDto,
    @CurrentUser('id') reporterId: string
  ) {
    return this.reportService.addReport(payload, reporterId);
  }

  @Patch(':reportId')
  @UseGuards(AuthGuard)
  @ApiParam({
    name: 'reportId',
    type: 'string',
    description: 'ID of the report to update',
  })
  @ApiOperation({ summary: '[App] Update report by reporter' })
  async updateReport(
    @CurrentUser('id') reporterId: string,
    @Body() payload: UpdateReportDto,
    @Param('reportId') reportId: string
  ) {
    return this.reportService.updateReport(reportId, payload, reporterId);
  }

  @Patch(':reportId/take-action')
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: '[Admin | Web] Take action on a reported content or user',
    description: `
Allows an admin to take moderation action on a report.

Available actions:
- **IGNORE**: Dismiss the report without any action
- **DELETE**: Delete the reported content (post/reel)
- **HIDE**: Hide the reported content from public view
- **SUSPEND**: Temporarily suspend the reported user
- **BAN**: Permanently ban the reported user
`,
  })
  @ApiParam({
    name: 'reportId',
    type: String,
    description: 'Unique ID of the report',
    example: 'c2a9c1f1-8e3e-4a9b-9f1c-12a3bc456def',
  })
  @ApiResponse({
    status: 200,
    description: 'Action taken successfully',
  })
  @ApiResponse({
    status: 400,
    description:
      'Invalid action, missing suspend duration, or report already resolved',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async takeAction(
    @Body() payload: TakeActionDto,
    @Param('reportId') reportId: string
  ) {
    return this.reportService.takeAction(reportId, payload);
  }

  @Get()
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '[Admin | Web] Get all reports (table view)' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of reports to return (max 50)',
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    type: String,
    description: 'Cursor ID for pagination',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description:
      'Search term for reason, note, reporter, reported user, post, or reel',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ReportStatus,
    description: 'Filter by report status',
  })
  @ApiQuery({
    name: 'reportType',
    required: false,
    enum: ReportType,
    description: 'Filter by report type',
  })
  async getAllReports(
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('reportType') reportType?: string
  ) {
    // Convert query strings to correct types
    const numericLimit = limit ? Math.min(Number(limit), 50) : undefined;

    const filter = {
      status: status
        ? ReportStatus[status as keyof typeof ReportStatus]
        : undefined,
      reportType: reportType
        ? ReportType[reportType as keyof typeof ReportType]
        : undefined,
    };

    // Call the service for minimal fields (table view)
    return this.reportService.getAllReports(
      cursor,
      numericLimit,
      search,
      filter
    );
  }

  // ----------------------
  // Table view: My submitted reports
  // ----------------------
  @Get('/my-submitted-reports')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '[App] Get my submitted reports (table view)' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of reports to return (max 50)',
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    type: String,
    description: 'Cursor ID for pagination',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term for reason, note, post, or reel',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ReportStatus,
    description: 'Filter by report status',
  })
  @ApiQuery({
    name: 'reportType',
    required: false,
    enum: ReportType,
    description: 'Filter by report type',
  })
  async getMySubmittedReports(
    @CurrentUser('id') userId: string,
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('reportType') reportType?: string
  ) {
    return this.reportService.getMyReportedReports(
      userId,
      cursor,
      limit,
      search,
      status,
      reportType
    );
  }

  // ----------------------
  // Table view: Reports filed against me
  // ----------------------
  @Get('/reports-against-me')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '[App] Get reports filed against me (table view)' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of reports to return (max 50)',
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    type: String,
    description: 'Cursor ID for pagination',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term for reason, note, post, or reel',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ReportStatus,
    description: 'Filter by report status',
  })
  @ApiQuery({
    name: 'reportType',
    required: false,
    enum: ReportType,
    description: 'Filter by report type',
  })
  async getReportsAgainstMe(
    @CurrentUser('id') userId: string,
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('reportType') reportType?: string
  ) {
    return this.reportService.getReportAgainstMe(
      userId,
      cursor,
      limit,
      search,
      status,
      reportType
    );
  }

  @Delete(':reportId')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '[App] Delete own report' })
  @ApiParam({
    name: 'reportId',
    type: String,
    description: 'Unique ID of the report to delete',
    example: 'c2a9c1f1-8e3e-4a9b-9f1c-12a3bc456def',
  })
  async deleteReport(
    @Param('reportId') reportId: string,
    @CurrentUser('id') userId: string
  ) {
    return this.reportService.deleteReport(reportId, userId);
  }

  @Get('/my-reports/:reportId')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary:
      '[App] Get details of a report submitted by or against the user (minimal info)',
    description:
      'Returns minimal report details suitable for user view. Deleted reports are not accessible.',
  })
  @ApiParam({
    name: 'reportId',
    type: String,
    description: 'Unique ID of the report',
    example: 'c2a9c1f1-8e3e-4a9b-9f1c-12a3bc456def',
  })
  async getReportDetails(@Param('reportId') reportId: string) {
    return this.reportService.getReportDetailsForUser(reportId);
  }

  @Get(':reportId')
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '[Admin | Web] Get report details' })
  @ApiParam({
    name: 'reportId',
    type: String,
    description: 'Unique ID of the report',
    example: 'c2a9c1f1-8e3e-4a9b-9f1c-12a3bc456def',
  })
  async getReport(@Param('reportId') reportId: string) {
    return this.reportService.getReportDetails(reportId);
  }
}
