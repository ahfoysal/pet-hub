import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { CurrentUser } from 'src/common/decorators/get-user.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Community - Friendship')
@Controller('friendship')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @Post('request/send/:id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '[App] Send a friend request to another user' })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'The ID of the user you want to send a friend request to',
  })
  async sendFriendRequest(
    @Param('id') id: string,
    @CurrentUser('id') userId: string
  ) {
    return await this.friendshipService.sendFriendRequest(userId, id);
  }

  @Get('requests/pending')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: '[App] Get pending friend requests with cursor pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of requests to fetch per page (default: 20), optional',
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    type: String,
    description:
      'The ID of the last request from the previous page for pagination, optional',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search by sender name or email (optional)',
  })
  async getPendingFriendRequests(
    @CurrentUser('id') userId: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('cursor') cursor?: string,
    @Query('search') search?: string
  ) {
    return await this.friendshipService.getPendingFriendRequests(
      userId,
      limit,
      cursor,
      search
    );
  }

  @Patch('request/accept/:id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '[App] Accept a friend request' })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'The ID of the friend request to accept',
  })
  async acceptFriendRequest(
    @Param('id') id: string,
    @CurrentUser('id') userId: string
  ) {
    return await this.friendshipService.acceptFriendRequest(id, userId);
  }

  @Patch('request/reject/:id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '[App] Reject a friend request' })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'The ID of the friend request to reject',
  })
  async rejectFriendRequest(
    @Param('id') id: string,
    @CurrentUser('id') userId: string
  ) {
    return await this.friendshipService.rejectFriendRequest(id, userId);
  }

  @Get('friends')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: '[App] Get all friends with cursor pagination and optional search',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of friends to fetch per page (default: 20), optional',
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    type: String,
    description:
      'The ID of the last friendship from the previous page for pagination, optional',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search by friend full name or email, optional',
  })
  async getAllFriends(
    @CurrentUser('id') userId: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('cursor') cursor?: string,
    @Query('search') search?: string
  ) {
    return await this.friendshipService.getAllFriends(
      userId,
      limit,
      cursor,
      search
    );
  }

  @Patch('unfriend/:id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '[App] Unfriend a user' })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'The ID of the user to unfriend',
  })
  async unfriend(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return await this.friendshipService.unfriend(userId, id);
  }

  @Get('profile/:userId')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "[App] Get a friend's profile information",
    description:
      'Fetch profile info and mutual friends of a user. Returns error if blocked by either party.',
  })
  @ApiParam({
    name: 'userId',
    type: String,
    required: true,
    description: 'The user ID of the friend whose profile is to be retrieved',
  })
  async getFriendsProfile(
    @CurrentUser('id') userId: string,
    @Param('userId') otherUserId: string
  ) {
    return this.friendshipService.getFriendsProfile(userId, otherUserId);
  }

  @Get('mutual/:userId')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary:
      '[App] Get mutual friends between the current user and another user',
    description:
      'Fetches mutual friends, excluding any users blocked by either party.',
  })
  @ApiParam({
    name: 'userId',
    type: String,
    required: true,
    description: 'The user ID of the other user to compare mutual friends with',
  })
  async getMutualFriends(
    @CurrentUser('id') userId: string,
    @Param('userId') otherUserId: string
  ) {
    return this.friendshipService.getMutualFriends(userId, otherUserId);
  }
  @Get('suggestions')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get suggested friends' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of suggested friends to return (max 50)',
    example: 20,
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    type: String,
    description: 'Cursor for pagination (last userId from previous response)',
    example: 'uuid-string',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search by name, username, or email',
    example: 'john',
  })
  async getSuggestedFriends(
    @CurrentUser('id') userId: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('cursor') cursor?: string,
    @Query('search') search?: string
  ) {
    return this.friendshipService.getSuggestedFriends(
      userId,
      limit ? Number(limit) : undefined,
      cursor,
      search
    );
  }
}
