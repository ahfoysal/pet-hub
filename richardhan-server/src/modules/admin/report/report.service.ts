import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, ReportStatus, ReportType } from '@prisma/client';
import { ApiResponse } from 'src/common/response/api-response';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { getSuspendDuration, TakenActionEnum } from '../admin.constant';
import { AddReportService } from './add-report.service';
import { AddReportDto, TakeActionDto, UpdateReportDto } from './dto/report.dto';
import { TakeActionService } from './take-action.service';

@Injectable()
export class ReportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly addReportService: AddReportService,
    private readonly takeActionService: TakeActionService
  ) {}

  async addReport(payload: AddReportDto, reporterId: string) {
    // Enforce exactly one target
    const targets = [payload.userId, payload.postId, payload.reelId].filter(
      Boolean
    );
    if (targets.length !== 1) {
      throw new BadRequestException(
        'Report must reference exactly one target (user, post, or reel)'
      );
    }

    switch (payload.reportType) {
      case ReportType.USER:
        return this.addReportService.reportUser(
          reporterId,
          payload.userId!,
          payload.reason
        );

      case ReportType.POST:
        return this.addReportService.reportPost(
          reporterId,
          payload.postId!,
          payload.reason
        );

      case ReportType.REEL:
        return this.addReportService.reportReel(
          reporterId,
          payload.reelId!,
          payload.reason
        );

      default:
        throw new BadRequestException('Invalid report type');
    }
  }

  async updateReport(
    reportId: string,
    payload: UpdateReportDto,
    reporterId: string
  ) {
    // Fetch the report with minimal fields needed
    const report = await this.prisma.report.findUnique({
      where: { id: reportId },
      select: { reporterId: true, status: true, isDeleted: true },
    });

    if (!report || report.isDeleted) {
      throw new BadRequestException('Report not found or has been deleted');
    }

    // Only the original reporter can update the report
    if (report.reporterId !== reporterId) {
      throw new BadRequestException(
        'You do not have permission to update this report'
      );
    }

    // Prevent updates on dismissed or resolved reports
    if (report.status === ReportStatus.DISMISSED) {
      throw new BadRequestException('Report has already been dismissed');
    }
    if (report.status === ReportStatus.ACTION_TAKEN) {
      throw new BadRequestException('Report has already been resolved');
    }

    // Update reason (could extend to other updatable fields in the future)
    const updatedReport = await this.prisma.report.update({
      where: { id: reportId },
      data: {
        reason: payload.reason,
      },
    });

    return ApiResponse.success('Report updated successfully', updatedReport);
  }

  async takeAction(reportId: string, payload: TakeActionDto) {
    const report = await this.prisma.report.findUnique({
      where: { id: reportId },
    });

    if (!report || report.isDeleted) {
      throw new BadRequestException('Report not found or has been deleted');
    }

    if (report.status === ReportStatus.DISMISSED) {
      throw new BadRequestException('Report has already been dismissed');
    }

    if (report.status === ReportStatus.ACTION_TAKEN) {
      throw new BadRequestException('Report has already been resolved');
    }

    switch (payload.actionType) {
      case TakenActionEnum.BAN:
        return this.takeActionService.banUser(
          report,
          payload.reason,
          payload.note
        );

      case TakenActionEnum.SUSPEND: {
        if (!payload.suspendDuration) {
          throw new BadRequestException('Suspend duration is required');
        }

        const days = getSuspendDuration(payload.suspendDuration);
        return this.takeActionService.suspendUser(
          report,
          days,
          payload.reason,
          payload.note
        );
      }

      case TakenActionEnum.DELETE:
        return this.takeActionService.deleteReportContent(report, payload.note);

      case TakenActionEnum.HIDE:
        return this.takeActionService.hideReportContent(report, payload.note);

      case TakenActionEnum.IGNORE:
        return this.takeActionService.dismissReport(report, payload.note);

      default:
        throw new BadRequestException('Invalid action type');
    }
  }

  async getAllReports(
    cursor?: string,
    limit = 20,
    search?: string,
    filter?: { status?: ReportStatus; reportType?: ReportType }
  ) {
    limit = Math.min(limit, 50);

    const where: Prisma.ReportWhereInput = {
      isDeleted: false,
      ...(filter?.status && { status: filter.status }),
      ...(filter?.reportType && { reportType: filter.reportType }),
    };

    if (search) {
      where.OR = [
        {
          OR: [
            { reason: { contains: search, mode: 'insensitive' } },
            { note: { contains: search, mode: 'insensitive' } },
          ],
        },
        {
          OR: [
            {
              reporter: { fullName: { contains: search, mode: 'insensitive' } },
            },
            { reporter: { email: { contains: search, mode: 'insensitive' } } },
          ],
        },
        {
          OR: [
            {
              reportedUser: {
                fullName: { contains: search, mode: 'insensitive' },
              },
            },
            {
              reportedUser: {
                email: { contains: search, mode: 'insensitive' },
              },
            },
          ],
        },
        {
          OR: [
            { post: { caption: { contains: search, mode: 'insensitive' } } },
            { post: { location: { contains: search, mode: 'insensitive' } } },
          ],
        },
        { reel: { caption: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const reports = await this.prisma.report.findMany({
      where,
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        reason: true,
        status: true,
        reportType: true,
        createdAt: true,
        reporter: { select: { id: true, fullName: true } },
        reportedUser: { select: { id: true, fullName: true } },
        post: { select: { id: true } },
        reel: { select: { id: true } },
      },
    });

    const nextCursor =
      reports.length === limit ? reports[reports.length - 1].id : null;

    const result = { reports, nextCursor };

    return ApiResponse.success('Reports fetched successfully', result);
  }

  async getReportDetails(reportId: string) {
    const report = await this.prisma.report.findUnique({
      where: { id: reportId },
      select: {
        id: true,
        reason: true,
        note: true,
        status: true,
        reportType: true,
        createdAt: true,
        updatedAt: true,
        reporter: {
          select: { id: true, fullName: true, email: true, image: true },
        },
        reportedUser: {
          select: { id: true, fullName: true, email: true, image: true },
        },
        post: {
          select: {
            id: true,
            caption: true,
            location: true,
            media: true,
            isDeleted: true,
            isHidden: true,
          },
        },
        reel: {
          select: {
            id: true,
            caption: true,
            video: true,
            isDeleted: true,
            isHidden: true,
            duration: true,
          },
        },
        isDeleted: true,
      },
    });

    if (!report || report.isDeleted) {
      throw new BadRequestException('Report not found or has been deleted');
    }

    return ApiResponse.success('Report found', report);
  }

  async deleteReport(reportId: string, reporterId: string) {
    const report = await this.prisma.report.findUnique({
      where: { id: reportId },
      select: { isDeleted: true, status: true, reporterId: true },
    });

    if (!report || report.isDeleted) {
      throw new BadRequestException('Report not found or has been deleted');
    }

    if (report.reporterId !== reporterId) {
      throw new BadRequestException(
        'You are not authorized to delete this report'
      );
    }

    if (report.status === ReportStatus.DISMISSED) {
      throw new BadRequestException('Report has already been dismissed');
    }

    if (report.status === ReportStatus.ACTION_TAKEN) {
      throw new BadRequestException('Report has already been resolved');
    }

    await this.prisma.report.update({
      where: { id: reportId },
      data: { isDeleted: true },
    });

    return ApiResponse.success('Report deleted successfully');
  }

  async getMyReportedReports(
    reporterId: string,
    cursor?: string,
    limit?: string,
    search?: string,
    status?: string,
    reportType?: string
  ) {
    const numericLimit = limit ? Math.min(Number(limit), 50) : 20;

    // Build filters
    const filter: { status?: ReportStatus; reportType?: ReportType } = {
      status: status
        ? ReportStatus[status as keyof typeof ReportStatus]
        : undefined,
      reportType: reportType
        ? ReportType[reportType as keyof typeof ReportType]
        : undefined,
    };

    const where: Prisma.ReportWhereInput = {
      reporterId,
      isDeleted: false,
      ...(filter.status && { status: filter.status }),
      ...(filter.reportType && { reportType: filter.reportType }),
    };

    // Add search on reason/note/post/reel captions
    if (search) {
      where.OR = [
        {
          OR: [
            { reason: { contains: search, mode: 'insensitive' } },
            { note: { contains: search, mode: 'insensitive' } },
          ],
        },
        {
          post: {
            OR: [
              { caption: { contains: search, mode: 'insensitive' } },
              { location: { contains: search, mode: 'insensitive' } },
            ],
          },
        },
        { reel: { caption: { contains: search, mode: 'insensitive' } } },
      ];
    }

    // Query reports
    const reports = await this.prisma.report.findMany({
      where,
      take: numericLimit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        reason: true,
        status: true,
        reportType: true,
        createdAt: true,
        reporter: { select: { id: true, fullName: true } },
        reportedUser: { select: { id: true, fullName: true } },
        post: { select: { id: true } },
        reel: { select: { id: true } },
      },
    });

    const nextCursor =
      reports.length === numericLimit ? reports[reports.length - 1].id : null;

    const result = { reports, nextCursor };

    return ApiResponse.success('Reports found', result);
  }

  async getReportAgainstMe(
    reportedUserId: string,
    cursor?: string,
    limit?: string,
    search?: string,
    status?: string,
    reportType?: string
  ) {
    const numericLimit = limit ? Math.min(Number(limit), 50) : 20;

    // Build filters
    const filter: { status?: ReportStatus; reportType?: ReportType } = {
      status: status
        ? ReportStatus[status as keyof typeof ReportStatus]
        : undefined,
      reportType: reportType
        ? ReportType[reportType as keyof typeof ReportType]
        : undefined,
    };

    const where: Prisma.ReportWhereInput = {
      reportedUserId,
      isDeleted: false,
      ...(filter.status && { status: filter.status }),
      ...(filter.reportType && { reportType: filter.reportType }),
    };

    // Add search on reason/note/post/reel captions
    if (search) {
      where.OR = [
        {
          OR: [
            { reason: { contains: search, mode: 'insensitive' } },
            { note: { contains: search, mode: 'insensitive' } },
          ],
        },
        {
          post: {
            OR: [
              { caption: { contains: search, mode: 'insensitive' } },
              { location: { contains: search, mode: 'insensitive' } },
            ],
          },
        },
        { reel: { caption: { contains: search, mode: 'insensitive' } } },
      ];
    }

    // Query reports
    const reports = await this.prisma.report.findMany({
      where,
      take: numericLimit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        reason: true,
        status: true,
        reportType: true,
        createdAt: true,
        reporter: { select: { id: true, fullName: true } },
        reportedUser: { select: { id: true, fullName: true } },
        post: { select: { id: true } },
        reel: { select: { id: true } },
      },
    });

    const nextCursor =
      reports.length === numericLimit ? reports[reports.length - 1].id : null;

    const result = { reports, nextCursor };

    return ApiResponse.success('Reports found', result);
  }

  async getReportDetailsForUser(reportId: string) {
    const report = await this.prisma.report.findFirst({
      where: { id: reportId, isDeleted: false },
      select: {
        id: true,
        reason: true,
        status: true,
        reportType: true,
        createdAt: true,
        reporter: { select: { id: true, fullName: true } },
        reportedUser: { select: { id: true, fullName: true } },
        post: { select: { id: true } },
        reel: { select: { id: true } },
        // Do not expose: note, emails, deleted/hidden flags, media
      },
    });

    if (!report) {
      throw new BadRequestException('Report not found or has been deleted');
    }

    return ApiResponse.success('Report found', report);
  }
}
