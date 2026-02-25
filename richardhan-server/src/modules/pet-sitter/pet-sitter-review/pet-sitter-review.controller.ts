import {
  Controller,
  Post,
  Param,
  Body,
  UseGuards,
  Patch,
  Delete,
  Get,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { PetSitterReviewService } from './pet-sitter-review.service';
import {
  CreatePetSitterReviewDto,
  UpdatePetSitterReviewDto,
} from './dto/pet-sitter-review.dto';
import { CurrentUser } from 'src/common/decorators/get-user.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';

@ApiTags('Pet Sitter Reviews')
@UseGuards(AuthGuard)
@Controller('pet-sitter-reviews')
export class PetSitterReviewController {
  constructor(
    private readonly petSitterReviewService: PetSitterReviewService
  ) {}

  @Post(':id')
  @ApiOperation({ summary: 'Add a review for a pet sitter, Role: Pet Owner' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the pet sitter you want to review',
    type: String,
  })
  @ApiBody({
    description: 'Review details including rating and optional comment',
    type: CreatePetSitterReviewDto,
  })
  addReview(
    @CurrentUser('id') userId: string,
    @Param('id') petSitterId: string,
    @Body() payload: CreatePetSitterReviewDto
  ) {
    return this.petSitterReviewService.addReview(payload, userId, petSitterId);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a review for a pet sitter, Role: Pet Owner',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the pet sitter review you want to update',
    type: String,
  })
  @ApiBody({
    description: 'Fields to update in the review (rating and/or comment)',
    type: UpdatePetSitterReviewDto,
  })
  updateReview(
    @CurrentUser('id') userId: string,
    @Param('id') reviewId: string,
    @Body() payload: UpdatePetSitterReviewDto
  ) {
    return this.petSitterReviewService.updateReview(reviewId, userId, payload);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a review for a pet sitter, Role: Pet Owner ',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the pet sitter review you want to delete',
    type: String,
  })
  deleteReview(
    @CurrentUser('id') userId: string,
    @Param('id') reviewId: string
  ) {
    return this.petSitterReviewService.deleteReview(reviewId, userId);
  }

  @Get('pet-sitter/:id')
  @ApiOperation({
    summary:
      'Get reviews for a pet sitter with rating breakdown and average, Role: Pet Owner',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the pet sitter',
    type: String,
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    description: 'Review ID to start pagination from (optional)',
    type: String,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of reviews to fetch per request (max 50)',
    type: Number,
    example: 10,
  })
  async getReviewsForPetSitter(
    @Param('id') petSitterId: string,
    @Query('cursor') cursor?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number
  ) {
    return this.petSitterReviewService.getReviewsByPetSitterId(
      petSitterId,
      cursor,
      limit
    );
  }

  @Get('submitted')
  @ApiOperation({
    summary: 'Get reviews submitted by the current user, Role: Pet Owner',
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    description: 'Cursor for pagination (review ID)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of reviews to return (max 50)',
  })
  async getSubmittedReviews(
    @CurrentUser('id') userId: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: number
  ) {
    return this.petSitterReviewService.getMySubmittedReviews(
      userId,
      cursor,
      Number(limit) || 20
    );
  }

  @Get('received')
  @ApiOperation({
    summary: 'Get reviews received by the current pet sitter, Role: Pet Sitter',
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    description: 'Cursor for pagination (review ID)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of reviews to return (max 50)',
  })
  async getReceivedReviews(
    @CurrentUser('id') userId: string,
    @Query('cursor') cursor?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number
  ) {
    return this.petSitterReviewService.getMyReceivedReviews(
      userId,
      cursor,
      limit ?? 20
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a specific review by ID, Role: Pet Owner, Pet Sitter',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the review',
    type: String,
  })
  getReviewById(@Param('id') reviewId: string) {
    return this.petSitterReviewService.getSingleReview(reviewId);
  }
}
