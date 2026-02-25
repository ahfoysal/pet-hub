import {
  Controller,
  Post,
  Param,
  UseGuards,
  Get,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/get-user.decorator';
import { UserBlockService } from './user-block.service';

@Controller('user-block')
export class UserBlockController {
  constructor(private readonly userBlockService: UserBlockService) {}

  @Post('block/:userId')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: '[App] Block a user',
    description:
      'Blocks the specified user. Blocking is one-directional. ' +
      'If the other user has already blocked you, this action is still allowed ' +
      'and will result in a mutual block.',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID of the user to be blocked',
    type: String,
    example: 'c1a2b3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'User blocked successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'You cannot block yourself or user is already blocked',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found or unavailable',
  })
  async blockUser(
    @CurrentUser('id') userId: string,
    @Param('userId') blockedUserId: string
  ) {
    return this.userBlockService.blockUser(userId, blockedUserId);
  }

  @Post('unblock/:userId')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: '[App] Unblock a user',
    description:
      'Removes your block on the specified user. Unblocking is one-directional. ' +
      'If the other user still blocks you, the block remains effective and access ' +
      'will stay restricted.',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID of the user to unblock',
    type: String,
    example: 'c1a2b3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'User unblocked successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'You have not blocked this user',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async unblockUser(
    @CurrentUser('id') userId: string,
    @Param('userId') blockedUserId: string
  ) {
    return this.userBlockService.unblockUser(userId, blockedUserId);
  }

  @Get('my-blocked-users')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: '[App] Get blocked users',
    description:
      'Retrieve the list of users you have blocked. Supports pagination with optional cursor and limit.',
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    description:
      'ID of the last item from the previous page (for cursor-based pagination)',
    type: 'string',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of users to return (max 50)',
    type: 'number',
  })
  async getMyBlockedUsers(
    @CurrentUser('id') userId: string,
    @Query('cursor') cursor?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number
  ) {
    return this.userBlockService.getMyBlockedUsers(userId, cursor, limit);
  }
}
