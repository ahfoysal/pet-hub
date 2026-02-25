import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ServiceReviewService } from './service-review.service';
import { CreateServiceReviewDto } from './dto/service-review.dto';
import { CurrentUser } from 'src/common/decorators/get-user.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@UseGuards(AuthGuard)
@ApiTags('Pet Sitter - Service Review')
@Controller('service-review')
export class ServiceReviewController {
  constructor(private readonly serviceReviewService: ServiceReviewService) {}

  @Post(':serviceId')
  @ApiOperation({
    summary:
      '[APP] Add a review for a pet sitter service by pet owner, Role: Pet Owner',
  })
  @ApiParam({
    name: 'serviceId',
    type: 'string',
    description: 'The ID of the pet sitter service to review',
  })
  @ApiBody({ type: CreateServiceReviewDto, description: 'Review payload' })
  addReview(
    @Body() payload: CreateServiceReviewDto,
    @Param('serviceId') serviceId: string,
    @CurrentUser('id') userId: string
  ) {
    return this.serviceReviewService.addReview(payload, userId, serviceId);
  }

  @Get('/service/:serviceId')
  @ApiOperation({
    summary:
      '[APP || WEB] Get paginated reviews for a specific pet sitter service, Role: Pet Owner, Pet Sitter',
  })
  @ApiParam({
    name: 'serviceId',
    type: 'string',
    description: 'The ID of the pet sitter service to fetch reviews for',
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    description:
      'ID of the last review from previous page for cursor-based pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of reviews to return (maximum 50)',
    type: Number,
  })
  getReviewsByService(
    @Param('serviceId') serviceId: string,
    @Query('cursor') cursor?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 10
  ) {
    return this.serviceReviewService.getAllReviews(serviceId, cursor, limit);
  }

  /**
   * Get all reviews for all services of a specific pet sitter
   */
  @Get('/pet-sitter/:petSitterId')
  @ApiOperation({
    summary:
      '[APP || WEB] Get paginated reviews for all services of a pet sitter, Role: Pet Owner',
  })
  @ApiParam({
    name: 'petSitterId',
    type: 'string',
    description: 'The ID of the pet sitter whose reviews you want to fetch',
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    description:
      'ID of the last review from previous page for cursor-based pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of reviews to return (maximum 50)',
    type: Number,
  })
  getReviewsByPetSitter(
    @Param('petSitterId') petSitterId: string,
    @Query('cursor') cursor?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 10
  ) {
    return this.serviceReviewService.getAllReviewByPetSitterId(
      petSitterId,
      cursor,
      limit
    );
  }

  @Get('received')
  @ApiOperation({
    summary:
      '[APP || WEB] Get all reviews received by the logged-in pet sitter, Role: Pet Sitter',
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    description:
      'ID of the last review from previous page for cursor-based pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of reviews to return (maximum 50)',
    type: Number,
  })
  getMyReceivedReviews(
    @CurrentUser('id') userId: string,
    @Query('cursor') cursor?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 10
  ) {
    return this.serviceReviewService.getMyReceivedReviews(
      userId,
      cursor,
      limit
    );
  }

  @Get('submitted')
  @ApiOperation({
    summary:
      '[APP || WEB] Get all reviews submitted by the logged-in pet sitter, Role: Pet Owner',
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    description:
      'ID of the last review from the previous page (for pagination)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of reviews to return (maximum 50)',
    type: Number,
  })
  getMySentReviews(
    @CurrentUser('id') userId: string,
    @Query('cursor') cursor?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 10
  ) {
    return this.serviceReviewService.getSubmittedReviews(userId, cursor, limit);
  }

  @Get(':reviewId')
  @ApiOperation({
    summary:
      '[APP || WEB] Get a specific review by its ID, Role: Pet Owner, Pet Sitter',
  })
  @ApiParam({
    name: 'reviewId',
    type: 'string',
    description: 'The unique ID of the review to fetch',
  })
  getReviewById(@Param('reviewId') reviewId: string) {
    return this.serviceReviewService.getReviewById(reviewId);
  }

  @Delete(':reviewId')
  @ApiOperation({
    summary: '[APP || WEB] Delete a specific review by its ID, Role: Pet Owner',
  })
  @ApiParam({
    name: 'reviewId',
    type: 'string',
    description: 'The unique ID of the review to delete',
  })
  deleteReview(
    @Param('reviewId') reviewId: string,
    @CurrentUser('id') userId: string
  ) {
    return this.serviceReviewService.deleteReview(reviewId, userId);
  }
}
