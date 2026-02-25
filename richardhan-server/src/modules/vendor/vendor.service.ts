import { Injectable } from '@nestjs/common';
import { ApiResponse } from 'src/common/response/api-response';
import { User } from 'src/common/types/user.type';
import { CloudinaryService } from 'src/common/utils/cloudinary/cloudinary.service';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateVendorDto } from './dto/update-vendor.dto';

@Injectable()
export class VendorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  async profileSetup(dto: any, user: User, files: Express.Multer.File[]) {
    return this.prisma
      .$transaction(async (tx) => {
        const uploadedImages =
          await this.cloudinaryService.uploadMultipleFiles(files);
        const imageUrls = uploadedImages.map((img) => img.secure_url);

        const vendorData = {
          userId: user.id,
          email: dto.email,
          phone: dto.phone,
          name: dto.name,
          description: dto.description,
          images: imageUrls,
        };
        const vendor = await tx.vendorProfile.create({
          data: vendorData,
        });

        const addressData = {
          city: dto.city,
          country: dto.country,
          streetAddress: dto.streetAddress,
          postalCode: dto.postalCode,
          vendorProfileId: vendor.id,
        };

        await tx.address.create({
          data: addressData,
        });

        await tx.user.update({
          where: { id: user.id },
          data: { hasProfile: true },
        });

        return {
          ...vendor,
          addresses: { ...addressData },
        };
      })
      .then((vendor) => {
        return ApiResponse.success('Vendor profile created successfully', {
          ...vendor,
        });
      })
      .catch((error) => {
        return ApiResponse.error('Vendor profile creation failed', error);
      });
  }

  async getVendorProfile(id: string) {
    return await this.prisma.vendorProfile
      .findUnique({
        where: {
          userId: id,
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
      })
      .then((vendor) => {
        return ApiResponse.success('Vendor profile found', vendor);
      })
      .catch((error) => {
        return ApiResponse.error('Vendor profile not found', error);
      });
  }

  async updateVendorProfile(
    dto: UpdateVendorDto,
    user: User,
    files?: Express.Multer.File[]
  ) {
    const existingVendor = await this.prisma.vendorProfile.findUnique({
      where: { userId: user.id },
    });

    if (!existingVendor) {
      return ApiResponse.error('Vendor profile not found');
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
        : (existingVendor.images ?? []);

    const finalImages = [...baseImages, ...uploadedImageUrls];

    const updateData = {
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.email !== undefined && { email: dto.email }),
      ...(dto.phone !== undefined && { phone: dto.phone }),
      ...(dto.description !== undefined && {
        description: dto.description,
      }),
      images: finalImages,
    };

    // Update vendor profile
    const updatedVendor = await this.prisma.vendorProfile.update({
      where: { userId: user.id },
      data: updateData,
    });

    return ApiResponse.success(
      'Vendor profile updated successfully',
      updatedVendor
    );
  }

  async updateVendorAddress(
    user: User,
    addressId: string,
    dto: UpdateVendorDto
  ) {
    const vendor = await this.prisma.vendorProfile.findUnique({
      where: {
        userId: user.id,
      },
    });
    if (!vendor) {
      return ApiResponse.error('Vendor profile not found');
    }

    const address = await this.prisma.address.findFirst({
      where: {
        id: addressId,
        vendorProfileId: vendor.id,
      },
    });

    if (!address) {
      return ApiResponse.error('Address not found');
    }

    const updatedAddress = await this.prisma.address.update({
      where: {
        id: address.id,
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
