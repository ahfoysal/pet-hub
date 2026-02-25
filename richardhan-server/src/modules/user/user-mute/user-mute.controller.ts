import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { UserMuteService } from './user-mute.service';
import { CurrentUser } from 'src/common/decorators/get-user.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';

@Controller('user-mute')
export class UserMuteController {
  constructor(private readonly userMuteService: UserMuteService) {}

  @Post('/mute/:id')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: '[APP] Mute a user',
    description:
      'Permanently mutes the target user. The authenticated user cannot mute themselves, and users who are BLOCKED or SUSPENDED cannot be muted.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'The ID of the user to mute',
    required: true,
  })
  async muteUser(
    @CurrentUser('id') userId: string,
    @Param('id') targetUserId: string
  ) {
    return await this.userMuteService.muteUser(userId, targetUserId);
  }

  @Post('/unmute/:id')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: '[APP] Unmute a user',
    description:
      'Unmute the target user. The authenticated user cannot unmute themselves, and users who are BLOCKED or SUSPENDED cannot be unmuted.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'The ID of the user to unmute',
    required: true,
  })
  async unmuteUser(
    @CurrentUser('id') userId: string,
    @Param('id') targetUserId: string
  ) {
    return await this.userMuteService.unmuteUser(userId, targetUserId);
  }

  @Get('')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: '[APP] Get muted users',
    description: `Returns a paginated list of users that the authenticated user has muted. 
  The authenticated user cannot mute themselves, and blocked or suspended users are excluded.`,
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    type: 'string',
    description:
      'The ID of the last user from the previous page for cursor-based pagination.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: 'number',
    description: 'Maximum number of users to return (default 20, max 50).',
  })
  async getMutedUsers(
    @CurrentUser('id') userId: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: number
  ) {
    return await this.userMuteService.getMutedUsers(userId, cursor, limit);
  }
}
