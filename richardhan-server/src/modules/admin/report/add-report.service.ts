import { BadRequestException, Injectable } from '@nestjs/common';
import { ReportStatus, ReportType } from '@prisma/client';
import { ApiResponse } from 'src/common/response/api-response';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class AddReportService {
  constructor(private readonly prisma: PrismaService) {}

  // ------------------------
  // Report a user
  async reportUser(
    reportedById: string,
    reportedUserId: string,
    reason: string
  ) {
    if (reportedById === reportedUserId) {
      throw new BadRequestException('You cannot report yourself');
    }

    // Prevent duplicate user reports
    const existing = await this.prisma.report.findFirst({
      where: {
        reporterId: reportedById,
        reportedUserId,
        reportType: ReportType.USER,
        status: { not: ReportStatus.DISMISSED }, // optional: allow new if previous rejected
        isDeleted: false,
      },
    });
    if (existing)
      throw new BadRequestException('You have already reported this user');

    return this.prisma.report.create({
      data: {
        reporterId: reportedById,
        reportedUserId,
        reportType: ReportType.USER,
        reason,
        status: ReportStatus.PENDING,
      },
    });
  }

  // ------------------------
  // Report a post
  async reportPost(reporterId: string, postId: string, reason: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true, isDeleted: true, visibility: true },
    });

    if (!post || post.isDeleted || post.visibility === 'PRIVATE')
      throw new BadRequestException('Post not found');

    if (post.userId === reporterId)
      throw new BadRequestException('You cannot report your own post');

    // Prevent duplicate post reports
    const existing = await this.prisma.report.findFirst({
      where: {
        reporterId,
        postId,
        reportType: ReportType.POST,
        status: { not: ReportStatus.DISMISSED },
        isDeleted: false,
      },
    });
    if (existing)
      throw new BadRequestException('You have already reported this post');

    const report = await this.prisma.report.create({
      data: {
        reporterId,
        reportedUserId: post.userId,
        postId,
        reportType: ReportType.POST,
        reason,
        status: ReportStatus.PENDING,
      },
    });

    return ApiResponse.success('Report created successfully', report);
  }

  // ------------------------
  // Report a reel
  async reportReel(reporterId: string, reelId: string, reason: string) {
    const reel = await this.prisma.reel.findUnique({
      where: { id: reelId },
      select: { userId: true, isDeleted: true, visibility: true },
    });

    if (!reel || reel.isDeleted || reel.visibility === 'PRIVATE')
      throw new BadRequestException('Reel not found');

    if (reel.userId === reporterId)
      throw new BadRequestException('You cannot report your own reel');

    // Prevent duplicate reel reports
    const existing = await this.prisma.report.findFirst({
      where: {
        reporterId,
        reelId,
        reportType: ReportType.REEL,
        status: { not: ReportStatus.DISMISSED },
        isDeleted: false,
      },
    });
    if (existing)
      throw new BadRequestException('You have already reported this reel');

    const report = await this.prisma.report.create({
      data: {
        reporterId,
        reportedUserId: reel.userId,
        reelId,
        reportType: ReportType.REEL,
        reason,
        status: ReportStatus.PENDING,
      },
    });

    return ApiResponse.success('Report created successfully', report);
  }
}
