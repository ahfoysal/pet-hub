import { Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/common/utils/cloudinary/cloudinary.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PetOwnerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  // async profileSetup(
  //   dto: CreatePetOwnerDto,
  //   user: User,
  //   file: Express.Multer.File
  // ) {
  //   return this.prisma
  //     .$transaction(async (tx) => {
  //       const uploadedImage = await this.cloudinaryService.uploadFile(file);
  //       const imageUrls = uploadedImage.secure_url;

  //       const profile = await tx.petOwnerProfile.create({
  //         data: {
  //           userId: user.id,
  //           name: dto.name,
  //           image: imageUrls,
  //         },
  //       });

  //       return {
  //         ...profile,
  //       };
  //     })
  //     .then((profile) => {
  //       return ApiResponse.success('Pet owner profile created successfully', {
  //         ...profile,
  //       });
  //     })
  //     .catch((error) => {
  //       return ApiResponse.error('Pet owner profile creation failed', error);
  //     });
  // }
}
