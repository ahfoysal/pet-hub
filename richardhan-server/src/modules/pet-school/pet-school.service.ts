import { Injectable, NotFoundException } from '@nestjs/common';
import { CourseEnrollmentStatus } from '@prisma/client';
import { ApiResponse } from 'src/common/response/api-response';
import { User } from 'src/common/types/user.type';
import { CloudinaryService } from 'src/common/utils/cloudinary/cloudinary.service';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateAddressDto } from '../vendor/dto/update-address.dto';
import { UpdateSchoolProfileDto } from './dto/update-pet-school.dto';

@Injectable()
export class PetSchoolService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  async profileSetup(dto: any, user: User, files: Express.Multer.File[]) {
    const uploadedImages =
      await this.cloudinaryService.uploadMultipleFiles(files);
    const imageUrls = uploadedImages.map((img) => img.secure_url);

    return this.prisma
      .$transaction(async (tx) => {
        const schoolData = {
          userId: user.id,
          email: dto.email,
          phone: dto.phone,
          name: dto.name,
          description: dto.description,
          images: imageUrls,
        };
        const school = await tx.petSchoolProfile.create({
          data: schoolData,
        });

        const addressData = {
          city: dto.city,
          country: dto.country,
          streetAddress: dto.streetAddress,
          postalCode: dto.postalCode,
          vendorProfileId: school.id,
        };

        await tx.address.create({
          data: {
            city: dto.city,
            country: dto.country,
            streetAddress: dto.streetAddress,
            postalCode: dto.postalCode,
            petSchoolProfileId: school.id,
          },
        });

        await tx.user.update({
          where: { id: user.id },
          data: { hasProfile: true },
        });

        return {
          ...school,
          addresses: { ...addressData },
        };
      })
      .then((school) => {
        return ApiResponse.success('Vendor profile created successfully', {
          ...school,
        });
      })
      .catch((error) => {
        return ApiResponse.error('Vendor profile creation failed', error);
      });
  }

  async getMyProfile(userId: string) {
    const school = await this.prisma.petSchoolProfile.findUnique({
      where: { userId },
      include: {
        addresses: true,
      },
    });
    if (!school) throw new NotFoundException('School profile not found');

    return ApiResponse.success('School profile found', school);
  }

  async updateSchoolProfile(
    dto: UpdateSchoolProfileDto,
    user: User,
    files?: Express.Multer.File[]
  ) {
    const existingSchool = await this.prisma.petSchoolProfile.findUnique({
      where: { userId: user.id },
    });

    if (!existingSchool) {
      return ApiResponse.error('School profile not found');
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
        : (existingSchool.images ?? []);

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
    const updatedSchool = await this.prisma.petSchoolProfile.update({
      where: { userId: user.id },
      data: updateData,
    });

    return ApiResponse.success(
      'Vendor profile updated successfully',
      updatedSchool
    );
  }

  async updateSchoolAddress(
    user: User,
    addressId: string,
    dto: UpdateAddressDto
  ) {
    const school = await this.prisma.petSchoolProfile.findUnique({
      where: {
        userId: user.id,
      },
    });
    if (!school) {
      throw new NotFoundException('School profile not found');
    }

    const address = await this.prisma.address.findFirst({
      where: {
        id: addressId,
        petSchoolProfileId: school.id,
      },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
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

  async getMyStudents(
    petSchoolId: string,
    search?: string,
    status?: CourseEnrollmentStatus
  ) {
    const students = await this.prisma.courseUser.findMany({
      where: {
        course: {
          schoolId: petSchoolId,
        },
        ...(status && {
          status,
        }),
        ...(search && {
          OR: [
            {
              user: {
                fullName: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            },
            {
              petProfile: {
                petName: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            },
            {
              course: {
                name: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            },
          ],
        }),
      },
      select: {
        user: {
          select: {
            id: true,
            fullName: true,
            image: true,
          },
        },
        petProfile: {
          select: {
            id: true,
            petName: true,
            profileImg: true,
            breed: true,
            gender: true,
            petType: true,
          },
        },
        course: {
          select: {
            id: true,
            name: true,
          },
        },
        enrolledAt: true,
        status: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return ApiResponse.success('Students found', students);
  }
}
