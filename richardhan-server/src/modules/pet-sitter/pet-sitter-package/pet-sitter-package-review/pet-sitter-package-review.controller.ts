import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PetSitterPackageReviewService } from './pet-sitter-package-review.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/get-user.decorator';
import {
  CreatePetSitterPackageReviewDto,
  UpdatePetSitterPackageReviewDto,
} from './dto/pet-sitter-package-review.dto';

@UseGuards(AuthGuard)
@ApiTags('Pet Sitter Package Review')
@Controller('pet-sitter-package-review')
export class PetSitterPackageReviewController {
  constructor(
    private readonly petSitterPackageReviewService: PetSitterPackageReviewService
  ) {}

  @Post(':id')
  @ApiOperation({
    summary: 'Add a review to a pet sitter package, Role: Pet owner',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Pet sitter package ID to be reviewed',
  })
  addPackageReview(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() payload: CreatePetSitterPackageReviewDto
  ) {
    return this.petSitterPackageReviewService.addPackageReview(
      userId,
      id,
      payload
    );
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update an existing pet sitter package review, Role: Pet owner',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Review ID to be updated',
  })
  updatePackageReview(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() payload: UpdatePetSitterPackageReviewDto
  ) {
    return this.petSitterPackageReviewService.updatePackageReview(
      userId,
      id,
      payload
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete an existing pet sitter package review, Role: Pet owner',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID of the review to be deleted',
  })
  deletePackageReview(
    @Param('id') id: string,
    @CurrentUser('id') userId: string
  ) {
    return this.petSitterPackageReviewService.deletePackageReview(userId, id);
  }

  @Get('/package/:id')
  @ApiOperation({
    summary:
      'Get reviews for a pet sitter package, Role: Pet owner, Pet sitter',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID of the package to get reviews for',
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    type: String,
    description: 'Cursor for pagination (last review ID from previous page)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of reviews to return (max 50)',
  })
  getReviewsForPackage(
    @Param('id') id: string,
    @Query('cursor') cursor?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 20
  ) {
    return this.petSitterPackageReviewService.getReviewsForPackage(
      id,
      cursor,
      limit
    );
  }

  @Get('/submitted')
  @ApiOperation({
    summary: 'Get reviews submitted by the current user, Role: Pet owner',
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    type: String,
    description: 'Cursor for pagination (last review ID from previous page)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of reviews to return (max 50)',
  })
  getReviewsSubmittedByUser(
    @CurrentUser('id') id: string,
    @Query('cursor') cursor?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 20
  ) {
    return this.petSitterPackageReviewService.getMySubmittedReviews(
      id,
      cursor,
      limit
    );
  }

  @Get('/received')
  @ApiOperation({
    summary: 'Get reviews received by the current pet sitter, Role: Pet sitter',
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    type: String,
    description: 'Cursor for pagination (last review ID from previous page)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of reviews to return (max 50)',
  })
  getReviewsReceivedByUser(
    @CurrentUser('id') id: string,
    @Query('cursor') cursor?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 20
  ) {
    return this.petSitterPackageReviewService.getMyReceivedReviews(
      id,
      cursor,
      limit
    );
  }

  @Get(':id')
  @ApiOperation({
    summary:
      'Get a single pet sitter package review, Role: Pet owner, Pet sitter',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID of the review to get',
  })
  getSingleReview(@Param('id') id: string) {
    return this.petSitterPackageReviewService.getSingleReview(id);
  }
}
