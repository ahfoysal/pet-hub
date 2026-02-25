import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApiResponse } from 'src/common/response/api-response';
import { BanUserDto, SuspendUserDto } from './dto/admin-dto';
import { getSuspendDuration, TakenActionEnum } from './admin.constant';
import { Prisma, User } from '@prisma/client';
import { Role } from 'src/common/types/auth.types';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService
  ) {}

  private logger = new Logger(AdminService.name);

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

  async banUser(payload: BanUserDto) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          role: true,
          status: true,
          email: true,
          fullName: true,
        },
      });

      if (!user) throw new NotFoundException('User not found');
      if (user.role === 'ADMIN')
        throw new BadRequestException('Admin cannot be banned');
      if (user.status === 'BLOCKED')
        throw new BadRequestException('User is already banned');
      if (user.status === 'SUSPENDED')
        throw new BadRequestException('User is suspended');

      const updatedUser = await tx.user.update({
        where: { id: payload.userId },
        data: { status: 'BLOCKED', banReason: payload.reason },
      });

      // Update PetSitterProfile atomically
      await this.updatePetSitterProfileStatus(tx, updatedUser, 'BLOCKED');

      // Send email asynchronously (non-blocking)
      this.mailService
        .sendAdminActionEmail(
          updatedUser.email,
          updatedUser.fullName,
          TakenActionEnum.BAN,
          { reason: payload.reason }
        )
        .catch((err) => this.logger.error('Email sending failed', err));

      return ApiResponse.success('User banned successfully');
    });
  }

  async createAdmin(payload: import('./dto/admin-dto').CreateAdminDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (existingUser) {
      throw new BadRequestException('A user with this email already exists');
    }

    const randomPassword = crypto.randomBytes(4).toString('hex'); // 8 characters
    const hashedPassword = await bcrypt.hash(randomPassword, 10);
    
    // Generate a simple username from full name
    const slug = payload.fullName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const randomPart = crypto.randomUUID().slice(0, 6);
    const userName = `${slug}-${randomPart}`;

    const newAdmin = await this.prisma.user.create({
      data: {
        userName,
        email: payload.email,
        password: hashedPassword,
        fullName: payload.fullName,
        role: Role.ADMIN,
        isEmailVerified: true,
        status: 'ACTIVE',
      },
    });

    // We can use a template or simply send an email if a specific admin template doesn't exist.
    // Assuming `mailService` doesn't have an exact "Admin Created" method, we'll try to send a plain OTP/Welcome or just log it if we can't.
    // Note: To be robust, we'll just log the password for the mock or use an existing template if possible.
    this.logger.log(`New Admin created: ${newAdmin.email} | Password: ${randomPassword}`);

    return ApiResponse.success('Admin created successfully', {
      adminId: newAdmin.id,
      email: newAdmin.email,
      temporaryPassword: randomPassword // Returning it so the frontend can display/copy it if needed, or it can be emailed.
    });
  }

  async updateAdmin(adminId: string, payload: import('./dto/admin-dto').UpdateAdminDto) {
    const existingAdmin = await this.prisma.user.findUnique({
      where: { id: adminId },
    });

    if (!existingAdmin) {
      throw new NotFoundException('Admin not found');
    }

    if (existingAdmin.role !== Role.ADMIN) {
      throw new BadRequestException('User is not an admin');
    }

    if (payload.email && payload.email !== existingAdmin.email) {
      const emailTaken = await this.prisma.user.findUnique({
        where: { email: payload.email },
      });
      if (emailTaken) {
        throw new BadRequestException('Email is already in use by another account');
      }
    }

    const updatedAdmin = await this.prisma.user.update({
      where: { id: adminId },
      data: {
        ...(payload.fullName && { fullName: payload.fullName }),
        ...(payload.email && { email: payload.email }),
      },
    });

    return ApiResponse.success('Admin updated successfully', {
      adminId: updatedAdmin.id,
      email: updatedAdmin.email,
      fullName: updatedAdmin.fullName,
    });
  }

  async reactivateUser(userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { id: true, status: true, email: true, fullName: true },
      });

      if (!user) throw new NotFoundException('User not found');
      if (user.status === 'ACTIVE')
        throw new BadRequestException('User is already active');

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          status: 'ACTIVE',
          suspendUntil: null,
          suspendReason: null,
          banReason: null,
        },
      });

      await this.updatePetSitterProfileStatus(tx, updatedUser, 'ACTIVE');

      this.mailService
        .sendAdminActionEmail(
          updatedUser.email,
          updatedUser.fullName,
          TakenActionEnum.REACTIVATE,
          {}
        )
        .catch((err) => this.logger.error('Email sending failed', err));

      return ApiResponse.success('User reactivated successfully');
    });
  }

  async suspendUser(payload: SuspendUserDto) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          role: true,
          status: true,
          email: true,
          fullName: true,
        },
      });

      if (!user) throw new NotFoundException('User not found');
      if (user.role === 'ADMIN')
        throw new BadRequestException('Admin cannot be suspended');
      if (user.status === 'SUSPENDED')
        throw new BadRequestException('User is already suspended');
      if (user.status === 'BLOCKED')
        throw new BadRequestException('User is banned');

      const days = getSuspendDuration(payload.suspendDuration);
      const suspendUntil = new Date();
      suspendUntil.setDate(suspendUntil.getDate() + days);

      const updatedUser = await tx.user.update({
        where: { id: payload.userId },
        data: {
          status: 'SUSPENDED',
          suspendUntil,
          suspendReason: payload.reason,
          banReason: null,
        },
      });

      await this.updatePetSitterProfileStatus(tx, updatedUser, 'SUSPENDED');

      this.mailService
        .sendAdminActionEmail(
          updatedUser.email,
          updatedUser.fullName,
          TakenActionEnum.SUSPEND,
          { reason: payload.reason }
        )
        .catch((err) => this.logger.error('Email sending failed', err));

      return ApiResponse.success('User suspended successfully');
    });
  }

  async getSuspendUsers(cursor?: string, limit = 20) {
    // Cap the maximum limit to prevent overloading
    limit = Math.min(limit, 50);

    const users = await this.prisma.user.findMany({
      where: { status: 'SUSPENDED' },
      take: limit + 1, // Fetch one extra to determine if there is a next page
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
      orderBy: { createdAt: 'desc' }, // newest suspended users first
      select: {
        id: true,
        fullName: true,
        email: true,
        createdAt: true,
        suspendUntil: true,
        suspendReason: true,
      },
    });

    // Determine next cursor for pagination
    const nextCursor = users.length > limit ? users[limit].id : null;

    return ApiResponse.success('Suspended users fetched successfully', {
      data: users.slice(0, limit),
      nextCursor,
    });
  }

  async getBannedUsers(cursor?: string, limit = 20) {
    // Cap the maximum limit to prevent overloading
    limit = Math.min(limit, 50);

    const users = await this.prisma.user.findMany({
      where: { status: 'BLOCKED' },
      take: limit + 1, // Fetch one extra to determine if there is a next page
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
      orderBy: { createdAt: 'desc' }, // newest suspended users first
      select: {
        id: true,
        fullName: true,
        email: true,
        createdAt: true,
        banReason: true,
      },
    });

    // Determine next cursor for pagination
    const nextCursor = users.length > limit ? users[limit].id : null;

    return ApiResponse.success('Banned users fetched successfully', {
      data: users.slice(0, limit),
      nextCursor,
    });
  }
}
