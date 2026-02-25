import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/comments.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/get-user.decorator';

@ApiTags('Community - Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('/post/:postId')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '[App] Add a comment to a post' })
  async addComment(
    @Param('postId') postId: string,
    @Body() payload: CreateCommentDto,
    @CurrentUser('id') userId: string
  ) {
    return this.commentsService.addComment(payload, postId, userId);
  }

  @Post('/comment/:commentId')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '[App] Add a reply to a comment' })
  async addReply(
    @Param('commentId') commentId: string,
    @Body() payload: CreateCommentDto,
    @CurrentUser('id') userId: string
  ) {
    return this.commentsService.addReply(payload, commentId, userId);
  }

  @Patch('/comment/:commentId/edit')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '[App] Edit a comment' })
  async editComment(
    @Param('commentId') commentId: string,
    @Body() payload: CreateCommentDto,
    @CurrentUser('id') userId: string
  ) {
    return this.commentsService.editComment(commentId, userId, payload);
  }

  @Delete(':commentId')
  @ApiOperation({ summary: '[App] Delete a comment and its replies' })
  @UseGuards(AuthGuard)
  async deleteComment(
    @Param('commentId') commentId: string,
    @CurrentUser('id') userId: string
  ) {
    return this.commentsService.deleteComment(commentId, userId);
  }

  @Patch('/comment/:commentId/like')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '[App] Like or unlike a comment' })
  async toggleLikeComment(
    @Param('commentId') commentId: string,
    @CurrentUser('id') userId: string
  ) {
    return this.commentsService.toggleLikeComment(commentId, userId);
  }

  @Get('/post/:postId')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: '[App] Get comments for a post with cursor pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of parent comments to fetch per page (default: 10)',
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    type: String,
    description:
      'Cursor for pagination. Use the `id` of the last comment from previous page',
  })
  async getCommentsByPostId(
    @Param('postId') postId: string,
    @Query('limit') limit?: number,
    @Query('cursor') cursor?: string,
    @CurrentUser('id') userId?: string
  ) {
    return this.commentsService.getCommentsByPostId(
      postId,
      userId,
      limit,
      cursor
    );
  }
}
