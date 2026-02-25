import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import {
  CreateServiceReviewDto,
  UpdateReviewDto,
} from './dto/service-review.dto';
import { ApiResponse } from 'src/common/response/api-response';

@Injectable()
export class ServiceReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async addReview(
    payload: CreateServiceReviewDto,
    userId: string,
    serviceId: string
  ) {
    // Validate user
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (user.status !== 'ACTIVE')
      throw new ForbiddenException('User is not active');

    // Validate service
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
      select: {
        isDeleted: true, // fetch the actual field
        petSitterProfile: { select: { userId: true } },
      },
    });

    if (!service || service.isDeleted)
      throw new NotFoundException('Service not found');

    // Prevent reviewing own service
    if (service.petSitterProfile.userId === userId)
      throw new ForbiddenException(
        'You are not allowed to review your own service'
      );

    // Check for existing review
    const existingReview = await this.prisma.serviceReview.findFirst({
      where: { serviceId, userId, isDeleted: false },
    });

    if (existingReview)
      throw new BadRequestException('You have already reviewed this service');

    // Create review
    const review = await this.prisma.serviceReview.create({
      data: { ...payload, userId, serviceId },
    });

    return ApiResponse.success('Review added successfully', review);
  }

  async getAllReviews(serviceId: string, cursorId?: string, limit = 10) {
    // Cap limit
    limit = Math.min(limit, 50);

    // Fetch total, average rating, rating breakdown, and reviews in parallel
    const [totalReviews, averageRatingData, ratingCounts, reviews] =
      await Promise.all([
        this.prisma.serviceReview.count({
          where: { serviceId, isDeleted: false },
        }),
        this.prisma.serviceReview.aggregate({
          where: { serviceId, isDeleted: false },
          _avg: { rating: true },
        }),
        this.prisma.serviceReview.groupBy({
          by: ['rating'],
          where: { serviceId, isDeleted: false },
          _count: { rating: true },
        }),
        this.prisma.serviceReview.findMany({
          where: { serviceId, isDeleted: false },
          take: limit,
          ...(cursorId && { cursor: { id: cursorId }, skip: 1 }),
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                fullName: true,
                image: true,
              },
            },
          },
        }),
      ]);

    // Build rating breakdown
    const ratingBreakdown: Record<number, number> = [1, 2, 3, 4, 5].reduce(
      (acc, r) => ({ ...acc, [r]: 0 }),
      {} as Record<number, number>
    );
    ratingCounts.forEach((r) => {
      ratingBreakdown[r.rating] = r._count.rating;
    });

    return ApiResponse.success('Reviews fetched successfully', {
      total: totalReviews,
      averageRating: averageRatingData._avg.rating ?? 0,
      ratingBreakdown,
      reviews,
    });
  }

  async getAllReviewByPetSitterId(
    petSitterId: string,
    cursorId?: string,
    limit = 10
  ) {
    // Cap limit
    limit = Math.min(limit, 50);

    // Verify pet sitter exists and is active
    const petSitter = await this.prisma.petSitterProfile.findUnique({
      where: { id: petSitterId },
    });

    if (!petSitter || petSitter.profileStatus !== 'ACTIVE') {
      throw new BadRequestException('Pet sitter profile not found or inactive');
    }

    // Fetch reviews, total count, average rating, and rating breakdown in parallel
    const [totalReviews, averageRatingData, ratingCounts, reviews] =
      await Promise.all([
        this.prisma.serviceReview.count({
          where: {
            service: { petSitterId },
            isDeleted: false,
          },
        }),
        this.prisma.serviceReview.aggregate({
          where: {
            service: { petSitterId },
            isDeleted: false,
          },
          _avg: { rating: true },
        }),
        this.prisma.serviceReview.groupBy({
          by: ['rating'],
          where: {
            service: { petSitterId },
            isDeleted: false,
          },
          _count: { rating: true },
        }),
        this.prisma.serviceReview.findMany({
          where: {
            service: { petSitterId },
            isDeleted: false,
          },
          take: limit,
          ...(cursorId && { cursor: { id: cursorId }, skip: 1 }),
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                fullName: true,
                image: true,
              },
            },
            service: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        }),
      ]);

    // Build rating breakdown object
    const ratingBreakdown: Record<number, number> = [1, 2, 3, 4, 5].reduce(
      (acc, r) => ({ ...acc, [r]: 0 }),
      {} as Record<number, number>
    );
    ratingCounts.forEach((r) => {
      ratingBreakdown[r.rating] = r._count.rating;
    });

    return ApiResponse.success('Pet sitter reviews fetched successfully', {
      total: totalReviews,
      averageRating: averageRatingData._avg.rating ?? 0,
      ratingBreakdown,
      reviews,
    });
  }

  async getMyReceivedReviews(userId: string, cursorId?: string, limit = 10) {
    limit = Math.min(limit, 50);

    // Verify pet sitter profile
    const petSitter = await this.prisma.petSitterProfile.findUnique({
      where: { userId },
    });

    if (!petSitter || petSitter.profileStatus !== 'ACTIVE') {
      throw new BadRequestException('Pet sitter profile not found or inactive');
    }

    // Fetch review stats and paginated reviews in parallel
    const [totalReviews, averageRatingData, ratingCounts, reviews] =
      await Promise.all([
        this.prisma.serviceReview.count({
          where: { service: { petSitterId: petSitter.id }, isDeleted: false },
        }),
        this.prisma.serviceReview.aggregate({
          where: { service: { petSitterId: petSitter.id }, isDeleted: false },
          _avg: { rating: true },
        }),
        this.prisma.serviceReview.groupBy({
          by: ['rating'],
          where: { service: { petSitterId: petSitter.id }, isDeleted: false },
          _count: { rating: true },
        }),
        this.prisma.serviceReview.findMany({
          where: { service: { petSitterId: petSitter.id }, isDeleted: false },
          take: limit,
          ...(cursorId && { cursor: { id: cursorId }, skip: 1 }),
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            updatedAt: true,
            user: { select: { id: true, fullName: true, image: true } },
            service: {
              select: {
                id: true,
                name: true,
                price: true,
                thumbnailImage: true,
              },
            },
          },
        }),
      ]);

    // Build rating breakdown
    const ratingBreakdown: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };
    ratingCounts.forEach((r) => {
      ratingBreakdown[r.rating] = r._count.rating;
    });

    const averageRating = Number(
      (averageRatingData._avg.rating ?? 0).toFixed(1)
    );

    return ApiResponse.success('Received reviews fetched successfully', {
      total: totalReviews,
      averageRating,
      ratingBreakdown,
      reviews,
    });
  }

  async getSubmittedReviews(userId: string, cursorId?: string, limit = 10) {
    // Cap limit
    limit = Math.min(limit, 50);

    // Fetch review stats and paginated reviews in parallel
    const [totalReviews, averageRatingData, ratingCounts, reviews] =
      await Promise.all([
        // Total reviews by this user
        this.prisma.serviceReview.count({
          where: { userId, isDeleted: false },
        }),
        // Average rating of reviews by this user
        this.prisma.serviceReview.aggregate({
          where: { userId, isDeleted: false },
          _avg: { rating: true },
        }),
        // Rating breakdown
        this.prisma.serviceReview.groupBy({
          by: ['rating'],
          where: { userId, isDeleted: false },
          _count: { rating: true },
        }),
        // Paginated reviews
        this.prisma.serviceReview.findMany({
          where: { userId, isDeleted: false },
          take: limit,
          ...(cursorId && { cursor: { id: cursorId }, skip: 1 }),
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            updatedAt: true,
            user: {
              select: { id: true, fullName: true, image: true },
            },
            service: {
              select: {
                id: true,
                name: true,
                price: true,
                thumbnailImage: true,
                petSitterProfile: {
                  select: {
                    userId: true,
                    status: true,
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
            },
          },
        }),
      ]);

    // Build rating breakdown object
    const ratingBreakdown: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };
    ratingCounts.forEach((r) => {
      ratingBreakdown[r.rating] = r._count.rating;
    });

    const averageRating = Number(
      (averageRatingData._avg.rating ?? 0).toFixed(1)
    );

    return ApiResponse.success('User reviews fetched successfully', {
      total: totalReviews,
      averageRating,
      ratingBreakdown,
      reviews,
    });
  }

  async getReviewById(reviewId: string) {
    const review = await this.prisma.serviceReview.findUnique({
      where: { id: reviewId },
      select: {
        id: true,
        rating: true,
        comment: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            fullName: true,
            image: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            price: true,
            thumbnailImage: true,
            petSitterProfile: {
              select: {
                userId: true,
                status: true,
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
        },
      },
    });

    if (!review || review.isDeleted) {
      throw new NotFoundException('Review not found or deleted');
    }

    return ApiResponse.success('Review fetched successfully', { review });
  }

  async deleteReview(reviewId: string, userId: string) {
    // Find review and check soft-delete status
    const review = await this.prisma.serviceReview.findUnique({
      where: { id: reviewId },
      select: { userId: true, isDeleted: true },
    });

    if (!review || review.isDeleted) {
      throw new NotFoundException('Review not found or already deleted');
    }

    // Ensure the user owns the review
    if (review.userId !== userId) {
      throw new ForbiddenException('You are not allowed to delete this review');
    }

    // Perform soft delete
    await this.prisma.serviceReview.update({
      where: { id: reviewId },
      data: { isDeleted: true },
    });

    return ApiResponse.success('Review deleted successfully');
  }

  async updateReview(reviewId: string, userId: string, dto: UpdateReviewDto) {
    // Find review and check soft-delete status
    const review = await this.prisma.serviceReview.findUnique({
      where: { id: reviewId },
      select: { userId: true, isDeleted: true },
    });

    if (!review || review.isDeleted) {
      throw new NotFoundException('Review not found or already deleted');
    }

    // Ensure the user owns the review
    if (review.userId !== userId) {
      throw new ForbiddenException('You are not allowed to update this review');
    }

    // Remove undefined fields from dto to avoid overwriting with null/undefined
    const updateData = Object.fromEntries(
      Object.entries(dto).filter(([, value]) => value !== undefined)
    );

    if (Object.keys(updateData).length === 0) {
      return ApiResponse.success('No changes applied');
    }

    // Update review
    await this.prisma.serviceReview.update({
      where: { id: reviewId },
      data: updateData,
    });

    return ApiResponse.success('Review updated successfully');
  }
}
