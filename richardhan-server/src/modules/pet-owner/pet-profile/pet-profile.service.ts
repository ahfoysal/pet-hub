import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { AddPetProfileDto, UpdatePetProfileDto } from './dto/pet-profile.dto';
import { CloudinaryService } from 'src/common/utils/cloudinary/cloudinary.service';
import { ApiResponse } from 'src/common/response/api-response';
import { Prisma } from '@prisma/client';

@Injectable()
export class PetProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService
  ) {}

  async addPetProfile(
    payload: AddPetProfileDto,
    userId: string,
    file?: Express.Multer.File
  ) {
    // Validate image
    if (!file) {
      throw new BadRequestException('Profile image is required');
    }

    // Validate pet owner
    const petOwner = await this.prisma.petOwnerProfile.findFirst({
      where: { userId },
      select: {
        id: true,
        user: {
          select: {
            status: true,
          },
        },
      },
    });

    if (!petOwner || petOwner.user.status !== 'ACTIVE') {
      throw new NotFoundException('Pet owner not found');
    }

    // Upload image to Cloudinary
    const image = await this.cloudinary.uploadFile(file);

    // Destructure payload
    const {
      petName,
      petType,
      breed,
      gender,
      age,
      dateOfBirth,
      weight,
      color,
      microChipId,
      rabiesStatus,
      dhppStatus,
      bordetellaStatus,
      allergies,
      vetDoctorName,
      vetDoctorPhone,
      temperament,
      isGoodWithKids,
      isGoodWithOtherPets,
      feedingInstructions,
      specialNotes,
    } = payload;

    const pet = await this.prisma.petProfile.create({
      data: {
        petName,
        petType,
        breed,
        gender,
        age,
        dateOfBirth,
        weight,
        color,
        microChipId,
        rabiesStatus,
        dhppStatus,
        bordetellaStatus,
        allergies,
        vetDoctorName,
        vetDoctorPhone,
        temperament,
        isGoodWithKids,
        isGoodWithOtherPets,
        feedingInstructions,
        specialNotes,
        profileImg: image.secure_url,
        petOwnerId: petOwner.id,
      },
    });

    return ApiResponse.success('Pet profile created successfully', pet);
  }

  async getAllMyPets(
    userId: string,
    cursorId?: string,
    search?: string,
    limit = 20
  ) {
    limit = Math.min(limit, 50);

    const findOptions: Prisma.PetProfileFindManyArgs = {
      where: {
        isDeleted: false,
        petOwner: {
          userId,
        },
        ...(search && {
          OR: [
            {
              petName: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              breed: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              petType: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        }),
      },
      select: {
        id: true,
        age: true,
        breed: true,
        gender: true,
        petName: true,
        petType: true,
        profileImg: true,
        weight: true,
      },
      orderBy: {
        id: 'asc',
      },
      take: limit + 1,
    };

    if (cursorId) {
      findOptions.cursor = { id: cursorId };
      findOptions.skip = 1;
    }

    const pets = await this.prisma.petProfile.findMany(findOptions);

    let nextCursor: string | null = null;
    if (pets.length > limit) {
      const nextPet = pets.pop();
      nextCursor = nextPet!.id;
    }

    return {
      data: pets,
      nextCursor,
    };
  }

  async getMyPetProfile(userId: string, petId: string) {
    const pet = await this.prisma.petProfile.findFirst({
      where: {
        id: petId,
        isDeleted: false,
        petOwner: {
          userId,
        },
      },
      select: {
        // Identity
        id: true,
        petName: true,
        petType: true,
        breed: true,
        gender: true,
        age: true,
        dateOfBirth: true,
        color: true,

        // Media
        profileImg: true,
        recentImages: true,

        // Health & vaccines
        weight: true,
        rabiesStatus: true,
        dhppStatus: true,
        bordetellaStatus: true,
        allergies: true,

        // Behavior
        temperament: true,
        isGoodWithKids: true,
        isGoodWithOtherPets: true,

        // Care
        feedingInstructions: true,
        specialNotes: true,

        // Vet info
        vetDoctorName: true,
        vetDoctorPhone: true,

        // Meta
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!pet) {
      throw new NotFoundException('Pet not found');
    }

    return ApiResponse.success('Pet found', pet);
  }

  async getPetsByOwnerId(
    ownerId: string,
    cursor?: string,
    search?: string,
    limit = 20
  ) {
    limit = Math.min(limit, 50);

    const findOptions: Prisma.PetProfileFindManyArgs = {
      where: {
        isDeleted: false,
        petOwner: {
          id: ownerId,
        },
        ...(search && {
          OR: [
            {
              petName: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              breed: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              petType: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        }),
      },
      select: {
        id: true,
        petName: true,
        petType: true,
        breed: true,
        gender: true,
        age: true,
        weight: true,
        profileImg: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit + 1,
    };

    if (cursor) {
      findOptions.cursor = { id: cursor };
      findOptions.skip = 1;
    }

    const pets = await this.prisma.petProfile.findMany(findOptions);

    let nextCursor: string | null = null;
    if (pets.length > limit) {
      const nextPet = pets.pop();
      nextCursor = nextPet!.id;
    }

    return ApiResponse.success('Pets found', {
      data: pets,
      nextCursor,
    });
  }

  async getPetById(petId: string) {
    const pet = await this.prisma.petProfile.findFirst({
      where: {
        id: petId,
        isDeleted: false,
      },
      select: {
        // Pet info
        id: true,
        petName: true,
        petType: true,
        breed: true,
        gender: true,
        age: true,
        dateOfBirth: true,
        color: true,

        // Media
        profileImg: true,
        recentImages: true,

        // Health & vaccines
        weight: true,
        rabiesStatus: true,
        dhppStatus: true,
        bordetellaStatus: true,
        allergies: true,

        // Behavior
        temperament: true,
        isGoodWithKids: true,
        isGoodWithOtherPets: true,

        // Care
        feedingInstructions: true,
        specialNotes: true,

        // Vet info
        vetDoctorName: true,
        vetDoctorPhone: true,

        // Owner (flatten later)
        petOwner: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                fullName: true,
                image: true,
                userName: true,
              },
            },
          },
        },
      },
    });

    if (!pet) {
      throw new NotFoundException('Pet not found');
    }

    const flatPet = {
      // Pet
      id: pet.id,
      petName: pet.petName,
      petType: pet.petType,
      breed: pet.breed,
      gender: pet.gender,
      age: pet.age,
      dateOfBirth: pet.dateOfBirth,
      color: pet.color,
      weight: pet.weight,
      profileImg: pet.profileImg,
      recentImages: pet.recentImages,

      rabiesStatus: pet.rabiesStatus,
      dhppStatus: pet.dhppStatus,
      bordetellaStatus: pet.bordetellaStatus,
      allergies: pet.allergies,

      temperament: pet.temperament,
      isGoodWithKids: pet.isGoodWithKids,
      isGoodWithOtherPets: pet.isGoodWithOtherPets,

      feedingInstructions: pet.feedingInstructions,
      specialNotes: pet.specialNotes,

      vetDoctorName: pet.vetDoctorName,
      vetDoctorPhone: pet.vetDoctorPhone,

      // Owner (flattened)
      ownerId: pet.petOwner?.id ?? null,
      ownerUserId: pet.petOwner?.user?.id ?? null,
      ownerName: pet.petOwner?.user?.fullName ?? null,
      ownerImage: pet.petOwner?.user?.image ?? null,
      ownerUserName: pet.petOwner?.user?.userName ?? null,
    };

    return ApiResponse.success('Pet found', flatPet);
  }

  async deletePetProfile(userId: string, petId: string) {
    const pet = await this.prisma.petProfile.findFirst({
      where: {
        id: petId,
        isDeleted: false,
        petOwner: {
          userId,
        },
      },
    });

    if (!pet) {
      throw new NotFoundException('Pet not found');
    }

    await this.prisma.petProfile.update({
      where: { id: petId },
      data: { isDeleted: true },
    });
    return ApiResponse.success('Pet deleted');
  }

  async updatePetProfile(
    userId: string,
    petId: string,
    payload: UpdatePetProfileDto,
    file?: Express.Multer.File
  ) {
    const pet = await this.prisma.petProfile.findFirst({
      where: {
        id: petId,
        isDeleted: false,
        petOwner: {
          userId,
        },
      },
    });

    if (!pet) {
      throw new NotFoundException('Pet not found');
    }

    // Start with existing profile image
    let imgLink = pet.profileImg;

    if (file) {
      const image = await this.cloudinary.uploadFile(file);
      imgLink = image.secure_url;
    }

    // Only include fields that are defined in payload
    const updateData: Prisma.PetProfileUpdateInput = { profileImg: imgLink };
    for (const key in payload) {
      if (payload[key] !== undefined && key !== 'file') {
        updateData[key] = payload[key];
      }
    }

    const updatedPet = await this.prisma.petProfile.update({
      where: { id: petId },
      data: updateData,
      select: {
        id: true,
        petName: true,
        petType: true,
        breed: true,
        gender: true,
        age: true,
        dateOfBirth: true,
        color: true,
        weight: true,
        profileImg: true,
        recentImages: true,
        rabiesStatus: true,
        dhppStatus: true,
        bordetellaStatus: true,
        allergies: true,
        temperament: true,
        isGoodWithKids: true,
        isGoodWithOtherPets: true,
        feedingInstructions: true,
        specialNotes: true,
        vetDoctorName: true,
        vetDoctorPhone: true,
      },
    });

    return ApiResponse.success('Pet updated', updatedPet);
  }
}
