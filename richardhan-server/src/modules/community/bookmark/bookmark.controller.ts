import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { BookmarkService } from './bookmark.service';
import { CurrentUser } from 'src/common/decorators/get-user.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { GetBookmarksQueryDto } from './dto/bookmark.dto';

@ApiTags('Community - Bookmarks')
@Controller('bookmark')
@UseGuards(AuthGuard)
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Patch('post/:postId')
  @ApiParam({
    name: 'postId',
    type: String,
    description: 'ID of the post to toggle bookmark for',
  })
  @ApiOperation({
    summary: '[App] Toggle bookmark for a post',
    description:
      'Adds a bookmark if the post is not bookmarked, removes it if already bookmarked.',
  })
  toggleBookmarkPost(
    @Param('postId') postId: string,
    @CurrentUser('id') userId: string
  ) {
    return this.bookmarkService.toggleBookmarkPost(postId, userId);
  }

  @Patch('reel/:reelId')
  @ApiParam({
    name: 'reelId',
    type: String,
    description: 'ID of the reel to toggle bookmark for',
  })
  @ApiOperation({
    summary: '[App] Toggle bookmark for a reel',
    description:
      'Adds a bookmark if the reel is not bookmarked, removes it if already bookmarked.',
  })
  toggleBookmarkReel(
    @Param('reelId') reelId: string,
    @CurrentUser('id') userId: string
  ) {
    return this.bookmarkService.toggleBookmarkReel(reelId, userId);
  }

  @Get('')
  @ApiOperation({
    summary: '[App] Get all bookmarks of the current user',
    description:
      'Fetches all bookmarks of the authenticated user. Supports filtering, cursor-based pagination, and limit.',
  })
  async getAllMyBookmarks(
    @CurrentUser('id') userId: string,
    @Query() query: GetBookmarksQueryDto
  ) {
    const { filter, cursor, limit = 20 } = query;
    return this.bookmarkService.getAllMyBookmarks(
      userId,
      filter,
      cursor,
      limit
    );
  }

  @Get(':bookmarkId')
  @ApiParam({
    name: 'bookmarkId',
    type: String,
    description: 'ID of the bookmark to get',
  })
  @ApiOperation({
    summary: '[App] Get a single bookmark',
    description:
      'Fetches details of a specific bookmark for the authenticated user by bookmark ID.',
  })
  async getSingleBookMark(
    @Param('bookmarkId') bookmarkId: string,
    @CurrentUser('id') userId: string
  ) {
    return this.bookmarkService.getSingleBookMark(bookmarkId, userId);
  }
}
