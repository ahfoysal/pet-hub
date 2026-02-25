import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { ApiResponse } from 'src/common/response/api-response';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import {
  CreatePetSitterReviewDto,
  UpdatePetSitterReviewDto,
} from './dto/pet-sitter-review.dto';
import { Role } from 'src/common/types/auth.types';

@Injectable()
export class PetSitterReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async addReview(
    payload: CreatePetSitterReviewDto,
    userId: string,
    petSitterId: string
  ) {
    // Validate pet owner
    const petOwner = await this.prisma.petOwnerProfile.findUnique({
      where: { userId },
      include: { user: true },
    });

    if (!petOwner) {
      throw new NotFoundException(
        'Only registered pet owners can leave reviews.'
      );
    }

    if (petOwner.user.status !== 'ACTIVE') {
      throw new ForbiddenException(
        'Your account is inactive. Please contact support to activate it.'
      );
    }

    // Validate pet sitter
    const petSitter = await this.prisma.petSitterProfile.findUnique({
      where: { id: petSitterId },
    });

    if (!petSitter || petSitter.profileStatus !== 'ACTIVE') {
      throw new NotFoundException(
        'The pet sitter is not available or currently inactive.'
      );
    }

    // Prevent duplicate reviews
    const existingReview = await this.prisma.petSitterReview.findFirst({
      where: { userId: petOwner.userId, petSitterId, isDeleted: false },
    });

    if (existingReview) {
      throw new ConflictException(
        'You have already submitted a review for this pet sitter.'
      );
    }

    // Create review
    const review = await this.prisma.petSitterReview.create({
      data: {
        userId: petOwner.userId,
        petSitterId,
        rating: payload.rating,
        comment: payload.comment,
      },
      select: {
        id: true,
        rating: true,
        comment: true,
      },
    });

    return ApiResponse.success(
      'Your review has been successfully submitted.',
      review
    );
  }

  async updateReview(
    reviewId: string,
    userId: string,
    dto: UpdatePetSitterReviewDto
  ) {
    // Find review and check soft-delete status
    const review = await this.prisma.petSitterReview.findUnique({
      where: { id: reviewId },
      select: { userId: true, isDeleted: true },
    });

    if (!review || review.isDeleted) {
      throw new NotFoundException(
        'The review does not exist or has been deleted.'
      );
    }

    // Ensure the user owns the review
    if (review.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this review.'
      );
    }

    // Remove undefined fields from dto to avoid overwriting with null/undefined
    const updateData = Object.fromEntries(
      Object.entries(dto).filter(([, value]) => value !== undefined)
    );

    if (Object.keys(updateData).length === 0) {
      return ApiResponse.success('No changes were applied to your review.');
    }

    // Update review
    await this.prisma.petSitterReview.update({
      where: { id: reviewId },
      data: updateData,
    });

    return ApiResponse.success('Your review has been successfully updated.');
  }

  async deleteReview(reviewId: string, userId: string) {
    // Find the review and check soft-delete status
    const review = await this.prisma.petSitterReview.findUnique({
      where: { id: reviewId },
      select: { userId: true, isDeleted: true },
    });

    console.log(
      '🚀 ~ pet-sitter-review.service.ts:135 ~ PetSitterReviewService ~ deleteReview ~ review:',
      review
    );

    if (!review || review.isDeleted) {
      throw new NotFoundException(
        'The review does not exist or has already been deleted.'
      );
    }

    // Ensure the user owns the review
    if (review.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this review.'
      );
    }

    // Perform soft delete
    await this.prisma.petSitterReview.update({
      where: { id: reviewId },
      data: { isDeleted: true },
    });

    return ApiResponse.success('Your review has been successfully deleted.');
  }

  async getReviewsByPetSitterId(
    petSitterId: string,
    cursor?: string,
    limit = 10
  ) {
    limit = Math.min(limit, 50);

    // Check if pet sitter exists and is active
    const petSitter = await this.prisma.petSitterProfile.findUnique({
      where: { id: petSitterId },
      select: { id: true, profileStatus: true },
    });

    if (!petSitter || petSitter.profileStatus !== 'ACTIVE') {
      throw new NotFoundException('Pet sitter not found or not active.');
    }

    // Fetch reviews (paginated, soft-delete aware)
    const reviews = await this.prisma.petSitterReview.findMany({
      where: { petSitterId, isDeleted: false },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      include: { user: { select: { id: true, fullName: true, image: true } } },
    });

    // Next cursor for pagination
    const nextCursor =
      reviews.length === limit ? reviews[reviews.length - 1].id : null;

    // Compute rating breakdown and average
    const ratingStats = await this.prisma.petSitterReview.groupBy({
      by: ['rating'],
      where: { petSitterId, isDeleted: false },
      _count: { rating: true },
      _avg: { rating: true },
    });

    const totalReviews = await this.prisma.petSitterReview.count({
      where: { petSitterId, isDeleted: false },
    });

    // Format breakdown as {1: count, 2: count, ...}
    const breakdown: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratingStats.forEach((stat) => {
      breakdown[stat.rating] = stat._count.rating;
    });

    // Compute average rating safely (handle null _avg)
    const totalRatingSum = ratingStats.reduce(
      (acc, stat) => acc + (stat._avg.rating ?? 0) * stat._count.rating,
      0
    );
    const averageRating = totalReviews
      ? parseFloat((totalRatingSum / totalReviews).toFixed(2))
      : 0;

    return ApiResponse.success('Reviews fetched successfully', {
      reviews,
      nextCursor,
      ratingBreakdown: breakdown,
      averageRating,
      total: totalReviews,
    });
  }

  async getSingleReview(reviewId: string) {
    const review = await this.prisma.petSitterReview.findFirst({
      where: { id: reviewId, isDeleted: false },
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
        petSitter: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                fullName: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found or has been deleted.');
    }

    return ApiResponse.success('Review fetched successfully', review);
  }

  async getMySubmittedReviews(userId: string, cursor?: string, limit = 20) {
    limit = Math.min(limit, 50);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        image: true,
        role: true,
        status: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User account not found.');
    }

    if (user.status !== 'ACTIVE') {
      throw new NotFoundException(
        'Your account is inactive. Please contact support for assistance.'
      );
    }

    if (user.role !== Role.PET_OWNER) {
      throw new NotFoundException(
        'Only pet owners can view submitted reviews.'
      );
    }

    const reviews = await this.prisma.petSitterReview.findMany({
      where: {
        userId,
        isDeleted: false,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      select: {
        id: true,
        comment: true,
        rating: true,
        createdAt: true,
        petSitter: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                fullName: true,
                image: true,
              },
            },
          },
        },
      },
    });

    const nextCursor =
      reviews.length === limit ? reviews[reviews.length - 1].id : null;

    return ApiResponse.success('Submitted reviews fetched successfully.', {
      reviews,
      nextCursor,
    });
  }

  async getMyReceivedReviews(userId: string, cursor?: string, limit = 20) {
    limit = Math.min(limit, 50);

    /**
     * Validate pet sitter profile
     */
    const petSitter = await this.prisma.petSitterProfile.findUnique({
      where: { userId },
    });

    if (!petSitter) {
      throw new NotFoundException('You do not have a pet sitter profile.');
    }

    if (petSitter.profileStatus !== 'ACTIVE') {
      throw new NotFoundException('Your pet sitter profile is not active.');
    }

    /**
     * Fetch paginated reviews
     */
    const reviews = await this.prisma.petSitterReview.findMany({
      where: {
        petSitterId: petSitter.id,
        isDeleted: false,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
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

    const nextCursor =
      reviews.length === limit ? reviews[reviews.length - 1].id : null;

    /**
     * Total reviews count
     */
    const total = await this.prisma.petSitterReview.count({
      where: {
        petSitterId: petSitter.id, // ✅ FIXED
        isDeleted: false,
      },
    });

    /**
     * Rating breakdown + average
     */
    const stats = await this.prisma.petSitterReview.groupBy({
      by: ['rating'],
      where: {
        petSitterId: petSitter.id, // ✅ FIXED
        isDeleted: false,
      },
      _count: { rating: true },
    });

    const breakdown: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    let ratingSum = 0;

    stats.forEach((stat) => {
      breakdown[stat.rating] = stat._count.rating;
      ratingSum += stat.rating * stat._count.rating;
    });

    const averageRating =
      total > 0 ? Number((ratingSum / total).toFixed(2)) : 0;

    return ApiResponse.success('Received reviews fetched successfully.', {
      reviews,
      nextCursor,
      total,
      averageRating,
      ratingBreakdown: breakdown,
    });
  }
}
