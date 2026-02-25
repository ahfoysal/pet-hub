import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import {
  CreatePetSitterPackageReviewDto,
  UpdatePetSitterPackageReviewDto,
} from './dto/pet-sitter-package-review.dto';
import { ApiResponse } from 'src/common/response/api-response';

@Injectable()
export class PetSitterPackageReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async addPackageReview(
    userId: string,
    packageId: string,
    payload: CreatePetSitterPackageReviewDto
  ) {
    /**
     * Validate user
     */
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, status: true },
    });

    if (!user) {
      throw new NotFoundException('User account not found.');
    }

    if (user.status !== 'ACTIVE') {
      throw new ForbiddenException(
        'Your account is inactive. You cannot submit a review.'
      );
    }

    /**
     * Validate package
     */
    const pkg = await this.prisma.package.findFirst({
      where: { id: packageId, isDeleted: false },
      select: { id: true, petSitterId: true },
    });

    if (!pkg) {
      throw new NotFoundException('Package not found or no longer available.');
    }

    /**
     * Prevent self-review (FIXED)
     */
    const petSitter = await this.prisma.petSitterProfile.findUnique({
      where: { id: pkg.petSitterId },
      select: { userId: true },
    });

    if (petSitter?.userId === userId) {
      throw new ForbiddenException('You cannot review your own package.');
    }

    /**
     * Block duplicate ACTIVE reviews only
     */
    const existingReview = await this.prisma.petSitterPackageReview.findFirst({
      where: {
        packageId,
        userId,
        isDeleted: false,
      },
    });

    if (existingReview) {
      throw new ConflictException(
        'You have already submitted a review for this package.'
      );
    }

    /**
     * Create review
     */
    await this.prisma.petSitterPackageReview.create({
      data: {
        packageId,
        userId,
        ...payload,
      },
    });

    return ApiResponse.success('Review submitted successfully.');
  }

  async updatePackageReview(
    userId: string,
    reviewId: string,
    payload: UpdatePetSitterPackageReviewDto
  ) {
    const review = await this.prisma.petSitterPackageReview.findUnique({
      where: { id: reviewId },
    });

    if (!review || review.isDeleted)
      throw new NotFoundException('Review not found');

    if (review.userId !== userId)
      throw new ForbiddenException('You are not allowed to update this review');

    const updateData = Object.fromEntries(
      Object.entries(payload).filter(([, value]) => value !== undefined)
    );

    if (!Object.keys(updateData).length) {
      throw new BadRequestException('No data provided to update');
    }

    await this.prisma.petSitterPackageReview.update({
      where: { id: reviewId },
      data: updateData,
    });

    return ApiResponse.success('Review updated successfully');
  }

  async deletePackageReview(userId: string, reviewId: string) {
    // Find review that is not deleted
    const review = await this.prisma.petSitterPackageReview.findFirst({
      where: {
        id: reviewId,
        isDeleted: false,
      },
    });

    // If not found, return not found
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    // Check if the current user owns the review
    if (review.userId !== userId) {
      throw new ForbiddenException('You are not allowed to delete this review');
    }

    // Soft-delete the review
    await this.prisma.petSitterPackageReview.update({
      where: { id: reviewId },
      data: { isDeleted: true },
    });

    return ApiResponse.success('Review deleted successfully');
  }

  async getReviewsForPackage(packageId: string, cursor?: string, limit = 20) {
    const take = Math.min(limit, 50);

    const reviews = await this.prisma.petSitterPackageReview.findMany({
      where: {
        packageId,
        isDeleted: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      take: take + 1,
      select: {
        id: true,
        comment: true,
        rating: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            fullName: true,
            image: true,
          },
        },
      },
    });

    let nextCursor: string | null = null;

    if (reviews.length > take) {
      const nextItem = reviews.pop();
      nextCursor = nextItem!.id;
    }

    // Rating breakdown (1–5)
    const ratingBreakdownRaw = await this.prisma.petSitterPackageReview.groupBy(
      {
        by: ['rating'],
        where: {
          packageId,
          isDeleted: false,
        },
        _count: {
          rating: true,
        },
      }
    );

    const ratingBreakdown = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    for (const item of ratingBreakdownRaw) {
      ratingBreakdown[item.rating] = item._count.rating;
    }

    // Average rating
    const averageRatingResult =
      await this.prisma.petSitterPackageReview.aggregate({
        where: {
          packageId,
          isDeleted: false,
        },
        _avg: {
          rating: true,
        },
        _count: {
          rating: true,
        },
      });

    const averageRating = averageRatingResult._avg.rating ?? 0;

    const totalReviews = averageRatingResult._count.rating;

    return ApiResponse.success('Reviews found', {
      reviews,
      pagination: {
        limit: take,
        nextCursor,
      },
      ratingBreakdown,
      averageRating: Number(averageRating.toFixed(1)),
      totalReviews,
    });
  }

  async getSingleReview(reviewId: string) {
    const review = await this.prisma.petSitterPackageReview.findFirst({
      where: {
        id: reviewId,
        isDeleted: false,
      },
      select: {
        id: true,
        comment: true,
        rating: true,
        createdAt: true,
        package: {
          select: {
            id: true,
            name: true,
            image: true,
            offeredPrice: true,
          },
        },
        user: {
          select: {
            id: true,
            fullName: true,
            image: true,
          },
        },
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return ApiResponse.success('Review found', review);
  }

  async getMySubmittedReviews(userId: string, cursor?: string, limit = 20) {
    const take = Math.min(limit, 50);

    const reviews = await this.prisma.petSitterPackageReview.findMany({
      where: {
        userId,
        isDeleted: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      take: take + 1,
      select: {
        id: true,
        comment: true,
        rating: true,
        createdAt: true,
        package: {
          select: {
            id: true,
            name: true,
            image: true,
            offeredPrice: true,
          },
        },
      },
    });

    let nextCursor: string | null = null;

    if (reviews.length > take) {
      const nextItem = reviews.pop();
      nextCursor = nextItem!.id;
    }

    return ApiResponse.success('Reviews found', {
      reviews,
      pagination: {
        limit: take,
        nextCursor,
      },
    });
  }

  async getMyReceivedReviews(userId: string, cursor?: string, limit = 20) {
    const take = Math.min(limit, 50);

    // Fetch reviews with cursor pagination
    const reviews = await this.prisma.petSitterPackageReview.findMany({
      where: {
        package: {
          petSitter: {
            userId,
          },
        },
        isDeleted: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      take: take + 1,
      select: {
        id: true,
        comment: true,
        rating: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            fullName: true,
            image: true,
          },
        },
        package: {
          select: {
            id: true,
            name: true,
            image: true,
            offeredPrice: true,
          },
        },
      },
    });

    let nextCursor: string | null = null;
    if (reviews.length > take) {
      const nextItem = reviews.pop();
      nextCursor = nextItem!.id;
    }

    // Rating breakdown (1–5 stars)
    const ratingBreakdownRaw = await this.prisma.petSitterPackageReview.groupBy(
      {
        by: ['rating'],
        where: {
          package: {
            petSitter: {
              userId,
            },
          },
          isDeleted: false,
        },
        _count: {
          rating: true,
        },
      }
    );

    const ratingBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const item of ratingBreakdownRaw) {
      ratingBreakdown[item.rating] = item._count.rating;
    }

    // Average rating
    const averageRatingResult =
      await this.prisma.petSitterPackageReview.aggregate({
        where: {
          package: {
            petSitter: {
              userId,
            },
          },
          isDeleted: false,
        },
        _avg: { rating: true },
        _count: { rating: true },
      });

    const averageRating = averageRatingResult._avg.rating ?? 0;
    const totalReviews = averageRatingResult._count.rating;

    return ApiResponse.success('Reviews found', {
      reviews,
      pagination: { limit: take, nextCursor },
      ratingBreakdown,
      averageRating: Number(averageRating.toFixed(1)),
      totalReviews,
    });
  }
}
