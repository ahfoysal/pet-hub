import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ReviewTargetType } from '@prisma/client';
import { ApiResponse } from 'src/common/response/api-response';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { ReplyToReviewDto } from './dto/hotel-review.dto';

@Injectable()
export class HotelReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(hotelProfileId: string) {
    const reviews = await this.prisma.review.findMany({
      where: {
        profileId: hotelProfileId,
        profileType: ReviewTargetType.HOTEL,
      },
    });

    const totalReviews = reviews.length;
    const pendingReviews = reviews.filter((r) => !r.reply && !r.isFlagged).length;
    const repliedReviews = reviews.filter((r) => !!r.reply).length;
    const flaggedReviews = reviews.filter((r) => r.isFlagged).length;
    const avgRating =
      totalReviews > 0
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews
        : 0;

    return ApiResponse.success('Hotel review stats fetched successfully', {
      totalReviews,
      pendingReviews,
      repliedReviews,
      flaggedReviews,
      avgRating: parseFloat(avgRating.toFixed(1)),
    });
  }

  async getReviews(hotelProfileId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: {
          profileId: hotelProfileId,
          profileType: ReviewTargetType.HOTEL,
        },
        include: {
          reviewer: {
            select: {
              fullName: true,
              image: true,
              userName: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.review.count({
        where: {
          profileId: hotelProfileId,
          profileType: ReviewTargetType.HOTEL,
        },
      }),
    ]);

    return ApiResponse.success('Hotel reviews fetched successfully', {
      data: reviews,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  }

  async reply(reviewId: string, hotelProfileId: string, dto: ReplyToReviewDto) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.profileId !== hotelProfileId || review.profileType !== ReviewTargetType.HOTEL) {
      throw new ForbiddenException('You are not authorized to reply to this review');
    }

    const updatedReview = await this.prisma.review.update({
      where: { id: reviewId },
      data: {
        reply: dto.reply,
        repliedAt: new Date(),
      },
    });

    return ApiResponse.success('Reply submitted successfully', updatedReview);
  }
}
