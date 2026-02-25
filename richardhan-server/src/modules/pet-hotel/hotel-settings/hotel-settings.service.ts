import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ApiResponse } from 'src/common/response/api-response';
import { CloudinaryService } from 'src/common/utils/cloudinary/cloudinary.service';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateBankingDto } from './dto/update-banking.dto';
import { UpdateHotelDetailsDto } from './dto/update-hotel-details.dto';
import { UpdateNotificationSettingsDto } from './dto/update-notification-settings.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class HotelSettingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        fullName: true,
        email: true,
        phone: true,
        hotelProfile: {
          select: {
            yearsOfExperience: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return ApiResponse.success('Profile retrieved successfully', {
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      yearsOfExperience: user.hotelProfile?.yearsOfExperience || 0,
    });
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const { fullName, email, phone, yearsOfExperience } = dto;

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: {
          ...(fullName && { fullName }),
          ...(email && { email }),
          ...(phone && { phone }),
        },
      });

      if (yearsOfExperience !== undefined) {
        await tx.hotelProfile.update({
          where: { userId },
          data: { yearsOfExperience },
        });
      }
    });

    return ApiResponse.success('Profile updated successfully');
  }

  async getHotelDetails(userId: string) {
    const hotel = await this.prisma.hotelProfile.findUnique({
      where: { userId },
      include: {
        addresses: true,
      },
    });

    if (!hotel) throw new NotFoundException('Hotel profile not found');

    return ApiResponse.success('Hotel details retrieved successfully', hotel);
  }

  async updateHotelDetails(userId: string, dto: UpdateHotelDetailsDto) {
    const { name, description, businessRegistrationNumber, address } = dto;

    await this.prisma.$transaction(async (tx) => {
      const hotel = await tx.hotelProfile.update({
        where: { userId },
        data: {
          ...(name && { name }),
          ...(description && { description }),
          ...(businessRegistrationNumber && { businessRegistrationNumber }),
        },
      });

      if (address) {
        // Assuming one primary address for now as per Figma
        const existingAddress = await tx.address.findFirst({
          where: { hotelProfileId: hotel.id },
        });

        if (existingAddress) {
          await tx.address.update({
            where: { id: existingAddress.id },
            data: {
              streetAddress: address.streetAddress ?? existingAddress.streetAddress,
              city: address.city ?? existingAddress.city,
              country: address.country ?? existingAddress.country,
              postalCode: address.postalCode ?? existingAddress.postalCode,
            },
          });
        } else {
          await tx.address.create({
            data: {
              streetAddress: address.streetAddress || '',
              city: address.city || '',
              country: address.country || '',
              postalCode: address.postalCode || '',
              hotelProfileId: hotel.id,
            },
          });
        }
      }
    });

    return ApiResponse.success('Hotel details updated successfully');
  }

  async updatePassword(userId: string, dto: UpdatePasswordDto) {
    const { currentPassword, newPassword, confirmPassword } = dto;

    if (newPassword !== confirmPassword) {
      throw new BadRequestException('New passwords do not match');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.password) {
      throw new NotFoundException('User or password not found');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Incorrect current password');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return ApiResponse.success('Password updated successfully');
  }

  async toggle2FA(userId: string, enable: boolean) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { isTwoFactorEnabled: enable },
    });

    return ApiResponse.success(`Two-factor authentication ${enable ? 'enabled' : 'disabled'} successfully`);
  }

  async getNotificationSettings(userId: string) {
    const hotel = await this.prisma.hotelProfile.findUnique({
      where: { userId },
      include: { notificationSettings: true },
    });

    if (!hotel) throw new NotFoundException('Hotel profile not found');

    let settings = hotel.notificationSettings;
    if (!settings) {
      settings = await this.prisma.hotelNotificationSettings.create({
        data: { hotelProfileId: hotel.id },
      });
    }

    return ApiResponse.success('Notification settings retrieved successfully', settings);
  }

  async updateNotificationSettings(userId: string, dto: UpdateNotificationSettingsDto) {
    const hotel = await this.prisma.hotelProfile.findUnique({
      where: { userId },
    });

    if (!hotel) throw new NotFoundException('Hotel profile not found');

    await this.prisma.hotelNotificationSettings.upsert({
      where: { hotelProfileId: hotel.id },
      update: { ...dto },
      create: {
        ...dto,
        hotelProfileId: hotel.id,
      },
    });

    return ApiResponse.success('Notification settings updated successfully');
  }

  async getBankingInfo(userId: string) {
    const bankInfo = await this.prisma.bankInformation.findFirst({
      where: { userId },
    });

    return ApiResponse.success('Banking info retrieved successfully', bankInfo);
  }

  async updateBankingInfo(userId: string, dto: UpdateBankingDto) {
    await this.prisma.bankInformation.upsert({
      where: {
        id: (await this.prisma.bankInformation.findFirst({ where: { userId } }))?.id || 'new-id',
      },
      update: {
        bankName: dto.bankName,
        accountHolderName: dto.accountHolderName,
        accountNumber: dto.accountNumber,
        routingNumber: dto.routingNumber,
      },
      create: {
        bankName: dto.bankName || '',
        accountHolderName: dto.accountHolderName || '',
        accountNumber: dto.accountNumber || '',
        routingNumber: dto.routingNumber || '',
        userId,
        profileType: 'PET_HOTEL',
        branchName: '',
        swiftCode: '',
        country: '',
        isPrimary: true,
      },
    });

    return ApiResponse.success('Banking info updated successfully');
  }

  async getDocuments(userId: string) {
    const hotel = await this.prisma.hotelProfile.findUnique({
      where: { userId },
    });

    if (!hotel) throw new NotFoundException('Hotel profile not found');

    return ApiResponse.success('Documents retrieved successfully', {
      businessLicense: hotel.businessLicense,
      insuranceCertificate: hotel.insuranceCertificate,
      // Add other document fields if needed (NID etc usually in KYC model)
    });
  }

  async uploadDocuments(userId: string, files: Express.Multer.File[]) {
    const uploadedImages = await this.cloudinaryService.uploadMultipleFiles(files);
    const imageUrls = uploadedImages.map((img) => img.secure_url);

    // This is a simplified version. Usually you'd map specific files to specific fields.
    // For now, let's assume the first is license, second is insurance etc.
    // In a real scenario, we'd use named fields in multer.

    await this.prisma.hotelProfile.update({
      where: { userId },
      data: {
        ...(imageUrls[0] && { businessLicense: imageUrls[0] }),
        ...(imageUrls[1] && { insuranceCertificate: imageUrls[1] }),
      },
    });

    return ApiResponse.success('Documents uploaded successfully');
  }
}
