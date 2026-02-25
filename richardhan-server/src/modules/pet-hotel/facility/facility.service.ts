import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { ApiResponse } from 'src/common/response/api-response';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { UpdateFacilityDto } from './dto/update-facility.dto';
import type { User } from 'src/common/types/user.type';

@Injectable()
export class FacilityService {
  constructor(private readonly prisma: PrismaService) {}

  async createFacility(dto: CreateFacilityDto, user: User) {
    const hotel = await this.prisma.hotelProfile.findUnique({
      where: { userId: user.id },
    });

    if (!hotel) {
      throw new UnauthorizedException('Hotel profile not found');
    }

    const facility = await this.prisma.facility.create({
      data: {
        ...dto,
        hotelProfileId: hotel.id,
      },
    });

    return ApiResponse.success('Facility created successfully', facility);
  }

  async getMyFacilities(user: User) {
    const hotel = await this.prisma.hotelProfile.findUnique({
      where: { userId: user.id },
    });

    if (!hotel) {
      throw new UnauthorizedException('Hotel profile not found');
    }

    const facilities = await this.prisma.facility.findMany({
      where: { hotelProfileId: hotel.id },
      orderBy: { createdAt: 'desc' },
    });

    return ApiResponse.success('Facilities retrieved successfully', facilities);
  }

  async updateFacility(id: string, dto: UpdateFacilityDto, user: User) {
    const hotel = await this.prisma.hotelProfile.findUnique({
      where: { userId: user.id },
    });

    if (!hotel) {
      throw new UnauthorizedException('Hotel profile not found');
    }

    const facility = await this.prisma.facility.findUnique({
      where: { id },
    });

    if (!facility || facility.hotelProfileId !== hotel.id) {
      throw new NotFoundException('Facility not found or unauthorized');
    }

    const updated = await this.prisma.facility.update({
      where: { id },
      data: dto,
    });

    return ApiResponse.success('Facility updated successfully', updated);
  }

  async deleteFacility(id: string, user: User) {
    const hotel = await this.prisma.hotelProfile.findUnique({
      where: { userId: user.id },
    });

    if (!hotel) {
      throw new UnauthorizedException('Hotel profile not found');
    }

    const facility = await this.prisma.facility.findUnique({
      where: { id },
    });

    if (!facility || facility.hotelProfileId !== hotel.id) {
      throw new NotFoundException('Facility not found or unauthorized');
    }

    await this.prisma.facility.delete({
      where: { id },
    });

    return ApiResponse.success('Facility deleted successfully');
  }
}
