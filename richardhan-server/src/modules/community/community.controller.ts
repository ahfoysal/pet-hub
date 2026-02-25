import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommunityService } from './community.service';
import { CreatePostDto, UpdatePostDto } from './dto/community.dto';
import { CurrentUser } from 'src/common/decorators/get-user.decorator';
import { type User } from 'src/common/types/user.type';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorageConfig } from 'src/config/storage.config';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { OptionalAuthGuard } from 'src/common/guards/optional-auth.guard';

@ApiTags('Community - Posts')
@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @UseGuards(AuthGuard)
  @Post('create-post')
  @ApiOperation({ summary: '[App] Create a new post with media' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create post with optional caption and location',
    type: CreatePostDto,
  })
  @UseInterceptors(
    FilesInterceptor('files', 10, {
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
  async createPost(
    @Body() payload: CreatePostDto,
    @CurrentUser() user: User,
    @UploadedFiles() files?: Express.Multer.File[]
  ) {
    return this.communityService.createPost(payload, user.id, files);
  }
  @Patch('edit-post/:postId')
  @UseGuards(AuthGuard)
  @ApiParam({ name: 'postId', type: String })
  @ApiOperation({ summary: '[App] Edit a post, only creator can edit' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdatePostDto })
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: memoryStorageConfig,
      fileFilter(req, file, callback) {
        // Only allow images and videos
        if (
          file.mimetype.startsWith('image/') ||
          file.mimetype.startsWith('video/')
        ) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException('Only images or videos are allowed'),
            false
          );
        }
      },
    })
  )
  async editPost(
    @CurrentUser() user: User,
    @Param('postId') postId: string,
    @Body() payload: UpdatePostDto,
    @UploadedFiles() files?: Express.Multer.File[]
  ) {
    return this.communityService.editPost(postId, payload, user.id, files);
  }

  @Delete('delete-post/:postId')
  @UseGuards(AuthGuard)
  @ApiParam({ name: 'postId', type: String })
  @ApiOperation({ summary: '[App] Delete a post, only creator can delete' })
  async deletePost(@CurrentUser() user: User, @Param('postId') postId: string) {
    return this.communityService.deletePost(postId, user.id);
  }

  @Patch('toggle-like/:postId')
  @UseGuards(AuthGuard)
  @ApiParam({ name: 'postId', type: String })
  @ApiOperation({ summary: '[App] Toggle like on a post, returns like count' })
  async toggleLike(@CurrentUser() user: User, @Param('postId') postId: string) {
    return this.communityService.toggleLike(postId, user.id);
  }

  @UseGuards(OptionalAuthGuard)
  @Get('all')
  @ApiOperation({ summary: '[App] Get all posts with cursor pagination' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of posts to fetch (max 50, default 20)',
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    type: String,
    description: 'Cursor for pagination (post id)',
  })
  async getAllPosts(
    @CurrentUser() user?: User,
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string
  ) {
    return this.communityService.getAllPosts(
      user?.id,
      limit ? Number(limit) : undefined,
      cursor
    );
  }

  @Get(':postId')
  @UseGuards(OptionalAuthGuard)
  @ApiParam({ name: 'postId', type: String })
  @ApiOperation({ summary: '[App] Get a single post' })
  async getSinglePost(
    @Param('postId') postId: string,
    @CurrentUser('id') userId: string
  ) {
    return this.communityService.getSinglePost(postId, userId);
  }

  @Get(':postId/liked-by')
  @UseGuards(AuthGuard)
  @ApiParam({ name: 'postId', type: String })
  @ApiOperation({ summary: '[App] Get users who liked a post' })
  async getPostLikedBy(@Param('postId') postId: string) {
    return this.communityService.getPostLikedBy(postId);
  }
}
