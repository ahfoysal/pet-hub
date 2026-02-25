import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreatePetSitterProfileDto,
  UpdatePetSitterProfileDto,
} from './dto/pet-sitter-profile.dto';
import { ApiResponse } from 'src/common/response/api-response';
import { PetSitterStatus, Prisma } from '@prisma/client';

@Injectable()
export class PetSitterService {
  constructor(private readonly prisma: PrismaService) {}

  private normalizeLanguages(
    incoming: string | string[] | undefined,
    existing: string[] = []
  ): string[] {
    const incomingList = Array.isArray(incoming)
      ? incoming
      : incoming
        ? [incoming]
        : [];

    const normalizedIncoming = incomingList
      .map((l) => l.trim().toLowerCase())
      .filter(Boolean);

    const normalizedExisting = existing
      .map((l) => l.trim().toLowerCase())
      .filter(Boolean);

    return Array.from(new Set([...normalizedExisting, ...normalizedIncoming]));
  }

  async createPetSitterProfile(
    userId: string,
    payload: CreatePetSitterProfileDto
  ) {
    // 1. Check user existence and status outside transaction
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (user.role !== 'PET_SITTER')
      throw new BadRequestException('User is not a pet sitter');
    if (user.status !== 'ACTIVE')
      throw new BadRequestException('User is not active');

    if (user.hasProfile)
      throw new BadRequestException('Pet sitter profile already initialized');

    // 2. Check if profile exists outside transaction
    const profile = await this.prisma.petSitterProfile.findUnique({
      where: { userId },
    });
    if (!profile)
      throw new BadRequestException('Pet sitter profile not initialized');

    // 3. Normalize and deduplicate languages
    const uniqueLanguages = this.normalizeLanguages(
      payload.languages,
      profile.languages
    );

    // 4. Run update + address creation inside a single interactive transaction
    const updatedProfile = await this.prisma.$transaction(async (tx) => {
      const sitter = await tx.petSitterProfile.update({
        where: { userId },
        data: {
          bio: payload.bio,
          designations: payload.designation,
          languages: uniqueLanguages,
          yearsOfExperience: payload.yearsOfExperience,
        },
        select: {
          id: true,
          bio: true,
          designations: true,
          languages: true,
          yearsOfExperience: true,
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: { hasProfile: true },
      });

      await tx.petSitterAddress.upsert({
        where: { petSitterId: sitter.id },
        update: {
          streetAddress: payload.streetAddress,
          city: payload.city,
          country: payload.country,
          postalCode: payload.postalCode,
        },
        create: {
          petSitterId: sitter.id,
          streetAddress: payload.streetAddress,
          city: payload.city,
          country: payload.country,
          postalCode: payload.postalCode,
        },
      });

      return sitter;
    });

    return ApiResponse.success(
      'Pet sitter profile updated successfully',
      updatedProfile
    );
  }

  async getAllPetSitterProfiles(
    userId: string,
    cursor?: string,
    limit = 20,
    search?: string,
    filter?: PetSitterStatus
  ) {
    limit = Math.min(limit, 50);

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new NotFoundException('User not found');

    const isUserAdmin = user.role === 'ADMIN';

    const where: Prisma.PetSitterProfileWhereInput = {};

    if (filter) {
      where.status = filter;
    }

    if (!isUserAdmin) {
      where.profileStatus = 'ACTIVE';
    }

    if (search) {
      const or: Prisma.PetSitterProfileWhereInput[] = [
        { bio: { contains: search, mode: 'insensitive' } },
        { designations: { contains: search, mode: 'insensitive' } },
        {
          user: {
            fullName: { contains: search, mode: 'insensitive' },
          },
        },
      ];

      where.OR = or;
    }

    // Fetch one extra item for cursor pagination
    let profiles = await this.prisma.petSitterProfile.findMany({
      where,
      take: limit + 1,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        bio: true,
        designations: true,
        languages: true,
        yearsOfExperience: true,
        user: {
          select: {
            fullName: true,
            email: true,
            image: true,
          },
        },
        status: true,
        profileStatus: isUserAdmin,
      },
    });

    // Case-insensitive partial search in languages (post-filter)
    if (search) {
      const lowerSearch = search.toLowerCase();
      profiles = profiles.filter((profile) =>
        profile.languages.some((lang) =>
          lang.toLowerCase().includes(lowerSearch)
        )
      );
    }

    let nextCursor: string | null = null;

    // Handle pagination
    if (profiles.length > limit) {
      const nextItem = profiles.pop();
      nextCursor = nextItem!.id;
    }

    return ApiResponse.success('Pet sitter profiles found', {
      data: profiles,
      nextCursor,
    });
  }

  async getSinglePetSitterProfile(userId: string, petProfileId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new NotFoundException('User not found');

    const isAdmin = user.role === 'ADMIN';

    // Build query conditions
    let where: Prisma.PetSitterProfileWhereInput = { id: petProfileId };

    if (!isAdmin) {
      // Non-admins: can only see their own profile or ACTIVE profiles
      where = {
        id: petProfileId,
        OR: [
          { userId }, // their own profile
          { profileStatus: 'ACTIVE' }, // others only if ACTIVE
        ],
      };
    }

    const profile = await this.prisma.petSitterProfile.findFirst({
      where,
      select: {
        id: true,
        bio: true,
        designations: true,
        languages: true,
        yearsOfExperience: true,
        user: {
          select: {
            fullName: true,
            email: true,
            image: true,
          },
        },
        status: true,
        ...(isAdmin || userId === where.id ? { profileStatus: true } : {}),
      },
    });

    if (!profile)
      throw new NotFoundException(
        'Pet sitter profile not found or access denied'
      );

    return ApiResponse.success('Pet sitter profile found', profile);
  }

  async getMyPetSitterProfile(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new NotFoundException('User not found');

    const profile = await this.prisma.petSitterProfile.findUnique({
      where: { userId },
      select: {
        id: true,
        bio: true,
        designations: true,
        languages: true,
        yearsOfExperience: true,
        status: true,
        profileStatus: true, // always visible to owner
        isVerified: true,
        analytics: true,
        user: {
          select: {
            fullName: true,
            email: true,
            image: true,
            role: true,
            phone: true,
          },
        },

        petSitterAddresses: {
          select: {
            streetAddress: true,
            city: true,
            country: true,
            postalCode: true,
          },
        },
      },
    });

    if (!profile) throw new NotFoundException('Pet sitter profile not found');

    return ApiResponse.success('Pet sitter profile found', profile);
  }

  async changePetSitterStatus(
    userId: string,
    petProfileId: string,
    status: PetSitterStatus
  ) {
    const profile = await this.prisma.petSitterProfile.findUnique({
      where: { id: petProfileId },
    });

    if (!profile) throw new NotFoundException('Pet sitter profile not found');

    if (profile.profileStatus !== 'ACTIVE')
      throw new BadRequestException('Pet sitter profile is not active');

    if (profile.userId !== userId)
      throw new ForbiddenException('Access denied');

    const updatedStatus = await this.prisma.petSitterProfile.update({
      where: { id: petProfileId },
      data: { status },
      select: { id: true, status: true },
    });

    return ApiResponse.success(
      `Pet sitter profile status updated to ${updatedStatus.status} successfully`
    );
  }

  async updatePetSitterProfile(
    userId: string,
    payload: UpdatePetSitterProfileDto
  ) {
    const profile = await this.prisma.petSitterProfile.findUnique({
      where: { userId },
    });

    if (!profile) throw new NotFoundException('Pet sitter profile not found');

    if (profile.profileStatus !== 'ACTIVE')
      throw new BadRequestException('Pet sitter profile is not active');

    // Remove undefined fields from payload
    const cleanPayload: Partial<UpdatePetSitterProfileDto> = {};
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined)
        cleanPayload[key as keyof UpdatePetSitterProfileDto] = value;
    });

    const updatedProfile = await this.prisma.petSitterProfile.update({
      where: { userId },
      data: cleanPayload, // now safe, undefined fields are ignored
      select: {
        id: true,
        bio: true,
        designations: true,
        languages: true,
        yearsOfExperience: true,
        user: {
          select: {
            fullName: true,
            email: true,
            image: true,
          },
        },
        status: true,
        profileStatus: true,
      },
    });

    return ApiResponse.success(
      'Pet sitter profile updated successfully',
      updatedProfile
    );
  }
}
