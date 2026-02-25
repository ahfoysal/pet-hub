import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { StoryService } from './story.service';
import {
  AddStoryDto,
  ChangeStoryVisibilityDto,
  ReplyStoryDto,
} from './dto/story.dto';
import { CurrentUser } from 'src/common/decorators/get-user.decorator';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorageConfig } from 'src/config/storage.config';
import { AuthGuard } from 'src/common/guards/auth.guard';

@ApiTags('Community - Story')
@Controller('story')
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Add a new story' })
  @ApiBody({
    description: 'Add a story with an image, optional location, and visibility',
    type: AddStoryDto,
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorageConfig,
      fileFilter(req, file, callback) {
        if (
          file.mimetype.startsWith('image/') ||
          file.mimetype.startsWith('video/')
        ) {
          callback(null, true); // Accept file
        } else {
          callback(
            new BadRequestException('Only images or videos allowed'),
            false
          ); // Reject file
        }
      },
    })
  )
  @UseGuards(AuthGuard)
  async addStory(
    @CurrentUser('id') userId: string,
    @Body() payload: AddStoryDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.storyService.addStory(userId, payload, file);
  }

  @Patch('/visibility/:id')
  @ApiConsumes('application/json')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Change the visibility of a story' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'The ID of the story',
    required: true,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        visibility: {
          type: 'string',
          description:
            'Visibility of the story. Allowed values: PUBLIC, FRIENDS, PRIVATE',
          enum: ['PUBLIC', 'FRIENDS', 'PRIVATE'],
          example: 'PUBLIC',
        },
      },
    },
  })
  async changeStoryVisibility(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() payload: ChangeStoryVisibilityDto
  ) {
    return this.storyService.changeStoryVisibility(id, payload, userId);
  }

  @UseGuards(AuthGuard)
  @Patch('/published/:id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Toggle the published status of a story' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'The ID of the story to toggle',
    required: true,
  })
  async toggleStoryPublished(
    @Param('id') id: string,
    @CurrentUser('id') userId: string
  ) {
    return this.storyService.toggleStoryPublished(id, userId);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a story' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'The ID of the story to delete',
    required: true,
  })
  @ApiOkResponse({
    description: 'Story deleted successfully',
    schema: {
      example: {
        success: true,
        message: 'Story deleted successfully',
        data: {
          id: 'story-id',
          userId: 'user-id',
          isDeleted: true,
          expiresAt: '2026-01-11T12:00:00.000Z',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Story not found or already deleted / Story has expired',
  })
  @ApiForbiddenResponse({ description: 'You are not the owner of this story' })
  async deleteStory(
    @Param('id') id: string,
    @CurrentUser('id') userId: string
  ) {
    return this.storyService.deleteStory(id, userId);
  }

  @Patch('/view/:id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Increment the view count of a story' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'The ID of the story to increment the view count',
    required: true,
  })
  async incrementViewCount(
    @Param('id') id: string,
    @CurrentUser('id') userId: string
  ) {
    return this.storyService.incrementViewCount(id, userId);
  }

  @Patch('/like/:id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Toggle the like status of a story' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'The ID of the story to toggle the like status',
    required: true,
  })
  async toggleStoryLike(
    @Param('id') id: string,
    @CurrentUser('id') userId: string
  ) {
    return this.storyService.toggleStoryLike(id, userId);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Fetch stories with pagination' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of stories to fetch (default 20, max 50)',
    type: Number,
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    description: 'Cursor ID for pagination',
    type: String,
  })
  async getStories(
    @CurrentUser('id') userId: string,
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string
  ) {
    const parsedLimit = limit ? parseInt(limit, 10) : undefined;
    return this.storyService.getStories(userId, parsedLimit, cursor);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get my stories with cursor pagination' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of stories to fetch (max 50)',
    type: Number,
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    description: 'ID of the last story from previous page for pagination',
    type: String,
  })
  async getMyStories(
    @CurrentUser('id') userId: string,
    @Query('limit') limit?: number,
    @Query('cursor') cursor?: string
  ) {
    return this.storyService.getMyStories(userId, limit, cursor);
  }

  @Post('/reply/:id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Reply to a story' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'The ID of the story to reply to',
    required: true,
  })
  @ApiBody({ type: ReplyStoryDto })
  async replyStory(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() payload: ReplyStoryDto
  ) {
    return this.storyService.replyStory(userId, id, payload);
  }

  @Get('replies/:storyId')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get replies for a story' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'cursor', required: false, type: String })
  @ApiParam({
    name: 'storyId',
    type: 'string',
    description: 'The ID of the story to get replies for',
    required: true,
  })
  async getRepliesByStoryId(
    @Param('storyId') storyId: string,
    @CurrentUser('id') userId: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 20,
    @Query('cursor') cursor?: string
  ) {
    return await this.storyService.getRepliesByStoryId(
      storyId,
      userId,
      limit,
      cursor
    );
  }
}
