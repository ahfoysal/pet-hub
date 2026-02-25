import { Injectable, NotFoundException } from '@nestjs/common';
import { ApiResponse } from 'src/common/response/api-response';
import { User } from 'src/common/types/user.type';
import { CloudinaryService } from 'src/common/utils/cloudinary/cloudinary.service';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateAddressDto } from '../vendor/dto/update-address.dto';
import { CreateHotelProfileDto } from './dto/create-hotel-profile.dto';
import { UpdateHotelProfileDto } from './dto/update-hotel-profile.dto';

@Injectable()
export class PetHotelService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  async getAllHotels() {
    const hotels = await this.prisma.hotelProfile.findMany();

    return ApiResponse.success('Hotels found', hotels);
  }

  async profileSetup(
    dto: CreateHotelProfileDto,
    user: User,
    files: Express.Multer.File[]
  ) {
    const uploadedImages =
      await this.cloudinaryService.uploadMultipleFiles(files);
    const imageUrls = uploadedImages.map((img) => img.secure_url);
    return this.prisma
      .$transaction(async (tx) => {
        const hotelData = {
          userId: user.id,
          email: dto.email,
          phone: dto.phone,
          name: dto.name,
          description: dto.description,
          dayEndingTime: dto.dayEndingTime,
          dayStartingTime: dto.dayStartingTime,
          nightEndingTime: dto.nightEndingTime,
          nightStartingTime: dto.nightStartingTime,
          images: imageUrls,
        };
        const hotel = await tx.hotelProfile.create({
          data: hotelData,
        });

        const addressData = {
          city: dto.city,
          country: dto.country,
          streetAddress: dto.streetAddress,
          postalCode: dto.postalCode,
          hotelProfileId: hotel.id,
        };

        await tx.address.create({
          data: addressData,
        });

        await tx.user.update({
          where: { id: user.id },
          data: { hasProfile: true },
        });

        return {
          ...hotel,
          addresses: { ...addressData },
        };
      })
      .then((hotel) => {
        return ApiResponse.success('Pet hotel profile created successfully', {
          ...hotel,
        });
      })
      .catch((error) => {
        console.log(error);
        return ApiResponse.error('Pet hotel profile creation failed', error);
      });
  }

  async getHotelProfile(userId: string) {
    const profile = await this.prisma.hotelProfile.findUnique({
      where: {
        userId: userId,
      },
      include: {
        addresses: {
          select: {
            id: true,
            city: true,
            country: true,
            streetAddress: true,
            postalCode: true,
          },
        },
      },
    });

    if (!profile) {
      return ApiResponse.error('Hotel profile not found');
    }

    return ApiResponse.success('Hotel profile found', profile);
  }

  async updateHotelProfile(
    dto: UpdateHotelProfileDto,
    user: User,
    files?: Express.Multer.File[]
  ) {
    const existingHotel = await this.prisma.hotelProfile.findUnique({
      where: { userId: user.id },
    });

    if (!existingHotel) {
      return ApiResponse.error('Hotel profile not found');
    }

    let uploadedImageUrls: string[] = [];

    if (files?.length) {
      const uploadedImages =
        await this.cloudinaryService.uploadMultipleFiles(files);

      uploadedImageUrls = uploadedImages.map((image) => image.secure_url);
    }

    const baseImages =
      dto.prevImages !== undefined
        ? dto.prevImages
        : (existingHotel.images ?? []);

    const finalImages = [...baseImages, ...uploadedImageUrls];

    const updateData = {
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.email !== undefined && { email: dto.email }),
      ...(dto.phone !== undefined && { phone: dto.phone }),
      ...(dto.description !== undefined && {
        description: dto.description,
        ...(dto.dayEndingTime !== undefined && { phone: dto.dayEndingTime }),
        ...(dto.dayStartingTime !== undefined && {
          phone: dto.dayStartingTime,
        }),
        ...(dto.nightEndingTime !== undefined && {
          phone: dto.nightEndingTime,
        }),
        ...(dto.nightStartingTime !== undefined && {
          phone: dto.nightStartingTime,
        }),
      }),
      images: finalImages,
    };

    // Update vendor profile
    const updatedHotelProfile = await this.prisma.hotelProfile.update({
      where: { userId: user.id },
      data: updateData,
    });

    return ApiResponse.success(
      'Vendor profile updated successfully',
      updatedHotelProfile
    );
  }

  async updateHotelAddress(id: string, hotelId: string, dto: UpdateAddressDto) {
    const address = await this.prisma.address.findFirst({
      where: {
        id: id,
        hotelProfileId: hotelId,
      },
    });
    if (!address) throw new NotFoundException('Address not found');

    const updatedAddress = await this.prisma.address.update({
      where: {
        id: address.id,
        hotelProfileId: hotelId,
      },
      data: {
        city: dto.city ?? address.city,
        country: dto.country ?? address.country,
        streetAddress: dto.streetAddress ?? address.streetAddress,
        postalCode: dto.postalCode ?? address.postalCode,
      },
    });

    return ApiResponse.success('Address updated successfully', updatedAddress);
  }
}
