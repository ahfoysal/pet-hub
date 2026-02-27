import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { AddProductReviewDto } from './dto/product-review.dto';
import { ApiResponse } from 'src/common/response/api-response';

@Injectable()
export class ProductReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async addProductReview(
    dto: AddProductReviewDto,
    userId: string,
    productId: string,
  ) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const existingReview = await this.prisma.productReview.findUnique({
      where: {
        productId_userId: {
          productId,
          userId,
        },
      },
    });

    if (existingReview) {
      throw new BadRequestException('You have already reviewed this product');
    }

    const review = await this.prisma.productReview.create({
      data: {
        rating: dto.rating,
        review: dto.review,
        productId,
        userId,
      },
    });

    return ApiResponse.success('Review added successfully', review);
  }

  async getVendorReviews(userId: string) {
    const vendor = await this.prisma.vendorProfile.findUnique({
      where: { userId },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor profile not found');
    }

    const reviews = await this.prisma.productReview.findMany({
      where: {
        product: {
          vendorId: vendor.id,
        },
      },
      include: {
        user: {
          select: {
            fullName: true,
            image: true,
            userName: true,
          },
        },
        product: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return ApiResponse.success('Vendor reviews fetched successfully', reviews);
  }

  async getVendorReviewStats(userId: string) {
    const vendor = await this.prisma.vendorProfile.findUnique({
      where: { userId },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor profile not found');
    }

    const reviews = await this.prisma.productReview.findMany({
      where: {
        product: {
          vendorId: vendor.id,
        },
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

    return ApiResponse.success('Vendor review stats fetched successfully', {
      totalReviews,
      pendingReviews,
      repliedReviews,
      flaggedReviews,
      avgRating: avgRating.toFixed(1),
    });
  }

  async replyToReview(
    reviewId: string,
    userId: string,
    dto: { reply: string }
  ) {
    const review = await this.prisma.productReview.findUnique({
      where: { id: reviewId },
      include: {
        product: true,
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    const vendor = await this.prisma.vendorProfile.findUnique({
      where: { userId },
    });

    if (!vendor || review.product.vendorId !== vendor.id) {
      throw new ForbiddenException(
        'You are not authorized to reply to this review'
      );
    }

    const updatedReview = await this.prisma.productReview.update({
      where: { id: reviewId },
      data: {
        reply: dto.reply,
        repliedAt: new Date(),
      },
    });

    return ApiResponse.success('Reply submitted successfully', updatedReview);
  }

  async flagReview(reviewId: string, userId: string, dto: { reason: string }) {
    const review = await this.prisma.productReview.findUnique({
      where: { id: reviewId },
      include: {
        product: true,
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    const vendor = await this.prisma.vendorProfile.findUnique({
      where: { userId },
    });

    if (!vendor || review.product.vendorId !== vendor.id) {
      throw new ForbiddenException(
        'You are not authorized to flag this review'
      );
    }

    const updatedReview = await this.prisma.productReview.update({
      where: { id: reviewId },
      data: {
        isFlagged: true,
        flaggedReason: dto.reason,
      },
    });

    return ApiResponse.success('Review flagged successfully', updatedReview);
  }
}
