import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class ProfileGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
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
        if (!vendor) throw new ForbiddenException('Vendor profile not found');

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
        if (!hotel) throw new ForbiddenException('Hotel profile not found');

        request.hotelProfile = {
          id: hotel.id,
        };
        break;
      }

      case 'PET_SCHOOL': {
        const school = await this.prisma.petSchoolProfile.findUnique({
          where: { userId: user.id },
        });
        if (!school) throw new ForbiddenException('School profile not found');

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
