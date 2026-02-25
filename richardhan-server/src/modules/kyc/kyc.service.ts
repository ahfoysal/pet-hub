import { BadRequestException, Injectable } from '@nestjs/common';
import { KycStatus, ProfileStatus } from '@prisma/client';
import { ApiResponse } from 'src/common/response/api-response';
import { User } from 'src/common/types/user.type';
import { CloudinaryService } from 'src/common/utils/cloudinary/cloudinary.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateKycDto } from './dto/submit-kyc.dto';
import { KycFiles } from './types/kyc-files.type';

@Injectable()
export class KycService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  async createKyc(user: User, dto: CreateKycDto, files: KycFiles) {
    const existingKyc = await this.prisma.kYC.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (existingKyc) {
      throw new BadRequestException('KYC already submitted');
    }

    // Upload basic files
    let profileImageUrl: string | null = null;
    if (files.image?.[0]) {
      const res = await this.cloudinaryService.uploadFile(files.image[0]);
      profileImageUrl = res.secure_url;
    }

    const idFront = await this.cloudinaryService.uploadFile(
      files.identificationFrontImage[0]
    );

    const idBack = await this.cloudinaryService.uploadFile(
      files.identificationBackImage[0]
    );

    let signatureImageUrl: string | null = null;
    if (files.signatureImage?.[0]) {
      const res = await this.cloudinaryService.uploadFile(files.signatureImage[0]);
      signatureImageUrl = res.secure_url;
    }

    // Upload new business/license files
    let businessCertificateUrl: string | undefined = undefined;
    if (files.businessRegistrationCertificate?.[0]) {
      const res = await this.cloudinaryService.uploadFile(files.businessRegistrationCertificate[0]);
      businessCertificateUrl = res.secure_url;
    }

    let hotelLicenseUrl: string | undefined = undefined;
    if (files.hotelLicenseImage?.[0]) {
      const res = await this.cloudinaryService.uploadFile(files.hotelLicenseImage[0]);
      hotelLicenseUrl = res.secure_url;
    }

    let hygieneUrl: string | undefined = undefined;
    if (files.hygieneCertificate?.[0]) {
      const res = await this.cloudinaryService.uploadFile(files.hygieneCertificate[0]);
      hygieneUrl = res.secure_url;
    }

    const facilityPhotoUrls: string[] = [];
    if (files.facilityPhotos && files.facilityPhotos.length > 0) {
      for (const file of files.facilityPhotos) {
        const res = await this.cloudinaryService.uploadFile(file);
        facilityPhotoUrls.push(res.secure_url);
      }
    }

    // Save to DB and create Profile within a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      const createdKyc = await tx.kYC.create({
        data: {
          userId: user.id,
          fullName: dto.fullName,
          email: dto.email,
          dateOfBirth: dto.dateOfBirth,
          gender: dto.gender,
          nationality: dto.nationality,
          identificationType: dto.identificationType,
          identificationNumber: dto.identificationNumber,
          phoneNumber: dto.phoneNumber,
          presentAddress: dto.presentAddress,
          permanentAddress: dto.permanentAddress,
          emergencyContactName: dto.emergencyContactName,
          emergencyContactRelation: dto.emergencyContactRelation,
          emergencyContactPhone: dto.emergencyContactPhone,
          roleType: dto.roleType,
          image: profileImageUrl,
          identificationFrontImage: idFront.secure_url,
          identificationBackImage: idBack.secure_url,
          signatureImage: signatureImageUrl,
          
          // New Business Fields
          businessName: dto.businessName,
          businessRegistrationNumber: dto.businessRegistrationNumber,
          businessAddress: dto.businessAddress,
          businessRegistrationCertificate: businessCertificateUrl,
          
          // New License Fields
          licenseNumber: dto.licenseNumber,
          licenseIssueDate: dto.licenseIssueDate,
          licenseExpiryDate: dto.licenseExpiryDate,
          hotelLicenseImage: hotelLicenseUrl,
          hygieneCertificate: hygieneUrl,
          
          // facility
          facilityPhotos: facilityPhotoUrls,
        },
      });

      // Automatically create the initial unverified profile shell based on Role
      const profileName = dto.fullName;
      
      switch (dto.roleType) {
        case 'VENDOR': {
          await tx.vendorProfile.upsert({
            where: { userId: user.id },
            create: {
              userId: user.id,
              email: dto.email,
              phone: dto.phoneNumber,
              name: profileName,
              isVerified: false,
              status: ProfileStatus.PENDING,
            },
            update: {
              email: dto.email,
              phone: dto.phoneNumber,
              name: profileName,
            },
          });
          break;
        }

        case 'HOTEL': {
          const hotel = await tx.hotelProfile.upsert({
            where: { userId: user.id },
            create: {
              userId: user.id,
              email: dto.email,
              phone: dto.phoneNumber,
              name: profileName,
              dayStartingTime: '09:00 AM',
              dayEndingTime: '06:00 PM',
              nightStartingTime: '07:00 PM',
              nightEndingTime: '08:00 AM',
              isVerified: false,
              status: ProfileStatus.PENDING,
            },
            update: {
              email: dto.email,
              phone: dto.phoneNumber,
              name: profileName,
            },
          });

          // Create initial address shell for the hotel
          await tx.address.upsert({
            where: { id: hotel.id + '_addr' }, // Deterministic ID or check if exists
            create: {
              hotelProfileId: hotel.id,
              streetAddress: dto.presentAddress ?? '',
              city: 'City', // Defaults
              country: 'Country',
              postalCode: '0000',
            },
            update: {
              streetAddress: dto.presentAddress ?? '',
            },
          });
          break;
        }

        case 'SCHOOL': {
          await tx.petSchoolProfile.upsert({
            where: { userId: user.id },
            create: {
              userId: user.id,
              email: dto.email,
              phone: dto.phoneNumber,
              name: profileName,
              isVerified: false,
              status: ProfileStatus.PENDING,
            },
            update: {
              email: dto.email,
              phone: dto.phoneNumber,
              name: profileName,
            },
          });
          break;
        }

        case 'PET_SITTER': {
          await tx.petSitterProfile.upsert({
            where: { userId: user.id },
            create: {
              userId: user.id,
              bio: '',
              designations: '',
              analytics: '[]',
              languages: [],
              yearsOfExperience: 0,
              profileStatus: ProfileStatus.PENDING,
              isVerified: false,
            },
            update: {
              // No specific fields to update from KYC yet for sitter
            },
          });
          break;
        }
      }

      await tx.user.update({
        where: { id: user.id },
        data: { hasProfile: true },
      });

      return createdKyc;
    });

    return ApiResponse.success('KYC submitted successfully', result);
  }

  async getAllKyc() {
    const result = await this.prisma.kYC.findMany();
    return ApiResponse.success('KYC found', result);
  }

  async getKycById(id: string) {
    const result = await this.prisma.kYC.findUnique({
      where: {
        id,
      },
    });
    return ApiResponse.success('KYC found', result);
  }

  async getMyKyc(userId: string) {
    const result = await this.prisma.kYC.findFirst({
      where: {
        userId,
      },
    });

    return ApiResponse.success('KYC found', result);
  }

  async approveKyc(kycId: string, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const kyc = await tx.kYC.findUnique({
        where: { id: kycId },
      });
      if (!kyc) {
        throw new BadRequestException('KYC not found');
      }
      if (kyc.status === KycStatus.APPROVED) {
        throw new BadRequestException('KYC already approved');
      }

      const approvedKyc = await tx.kYC.update({
        where: { id: kycId },
        data: {
          status: KycStatus.APPROVED,
          reviewedAt: new Date(),
          reviewedBy: userId,
        },
      });

      switch (kyc.roleType) {
        case 'VENDOR':
          await tx.vendorProfile.update({
            where: { userId: kyc.userId },
            data: { isVerified: true, status: ProfileStatus.ACTIVE },
          });
          break;

        case 'HOTEL':
          await tx.hotelProfile.update({
            where: { userId: kyc.userId },
            data: { isVerified: true, status: ProfileStatus.ACTIVE },
          });
          break;

        case 'SCHOOL':
          await tx.petSchoolProfile.update({
            where: { userId: kyc.userId },
            data: { isVerified: true, status: ProfileStatus.ACTIVE },
          });
          break;

        case 'PET_SITTER':
          await tx.petSitterProfile.update({
            where: { userId: kyc.userId },
            data: { profileStatus: ProfileStatus.ACTIVE, isVerified: true },
          });
          break;

        default:
          throw new BadRequestException('Invalid role type');
      }

      return ApiResponse.success('KYC approved successfully', approvedKyc);
    });
  }

  async rejectKyc(kycId: string, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const kyc = await tx.kYC.findUnique({
        where: { id: kycId },
      });

      if (!kyc) {
        throw new BadRequestException('KYC not found');
      }
      if (kyc.status === KycStatus.REJECTED) {
        throw new BadRequestException('KYC already rejected');
      }

      const rejectedKyc = await tx.kYC.update({
        where: { id: kycId },
        data: {
          status: KycStatus.REJECTED,
          reviewedAt: new Date(),
          reviewedBy: userId,
        },
      });

      return ApiResponse.success('KYC rejected successfully', rejectedKyc);
    });
  }
}
