import { Injectable, NotFoundException } from '@nestjs/common';
import { ApiResponse } from 'src/common/response/api-response';
import { PrismaService } from '../../prisma/prisma.service';
import { CloudinaryService } from 'src/common/utils/cloudinary/cloudinary.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateVendorDetailsDto } from './dto/update-vendor-details.dto';
import { UpdateNotificationSettingsDto } from './dto/update-notification-settings.dto';
import { UpdateBankingDto } from './dto/update-banking.dto';

@Injectable()
export class VendorSettingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { vendorProfile: true },
    });

    if (!user) throw new NotFoundException('User not found');

    return ApiResponse.success('Vendor profile retrieved successfully', {
      fullName: user.vendorProfile?.name || '',
      email: user.email,
      phone: user.vendorProfile?.phone || '',
      yearsOfExperience: 0,
    });
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { vendorProfile: true },
    });

    if (!user || !user.vendorProfile) {
      throw new NotFoundException('Vendor profile not found');
    }

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: {
          ...(dto.email && { email: dto.email }),
        },
      }),
      this.prisma.vendorProfile.update({
        where: { id: user.vendorProfile.id },
        data: {
          ...(dto.fullName && { name: dto.fullName }),
          ...(dto.phone && { phone: dto.phone }),
        },
      }),
    ]);

    return ApiResponse.success('Profile updated successfully');
  }

  async getVendorDetails(userId: string) {
    const vendor = await this.prisma.vendorProfile.findUnique({
      where: { userId },
      include: { addresses: true },
    });

    if (!vendor) throw new NotFoundException('Vendor profile not found');

    return ApiResponse.success('Vendor details retrieved successfully', vendor);
  }

  async updateVendorDetails(userId: string, dto: UpdateVendorDetailsDto) {
    const vendor = await this.prisma.vendorProfile.findUnique({
      where: { userId },
    });

    if (!vendor) throw new NotFoundException('Vendor profile not found');

    const updateData: any = {
      ...(dto.name && { name: dto.name }),
      ...(dto.description && { description: dto.description }),
    };

    if (dto.address) {
      const existingAddress = await this.prisma.address.findFirst({
        where: { vendorProfileId: vendor.id },
      });

      if (existingAddress) {
        await this.prisma.address.update({
          where: { id: existingAddress.id },
          data: {
            city: dto.address.city ?? existingAddress.city,
            country: dto.address.country ?? existingAddress.country,
            streetAddress: dto.address.streetAddress ?? existingAddress.streetAddress,
            postalCode: dto.address.postalCode ?? existingAddress.postalCode,
          },
        });
      } else {
        await this.prisma.address.create({
          data: {
            city: dto.address.city || '',
            country: dto.address.country || '',
            streetAddress: dto.address.streetAddress || '',
            postalCode: dto.address.postalCode || '',
            vendorProfileId: vendor.id,
          },
        });
      }
    }

    await this.prisma.vendorProfile.update({
      where: { id: vendor.id },
      data: updateData,
    });

    return ApiResponse.success('Vendor details updated successfully');
  }

  async getNotificationSettings(userId: string) {
    const vendor = await this.prisma.vendorProfile.findUnique({
      where: { userId },
      include: { notificationSettings: true },
    });

    if (!vendor) throw new NotFoundException('Vendor profile not found');

    let settings = vendor.notificationSettings;
    if (!settings) {
      settings = await this.prisma.vendorNotificationSettings.create({
        data: { vendorProfileId: vendor.id },
      });
    }

    return ApiResponse.success('Notification settings retrieved successfully', settings);
  }

  async updateNotificationSettings(userId: string, dto: UpdateNotificationSettingsDto) {
    const vendor = await this.prisma.vendorProfile.findUnique({
      where: { userId },
    });

    if (!vendor) throw new NotFoundException('Vendor profile not found');

    await this.prisma.vendorNotificationSettings.upsert({
      where: { vendorProfileId: vendor.id },
      update: { ...dto },
      create: {
        ...dto,
        vendorProfileId: vendor.id,
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
        id: existingBank?.id || 'new-id',
      },
      update: { ...dto },
      create: {
        ...dto,
        bankName: dto.bankName || '',
        accountHolderName: dto.accountHolderName || '',
        accountNumber: dto.accountNumber || '',
        routingNumber: dto.routingNumber || '',
        userId,
        profileType: 'VENDOR',
        branchName: '',
        swiftCode: '',
        country: '',
        isPrimary: true,
      },
    });

    return ApiResponse.success('Banking info updated successfully');
  }

  async getDocuments(userId: string) {
    const vendor = await this.prisma.vendorProfile.findUnique({
      where: { userId },
    });

    if (!vendor) throw new NotFoundException('Vendor profile not found');

    return ApiResponse.success('Documents retrieved successfully', {
      businessRegistrationNumber: vendor.businessRegistrationNumber,
      businessLicense: vendor.businessLicense,
      insuranceCertificate: vendor.insuranceCertificate,
    });
  }

  async uploadDocuments(userId: string, files: Express.Multer.File[]) {
    const vendor = await this.prisma.vendorProfile.findUnique({
      where: { userId },
    });

    if (!vendor) throw new NotFoundException('Vendor profile not found');

    const uploadedFiles = await this.cloudinaryService.uploadMultipleFiles(files);
    
    // Simple logic: first file is license, second is insurance if multiple
    const updates: any = {};
    if (uploadedFiles.length > 0) updates.businessLicense = uploadedFiles[0].secure_url;
    if (uploadedFiles.length > 1) updates.insuranceCertificate = uploadedFiles[1].secure_url;

    await this.prisma.vendorProfile.update({
      where: { id: vendor.id },
      data: updates,
    });

    return ApiResponse.success('Documents uploaded successfully');
  }
}
