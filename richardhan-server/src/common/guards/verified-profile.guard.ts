import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { REQUIRE_VERIFIED_PROFILE } from '../decorators/require-verified-profile.decorator';

@Injectable()
export class VerifiedProfileGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isRequired = this.reflector.get<boolean>(
      REQUIRE_VERIFIED_PROFILE,
      context.getHandler()
    );

    // If route doesn't require verification → allow
    if (!isRequired) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Unauthorized');
    }
    // Role → Profile check
    switch (user.role) {
      case 'VENDOR': {
        const vendor = await this.prisma.vendorProfile.findUnique({
          where: { userId: user.id },
        });
        if (!vendor?.isVerified || vendor?.status !== 'ACTIVE') {
          throw new ForbiddenException(
            'Vendor profile is not verified or not active'
          );
        }

        // attach to request
        request.vendorProfile = {
          id: vendor.id,
        };
        break;
      }

      case 'PET_HOTEL': {
        const hotel = await this.prisma.hotelProfile.findUnique({
          where: { userId: user.id },
        });
        if (!hotel?.isVerified || hotel?.status !== 'ACTIVE') {
          throw new ForbiddenException(
            'Hotel profile is not verified or not active'
          );
        }
        request.hotelProfile = {
          id: hotel.id,
        };
        break;
      }

      case 'PET_SCHOOL': {
        const school = await this.prisma.petSchoolProfile.findUnique({
          where: { userId: user.id },
        });
        if (!school?.isVerified || school?.status !== 'ACTIVE') {
          throw new ForbiddenException(
            'School profile is not verified or not active'
          );
        }
        request.schoolProfile = {
          id: school.id,
        };
        break;
      }

      default:
        throw new ForbiddenException('Invalid role');
    }

    return true;
  }
}
