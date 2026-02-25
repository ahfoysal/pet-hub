import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { Prisma, Report, ReportStatus, User } from '@prisma/client';
import { ApiResponse } from 'src/common/response/api-response';
import { MailService } from 'src/modules/mail/mail.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { TakenActionEnum } from '../admin.constant';

@Injectable()
export class TakeActionService {
  private readonly logger = new Logger(TakeActionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService
  ) {}

  private async updatePetSitterProfileStatus(
    tx: Prisma.TransactionClient,
    user: User,
    status: 'BLOCKED' | 'SUSPENDED' | 'ACTIVE'
  ) {
    if (user.role === 'PET_SITTER') {
      await tx.petSitterProfile.update({
        where: { userId: user.id },
        data: {
          profileStatus: status,
        },
      });
    }
  }

  async banUser(report: Report, reason?: string, note?: string) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: report.reportedUserId },
      });

      if (!user || user.isDeleted)
        throw new NotFoundException('User not found');
      if (user.status === 'SUSPENDED')
        throw new BadRequestException('User is already suspended');
      if (user.status === 'BLOCKED')
        throw new BadRequestException('User is already banned');

      await tx.user.update({
        where: { id: report.reportedUserId },
        data: {
          status: 'BLOCKED',
          suspendUntil: null,
          suspendReason: null,
          banReason: reason ?? report.reason,
        },
      });

      await this.updatePetSitterProfileStatus(tx, user, 'BLOCKED');

      const updatedReport = await tx.report.update({
        where: { id: report.id },
        data: { status: ReportStatus.ACTION_TAKEN, note },
      });

      // Send email asynchronously (non-blocking)
      this.mailService
        .sendAdminActionEmail(user.email, user.fullName, TakenActionEnum.BAN, {
          reason,
        })
        .catch((err) => this.logger.error('Email sending failed', err));

      return ApiResponse.success('User banned successfully', updatedReport);
    });
  }

  async suspendUser(
    report: Report,
    suspendDuration: number,
    reason?: string,
    note?: string
  ) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: report.reportedUserId },
      });
      if (!user || user.isDeleted)
        throw new NotFoundException('User not found');
      if (user.status === 'SUSPENDED')
        throw new BadRequestException('User is already suspended');
      if (user.status === 'BLOCKED')
        throw new BadRequestException('User is already banned');

      const suspendUntil = new Date();
      suspendUntil.setDate(suspendUntil.getDate() + suspendDuration);

      await tx.user.update({
        where: { id: report.reportedUserId },
        data: {
          status: 'SUSPENDED',
          suspendUntil,
          suspendReason: reason ?? report.reason,
          banReason: null,
        },
      });

      await this.updatePetSitterProfileStatus(tx, user, 'SUSPENDED');

      const updatedReport = await tx.report.update({
        where: { id: report.id },
        data: { status: ReportStatus.ACTION_TAKEN, note },
      });

      // Send email asynchronously (non-blocking)
      this.mailService
        .sendAdminActionEmail(
          user.email,
          user.fullName,
          TakenActionEnum.SUSPEND,
          {
            reason,
            suspendUntil,
          }
        )
        .catch((err) => this.logger.error('Email sending failed', err));

      return ApiResponse.success('User suspended successfully', updatedReport);
    });
  }

  async deleteReportContent(report: Report, note?: string) {
    return this.prisma.$transaction(async (tx) => {
      let contentType = '';
      switch (report.reportType) {
        case 'POST': {
          const post = await tx.post.findUnique({
            where: { id: report.postId! },
          });
          if (!post) throw new BadRequestException('Post not found');
          if (post.isDeleted)
            throw new BadRequestException('Post already deleted');
          await tx.post.update({
            where: { id: post.id },
            data: { isDeleted: true },
          });
          contentType = 'POST';
          break;
        }

        case 'REEL': {
          const reel = await tx.reel.findUnique({
            where: { id: report.postId! },
          });
          if (!reel) throw new BadRequestException('Reel not found');
          if (reel.isDeleted)
            throw new BadRequestException('Reel already deleted');
          await tx.reel.update({
            where: { id: reel.id },
            data: { isDeleted: true },
          });
          contentType = 'REEL';
          break;
        }

        default:
          throw new BadRequestException('Unsupported report type');
      }

      const updatedReport = await tx.report.update({
        where: { id: report.id },
        data: { status: ReportStatus.ACTION_TAKEN, note },
      });

      // Send email asynchronously
      const user = await tx.user.findUnique({
        where: { id: report.reportedUserId },
      });
      if (user) {
        this.mailService
          .sendAdminActionEmail(
            user.email,
            user.fullName,
            TakenActionEnum.DELETE,
            {
              reason: report.reason,
            }
          )
          .catch((err) => this.logger.error('Email sending failed', err));
      }

      return ApiResponse.success(
        `${contentType} deleted successfully`,
        updatedReport
      );
    });
  }

  async hideReportContent(report: Report, note?: string) {
    return this.prisma.$transaction(async (tx) => {
      let contentType = '';
      switch (report.reportType) {
        case 'POST': {
          const post = await tx.post.findUnique({
            where: { id: report.postId! },
          });
          if (!post) throw new BadRequestException('Post not found');
          if (post.isDeleted)
            throw new BadRequestException('Post already deleted');
          if (post.isHidden)
            throw new BadRequestException('Post already hidden');
          await tx.post.update({
            where: { id: post.id },
            data: { isHidden: true },
          });
          contentType = 'POST';
          break;
        }

        case 'REEL': {
          const reel = await tx.reel.findUnique({
            where: { id: report.postId! },
          });
          if (!reel) throw new BadRequestException('Reel not found');
          if (reel.isDeleted)
            throw new BadRequestException('Reel already deleted');
          if (reel.isHidden)
            throw new BadRequestException('Reel already hidden');
          await tx.reel.update({
            where: { id: reel.id },
            data: { isHidden: true },
          });
          contentType = 'REEL';
          break;
        }

        default:
          throw new BadRequestException('Unsupported report type');
      }

      const updatedReport = await tx.report.update({
        where: { id: report.id },
        data: { status: ReportStatus.ACTION_TAKEN, note },
      });

      // Send email asynchronously
      const user = await tx.user.findUnique({
        where: { id: report.reportedUserId },
      });
      if (user) {
        this.mailService
          .sendAdminActionEmail(
            user.email,
            user.fullName,
            TakenActionEnum.HIDE,
            {
              reason: report.reason,
            }
          )
          .catch((err) => this.logger.error('Email sending failed', err));
      }

      return ApiResponse.success(
        `${contentType} hidden successfully`,
        updatedReport
      );
    });
  }

  async dismissReport(report: Report, note?: string) {
    const updatedReport = await this.prisma.report.update({
      where: { id: report.id },
      data: { status: ReportStatus.DISMISSED, note },
    });

    // Send email asynchronously
    const user = await this.prisma.user.findUnique({
      where: { id: report.reportedUserId },
    });
    if (user) {
      this.mailService
        .sendAdminActionEmail(
          user.email,
          user.fullName,
          TakenActionEnum.IGNORE,
          {
            reason: report.reason,
          }
        )
        .catch((err) => this.logger.error('Email sending failed', err));
    }

    return ApiResponse.success('Report dismissed successfully', updatedReport);
  }
}
