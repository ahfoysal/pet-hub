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
    payload: AddProductReviewDto,
    userId: string,
    productId: string
  ) {
    // 1️⃣ Check product existence and published status
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || !product.isPublish) {
      throw new NotFoundException('Product not found');
    }

    // 2️⃣ Check user existence and active status
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.status !== 'ACTIVE') {
      throw new ForbiddenException('User is not active');
    }

    // 3️⃣ Check if the user has already reviewed this product
    const existingReview = await this.prisma.productReview.findUnique({
      where: {
        productId_userId: { productId, userId },
      },
    });

    if (existingReview) {
      throw new ForbiddenException('You have already reviewed this product');
    }

    // 5️⃣ Create the review safely with try/catch
    try {
      const review = await this.prisma.productReview.create({
        data: { ...payload, userId, productId },
      });

      return ApiResponse.success('Review added successfully', review);
    } catch (error) {
      // Handle race condition where unique constraint is violated
      if (error.code === 'P2002') {
        throw new ForbiddenException('You have already reviewed this product');
      }
      throw error;
    }
  }
}
