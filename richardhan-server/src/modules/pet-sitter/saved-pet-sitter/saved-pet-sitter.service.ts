import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ApiResponse } from 'src/common/response/api-response';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class SavedPetSitterService {
  constructor(private readonly prisma: PrismaService) {}

  async toggleSavePetSitter(petSitterId: string, userId: string) {
    const petOwner = await this.prisma.petOwnerProfile.findUnique({
      where: { userId },
    });

    if (!petOwner) {
      throw new NotFoundException('Pet owner not found');
    }

    const petSitter = await this.prisma.petSitterProfile.findUnique({
      where: { id: petSitterId },
    });

    if (!petSitter) {
      throw new NotFoundException('Pet sitter not found');
    }

    const isSaved = await this.prisma.$transaction(async (tx) => {
      const existing = await tx.savedPetSitter.findUnique({
        where: {
          petSitterId_petOwnerId: {
            petSitterId,
            petOwnerId: petOwner.id,
          },
        },
      });

      if (existing) {
        await tx.savedPetSitter.delete({
          where: {
            petSitterId_petOwnerId: {
              petSitterId,
              petOwnerId: petOwner.id,
            },
          },
        });
        return false;
      } else {
        await tx.savedPetSitter.create({
          data: {
            petSitter: { connect: { id: petSitter.id } },
            petOwner: { connect: { id: petOwner.id } },
          },
        });
        return true;
      }
    });

    return ApiResponse.success(
      isSaved
        ? 'Pet sitter saved successfully'
        : 'Pet sitter removed from saved',
      {
        saved: isSaved,
      }
    );
  }

  async getMySavedPetSitters(
    userId: string,
    cursorId?: string,
    limit = 20,
    search?: string
  ) {
    // enforce max limit
    limit = Math.min(limit, 50);

    // get pet owner
    const petOwner = await this.prisma.petOwnerProfile.findUnique({
      where: { userId },
    });

    if (!petOwner) {
      throw new NotFoundException('Pet owner not found');
    }

    // build query filters
    const where: Prisma.SavedPetSitterWhereInput = {
      petOwnerId: petOwner.id,
    };

    if (search) {
      where.OR = [
        {
          petSitter: {
            user: { fullName: { contains: search, mode: 'insensitive' } },
          },
        },
        { petSitter: { bio: { contains: search, mode: 'insensitive' } } },
        {
          petSitter: {
            designations: { contains: search, mode: 'insensitive' },
          },
        },
        { petSitter: { languages: { has: search } } },
      ];
    }

    // fetch saved pet sitters
    const savedSitters = await this.prisma.savedPetSitter.findMany({
      where,
      take: limit + 1, // for nextCursor
      cursor: cursorId ? { id: cursorId } : undefined,
      skip: cursorId ? 1 : 0,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, // savedPetSitter id
        createdAt: true,
        petSitter: {
          select: {
            id: true,
            userId: true,
            bio: true,
            status: true,
            yearsOfExperience: true,
            languages: true,
            designations: true,
            user: { select: { fullName: true, image: true } },
          },
        },
      },
    });

    // next cursor
    let nextCursor: string | null = null;
    if (savedSitters.length > limit) {
      const nextItem = savedSitters.pop();
      nextCursor = nextItem!.id;
    }

    const sitterIds = savedSitters.map((s) => s.petSitter.id);

    // fetch total reviews and average ratings using aggregate
    const ratingsData = await this.prisma.service.findMany({
      where: { petSitterId: { in: sitterIds } },
      select: {
        petSitterId: true,
        serviceReviews: {
          where: { isDeleted: false },
          select: { rating: true },
        },
      },
    });

    // map sitterId -> { totalReviews, avgRating }
    const ratingsMap = new Map<
      string,
      { totalReviews: number; avgRating: number }
    >();
    for (const service of ratingsData) {
      const existing = ratingsMap.get(service.petSitterId) || {
        totalReviews: 0,
        avgRating: 0,
      };
      const ratings = service.serviceReviews.map((r) => r.rating);
      const totalReviews = existing.totalReviews + ratings.length;
      const sumRatings =
        existing.avgRating * existing.totalReviews +
        ratings.reduce((a, b) => a + b, 0);
      const avgRating = totalReviews > 0 ? sumRatings / totalReviews : 0;
      ratingsMap.set(service.petSitterId, { totalReviews, avgRating });
    }

    // flatten response
    const data = savedSitters.map((s) => {
      const ratingInfo = ratingsMap.get(s.petSitter.id) || {
        totalReviews: 0,
        avgRating: 0,
      };
      return {
        id: s.petSitter.id,
        userId: s.petSitter.userId,
        fullName: s.petSitter.user.fullName,
        image: s.petSitter.user.image,
        bio: s.petSitter.bio,
        status: s.petSitter.status,
        yearsOfExperience: s.petSitter.yearsOfExperience,
        languages: s.petSitter.languages,
        designations: s.petSitter.designations,
        totalReviews: ratingInfo.totalReviews,
        avgRating: ratingInfo.avgRating,
      };
    });

    return { data, nextCursor };
  }
}
