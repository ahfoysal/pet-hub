import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ReelService } from './reel.service';
import { CurrentUser } from 'src/common/decorators/get-user.decorator';
import {
  AddCommentOnReelDto,
  CreateReelDto,
  UpdateReelDto,
} from './dto/reel.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorageConfig } from 'src/config/storage.config';
import {
  ApiConsumes,
  ApiParam,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Community - Reels')
@Controller('reel')
export class ReelController {
  constructor(private readonly reelService: ReelService) {}

  @Post('')
  @UseGuards(AuthGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('video', {
      storage: memoryStorageConfig,
      limits: { fileSize: 60 * 1024 * 1024 }, // 60 MB
    })
  )
  @ApiOperation({ summary: '[App] Create a new reel' })
  async createReel(
    @CurrentUser('id') userId: string,
    @Body() payload: CreateReelDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.reelService.createReel(userId, payload, file);
  }

  @Patch(':reelId')
  @UseGuards(AuthGuard)
  @ApiParam({
    name: 'reelId',
    type: String,
    description: 'Unique ID of the reel to update',
  })
  @ApiOperation({ summary: '[App] Update an existing reel' })
  async updateReel(
    @CurrentUser('id') userId: string,
    @Param('reelId') reelId: string,
    @Body() payload: UpdateReelDto
  ) {
    return this.reelService.updateReel(reelId, payload, userId);
  }

  @Delete(':reelId')
  @UseGuards(AuthGuard)
  @ApiParam({
    name: 'reelId',
    type: String,
    description: 'Unique ID of the reel to delete',
  })
  @ApiOperation({ summary: '[App] Delete a reel' })
  async deleteReel(
    @CurrentUser('id') userId: string,
    @Param('reelId') reelId: string
  ) {
    return this.reelService.deleteReel(reelId, userId);
  }

  @Patch(':reelId/like')
  @UseGuards(AuthGuard)
  @ApiParam({
    name: 'reelId',
    type: String,
    description: 'Unique ID of the reel to toggle like',
  })
  @ApiOperation({ summary: '[App] Toggle like for a reel' })
  async toggleReelLike(
    @CurrentUser('id') userId: string,
    @Param('reelId') reelId: string
  ) {
    return this.reelService.toggleReelLike(reelId, userId);
  }

  @Post(':reelId/comment')
  @UseGuards(AuthGuard)
  @ApiParam({
    name: 'reelId',
    type: String,
    description: 'Unique ID of the reel to add a comment',
  })
  @ApiOperation({ summary: '[App] Add a comment on a reel' })
  async addCommentOnReel(
    @CurrentUser('id') userId: string,
    @Param('reelId') reelId: string,
    @Body() payload: AddCommentOnReelDto
  ) {
    return this.reelService.addCommentOnReel(reelId, payload, userId);
  }

  @Get('')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '[App] Get all reels' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of reels to fetch per page (default 10, max 20)',
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    type: String,
    description: 'Cursor ID for pagination',
  })
  async getAllReels(
    @CurrentUser('id') userId: string,
    @Query('limit') limit?: number,
    @Query('cursor') cursor?: string
  ) {
    return this.reelService.getAllReels(userId, limit, cursor);
  }

  @Get(':reelId/comments')
  @UseGuards(AuthGuard)
  @ApiParam({
    name: 'reelId',
    type: String,
    description: 'Unique ID of the reel to fetch comments',
  })
  @ApiOperation({ summary: '[App] Get comments from a reel' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of comments to fetch per page (default 20, max 50)',
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    type: String,
    description: 'Cursor ID for pagination',
  })
  async getCommentsFromReel(
    @Param('reelId') reelId: string,
    @Query('limit') limit?: number,
    @Query('cursor') cursor?: string
  ) {
    // Optional: Convert limit to number if received as string
    const pageLimit = limit ? Number(limit) : undefined;
    return this.reelService.getCommentsFromReel(reelId, pageLimit, cursor);
  }
}
