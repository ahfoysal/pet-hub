import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ApiResponse } from 'src/common/response/api-response';
import { CloudinaryService } from 'src/common/utils/cloudinary/cloudinary.service';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateBankingDto } from './dto/update-banking.dto';
import { UpdateSitterDetailsDto } from './dto/update-sitter-details.dto';
import { UpdateNotificationSettingsDto } from './dto/update-notification-settings.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class PetSitterSettingsService {
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
        petSitterProfiles: {
          select: {
            yearsOfExperience: true,
            bio: true,
            designations: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const profile = user.petSitterProfiles?.[0];

    return ApiResponse.success('Profile retrieved successfully', {
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      yearsOfExperience: profile?.yearsOfExperience || 0,
      bio: profile?.bio || '',
      designations: profile?.designations || '',
    });
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const { fullName, email, phone, yearsOfExperience, bio, designations } = dto;

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: {
          ...(fullName && { fullName }),
          ...(email && { email }),
          ...(phone && { phone }),
        },
      });

      const profile = await tx.petSitterProfile.findUnique({ where: { userId } });
      if (profile) {
        await tx.petSitterProfile.update({
          where: { userId },
          data: {
            ...(yearsOfExperience !== undefined && { yearsOfExperience }),
            ...(bio && { bio }),
            ...(designations && { designations }),
          },
        });
      }
    });

    return ApiResponse.success('Profile updated successfully');
  }

  async getSitterDetails(userId: string) {
    const sitter = await this.prisma.petSitterProfile.findUnique({
      where: { userId },
      include: {
        petSitterAddresses: true,
      },
    });

    if (!sitter) throw new NotFoundException('Pet sitter profile not found');

    return ApiResponse.success('Pet sitter details retrieved successfully', sitter);
  }

  async updateSitterDetails(userId: string, dto: UpdateSitterDetailsDto) {
    const { address } = dto;

    await this.prisma.$transaction(async (tx) => {
      const sitter = await tx.petSitterProfile.findUnique({ where: { userId } });
      if (!sitter) throw new NotFoundException('Pet sitter profile not found');

      if (address) {
        const existingAddress = await tx.petSitterAddress.findFirst({
          where: { petSitterId: sitter.id },
        });

        if (existingAddress) {
          await tx.petSitterAddress.update({
            where: { id: existingAddress.id },
            data: {
              streetAddress: address.streetAddress ?? existingAddress.streetAddress,
              city: address.city ?? existingAddress.city,
              country: address.country ?? existingAddress.country,
              postalCode: address.postalCode ?? existingAddress.postalCode,
            },
          });
        } else {
          await tx.petSitterAddress.create({
            data: {
              streetAddress: address.streetAddress || '',
              city: address.city || '',
              country: address.country || '',
              postalCode: address.postalCode || '',
              petSitterId: sitter.id,
            },
          });
        }
      }
    });

    return ApiResponse.success('Pet sitter details updated successfully');
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
    const sitter = await this.prisma.petSitterProfile.findUnique({
      where: { userId },
      include: { notificationSettings: true },
    });

    if (!sitter) throw new NotFoundException('Pet sitter profile not found');

    let settings = sitter.notificationSettings;
    if (!settings) {
      settings = await this.prisma.petSitterNotificationSettings.create({
        data: { petSitterProfileId: sitter.id },
      });
    }

    return ApiResponse.success('Notification settings retrieved successfully', settings);
  }

  async updateNotificationSettings(userId: string, dto: UpdateNotificationSettingsDto) {
    const sitter = await this.prisma.petSitterProfile.findUnique({
      where: { userId },
    });

    if (!sitter) throw new NotFoundException('Pet sitter profile not found');

    await this.prisma.petSitterNotificationSettings.upsert({
      where: { petSitterProfileId: sitter.id },
      update: { ...dto },
      create: {
        ...dto,
        petSitterProfileId: sitter.id,
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
    const existingBank = await this.prisma.bankInformation.findFirst({ where: { userId } });

    await this.prisma.bankInformation.upsert({
      where: {
        id: existingBank?.id || 'new-id', // Placeholder, upsert needs unique field or ID
      },
      update: {
        ...dto,
      },
      create: {
        ...dto,
        bankName: dto.bankName || '',
        accountHolderName: dto.accountHolderName || '',
        accountNumber: dto.accountNumber || '',
        routingNumber: dto.routingNumber || '',
        userId,
        profileType: 'PET_SITTER',
        branchName: '',
        swiftCode: '',
        country: '',
        isPrimary: true,
      },
    });

    return ApiResponse.success('Banking info updated successfully');
  }

  async getDocuments(userId: string) {
    const sitter = await this.prisma.petSitterProfile.findUnique({
      where: { userId },
    });

    if (!sitter) throw new NotFoundException('Pet sitter profile not found');

    return ApiResponse.success('Documents retrieved successfully', {
      businessRegistrationNumber: sitter.businessRegistrationNumber,
      businessLicense: sitter.businessLicense,
      insuranceCertificate: sitter.insuranceCertificate,
    });
  }

  async uploadDocuments(userId: string, files: Express.Multer.File[]) {
    const uploadedImages = await this.cloudinaryService.uploadMultipleFiles(files);
    const imageUrls = uploadedImages.map((img) => img.secure_url);

    await this.prisma.petSitterProfile.update({
      where: { userId },
      data: {
        ...(imageUrls[0] && { businessLicense: imageUrls[0] }),
        ...(imageUrls[1] && { insuranceCertificate: imageUrls[1] }),
      },
    });

    return ApiResponse.success('Documents uploaded successfully');
  }
}
