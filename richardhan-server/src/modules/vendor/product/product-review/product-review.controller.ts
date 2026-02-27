import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ProductReviewService } from './product-review.service';
import { AddProductReviewDto, ReplyToReviewDto, FlagReviewDto } from './dto/product-review.dto';
import { CurrentUser } from 'src/common/decorators/get-user.decorator';
import { ApiOperation, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('product-review')
export class ProductReviewController {
  constructor(private readonly productReviewService: ProductReviewService) {}

  @Get('/vendor/stats')
  @ApiOperation({ summary: 'Get vendor review stats' })
  async getVendorReviewStats(@CurrentUser('id') userId: string) {
    return this.productReviewService.getVendorReviewStats(userId);
  }

  @Get('/vendor/all')
  @ApiOperation({ summary: 'Get all reviews for a vendor' })
  async getVendorReviews(@CurrentUser('id') userId: string) {
    return this.productReviewService.getVendorReviews(userId);
  }

  @Post('/reply/:reviewId')
  @ApiOperation({ summary: 'Reply to a product review' })
  @ApiParam({
    name: 'reviewId',
    type: 'string',
    description: 'ID of the review to reply to',
    required: true,
  })
  async replyToReview(
    @Param('reviewId') reviewId: string,
    @Body() dto: ReplyToReviewDto,
    @CurrentUser('id') userId: string
  ) {
    return this.productReviewService.replyToReview(reviewId, userId, dto);
  }

  @Post('/flag/:reviewId')
  @ApiOperation({ summary: 'Flag a product review' })
  @ApiParam({
    name: 'reviewId',
    type: 'string',
    description: 'ID of the review to flag',
    required: true,
  })
  async flagReview(
    @Param('reviewId') reviewId: string,
    @Body() dto: FlagReviewDto,
    @CurrentUser('id') userId: string
  ) {
    return this.productReviewService.flagReview(reviewId, userId, dto);
  }

  @Post(':productId')
  @ApiOperation({ summary: 'Add a review for a product' })
  @ApiParam({
    name: 'productId',
    type: 'string',
    description: 'ID of the product to review',
    required: true,
  })
  async addProductReview(
    @Body() payload: AddProductReviewDto,
    @Param('productId') productId: string,
    @CurrentUser('id') userId: string
  ) {
    return await this.productReviewService.addProductReview(
      payload,
      userId,
      productId
    );
  }
}
