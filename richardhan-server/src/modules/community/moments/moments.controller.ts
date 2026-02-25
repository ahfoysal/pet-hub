import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MomentsService } from './moments.service';
import { CurrentUser } from 'src/common/decorators/get-user.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';

@ApiTags('Community - Moments')
@UseGuards(AuthGuard)
@Controller('moments')
export class MomentsController {
  constructor(private readonly momentsService: MomentsService) {}

  @Get('my-moments')
  @ApiOperation({ summary: "Get the authenticated user's moments" })
  @ApiQuery({
    name: 'cursor',
    required: false,
    description: 'Cursor for pagination (moment ID)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of moments to fetch (max 50)',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'List of moments with story media and location',
    schema: {
      example: {
        data: [
          {
            id: '1',
            story: {
              id: 'story-1',
              media: 'https://example.com/story.jpg',
              location: 'New York, USA',
              createdAt: '2026-01-22T06:00:00.000Z',
              userId: 'user-123',
            },
          },
          {
            id: '2',
            story: {
              id: 'story-2',
              media: 'https://example.com/story2.mp4',
              location: null,
              createdAt: '2026-01-23T10:30:00.000Z',
              userId: 'user-123',
            },
          },
        ],
        nextCursor: '3',
      },
    },
  })
  async getMyMoments(
    @CurrentUser('id') userId: string,
    @Query('cursor') cursor?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 20
  ) {
    return this.momentsService.getMyMoments(userId, cursor, limit);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: "Get another user's moments" })
  @ApiParam({
    name: 'userId',
    description: 'The ID of the user whose moments are being fetched',
    type: String,
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    description: 'Cursor for pagination (moment ID)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of moments to fetch (max 50, default 20)',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'List of moments with pagination info',
    schema: {
      example: {
        data: [
          {
            id: '1',
            createdAt: '2026-01-22T06:00:00.000Z',
            story: {
              media: ['https://example.com/image1.jpg'],
              location: 'New York, USA',
            },
          },
        ],
        nextCursor: '2',
      },
    },
  })
  async getMomentsByUser(
    @Param('userId') userId: string,
    @Query('cursor') cursor?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 20
  ) {
    return this.momentsService.getMomentsByUser(userId, cursor, limit);
  }

  @Patch('hide/:momentId')
  @ApiOperation({ summary: 'Toggle hide/unhide a moment' })
  @ApiParam({
    name: 'momentId',
    description: 'ID of the moment to toggle hide/unhide',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Moment hidden or unhidden successfully',
    schema: {
      example: {
        message: 'Moment is now hidden',
        success: true,
      },
    },
  })
  async toggleHideMoment(
    @CurrentUser('id') userId: string,
    @Param('momentId') momentId: string
  ) {
    return this.momentsService.toggleHideMoment(userId, momentId);
  }

  @Delete(':momentId')
  @ApiOperation({ summary: 'Delete a moment' })
  @ApiParam({
    name: 'momentId',
    description: 'ID of the moment to delete',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Moment deleted successfully',
    schema: {
      example: {
        message: 'Moment deleted successfully',
        success: true,
      },
    },
  })
  async deleteMoment(@CurrentUser('id') userId: string, momentId: string) {
    return this.momentsService.deleteMoment(userId, momentId);
  }
}
