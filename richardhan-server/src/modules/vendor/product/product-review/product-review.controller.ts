import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ProductReviewService } from './product-review.service';
import { AddProductReviewDto } from './dto/product-review.dto';
import { CurrentUser } from 'src/common/decorators/get-user.decorator';
import { ApiOperation, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('product-review')
export class ProductReviewController {
  constructor(private readonly productReviewService: ProductReviewService) {}

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
    return this.productReviewService.addProductReview(
      payload,
      userId,
      productId
    );
  }
}
