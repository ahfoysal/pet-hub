import { Injectable, NotFoundException } from '@nestjs/common';
import { ApiResponse } from 'src/common/response/api-response';
import { Role } from 'src/common/types/auth.types';
import { PrismaService } from '../prisma/prisma.service';

import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly firebaseService: FirebaseService
  ) {}

  async findAll() {
    const users = await this.prisma.user.findMany({
      where: { role: { not: Role.ADMIN } },
      select: {
        id: true,
        email: true,
        role: true,
        fullName: true,
        image: true,
        status: true,
        phone: true,
      },
    });

    return ApiResponse.success('Users found', users);
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        role: true,
        fullName: true,
        image: true,
        phone: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');

    return ApiResponse.success('User found', user);
  }

  async getProfileByUserId(userId: string) {
    const userResponse = await this.findOne(userId);
    const user = userResponse?.data;

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const profileLoaders: Partial<Record<Role, () => Promise<any>>> = {
      [Role.VENDOR]: () =>
        this.prisma.vendorProfile.findUnique({
          where: { userId },
        }),

      [Role.PET_HOTEL]: () =>
        this.prisma.hotelProfile.findUnique({
          where: { userId },
        }),

      // Future-ready roles
      [Role.PET_OWNER]: () =>
        this.prisma.petOwnerProfile.findUnique({
          where: { userId },
        }),
      [Role.PET_SCHOOL]: () =>
        this.prisma.petSchoolProfile.findUnique({ where: { userId } }),
      [Role.PET_SITTER]: () =>
        this.prisma.petSitterProfile.findUnique({ where: { userId } }),
    };

    if (!user.role) throw new NotFoundException('User role not assigned');

    const loadProfile = profileLoaders[user.role];
    if (!loadProfile) {
      throw new NotFoundException('User role not supported');
    }

    const profile = await loadProfile();

    return ApiResponse.success('User profile found', {
      ...user,
      ...(profile ?? {}),
    });
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    try {
      // 1. Delete from Firebase by email since we don't store firebaseUid
      if (user.email) {
        try {
          const firebaseUser = await this.firebaseService.getUserByEmail(
            user.email
          );
          if (firebaseUser?.uid) {
            await this.firebaseService.deleteUser(firebaseUser.uid);
          }
        } catch (firebaseError: any) {
          // Ignore if user not found in firebase
          if (firebaseError.code !== 'auth/user-not-found') {
            throw firebaseError;
          }
        }
      }
    } catch (error: any) {
      // Main deletion catch-all
      console.error('Error during firebase user deletion:', error);
    }

    // 2. Delete from database (Prisma will cascade delete KYC and Profiles if schema has onDelete: Cascade)
    await this.prisma.user.delete({
      where: { id },
    });

    return ApiResponse.success('User deleted successfully');
  }
}
