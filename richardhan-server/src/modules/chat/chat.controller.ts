import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ApiResponse as ApiResponseFromCommon } from 'src/common/response/api-response';

import { storageConfig } from 'src/config/storage.config';
import { GroupChatService } from './group-chat.service';
import {
  AddPeopleToGroupDto,
  ChangeGroupOwnerDto,
  CreateCommunityChatDto,
  RemovePeopleFromGroupDto,
  UpdateGroupDetailsDto,
} from './dto/chat.dto';
import { CurrentUser } from 'src/common/decorators/get-user.decorator';
import { type User } from 'src/common/types/user.type';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ChatService } from './chat.service';
import { OneToOneChatService } from './one-to-one-chat.service';
import { ChatGateway } from './chat.gateway';
import { GroupChat } from './constant';

@UseGuards(AuthGuard)
@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(
    private readonly groupChatService: GroupChatService,
    private readonly chatService: ChatService,
    private readonly oneToOneChatService: OneToOneChatService,
    private readonly chatGateway: ChatGateway
  ) {}

  @Patch('change-owner/:communityId')
  @ApiOperation({ summary: 'Change the owner of a group' })
  @ApiParam({
    name: 'communityId',
    type: String,
    description:
      'ID of the community/group where the ownership will be changed',
    example: 'e14b79b8-8451-4fb0-8ef3-155a7b668c7e',
  })
  async changeGroupOwner(
    @Param('communityId') communityId: string,
    @CurrentUser('id') userId: string,
    @Body() payload: ChangeGroupOwnerDto
  ) {
    return this.groupChatService.changeGroupOwner(communityId, userId, payload);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage: storageConfig() }))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: '[App] Upload file for chat',
    description:
      'Allows app users to upload images, videos, or other files for use within the chat.',
  })
  @ApiBody({
    description: 'File to upload',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'File uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'File uploaded successfully' },
        data: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              example: 'https://res.cloudinary.com/.../image.jpg',
            },
            format: { type: 'string', example: 'jpg' },
          },
        },
      },
    },
  })
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.chatService.uploadFileOrImage(file);
  }

  @Get('/one-to-one/my-conversations')
  @ApiOperation({
    summary: '[App] Fetch all your one-to-one conversations',
    description: `Returns a list of all conversations the current user is part of.
Each conversation includes:
- conversationId
- otherUser information (id, fullName, email, image, online status)
- lastMessage (content, media, mediaType, sentAt, sender info including online status)

Conversations are sorted by the most recent message (descending). If a conversation has no messages, lastMessage will be null.`,
  })
  @UseGuards(AuthGuard)
  async getMyConversations(@CurrentUser() user: User) {
    return this.oneToOneChatService.getMyConversations(user.id);
  }

  @Get('/one-to-one/conversation/:otherUserId')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: '[App] Fetch message history with a specific user',
    description: `Returns messages exchanged between the authenticated user and the specified user.

- Messages are ordered from oldest to newest
- Supports cursor-based pagination
- If no conversation exists, an empty array is returned`,
  })
  @ApiParam({
    name: 'otherUserId',
    type: String,
    description: 'ID of the user whose conversation you want to fetch',
    example: 'a3f1c2d4-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    type: String,
    description: 'Message ID for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of messages to return (default: 50)',
  })
  async getMessagesFromConversation(
    @CurrentUser() user: User,
    @Param('otherUserId') otherUserId: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit = '50'
  ) {
    const messages = await this.oneToOneChatService.getMessagesFromConversation(
      user.id,
      otherUserId,
      cursor,
      Number(limit)
    );

    const result = {
      data: messages,
      nextCursor: messages.length ? messages[messages.length - 1].id : null,
    };

    return ApiResponseFromCommon.success(
      'Messages fetched successfully',
      result
    );
  }

  @Post('/community')
  @UseInterceptors(FileInterceptor('file', { storage: storageConfig() }))
  @ApiConsumes('multipart/form-data')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: '[App] Create a community chat',
    description:
      'Create a community chat with a name, description, and optional image.',
  })
  async createCommunity(
    @Body() payload: CreateCommunityChatDto,
    @CurrentUser() user: User,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.groupChatService.createCommunityChat(payload, user.id, file);
  }

  @Get('/community/me')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: '[App] Fetch communities joined by the current user',
  })
  async getMyJoinedCommunities(@CurrentUser() user: User) {
    return this.groupChatService.getMyJoinedCommunities(user.id);
  }

  @Get('/community/:communityId')
  @UseGuards(AuthGuard)
  @ApiParam({ name: 'communityId', type: 'string' })
  @ApiOperation({ summary: '[App] Get community details' })
  async getCommunityDetails(@Param('communityId') communityId: string) {
    return this.groupChatService.getCommunityDetails(communityId);
  }

  @Patch('/community/:communityId/image')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file', { storage: storageConfig() }))
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'communityId', type: String })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
      required: ['file'],
    },
  })
  @ApiOperation({ summary: '[App] Update group image' })
  async updateGroupImage(
    @Param('communityId') communityId: string,
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File
  ) {
    const result = await this.groupChatService.updateGroupImage(
      communityId,
      user.id,
      file
    );

    const actionMessage = await this.groupChatService.addActionMessage(
      communityId,
      user.id,
      'UPDATE_IMAGE',
      'Group image has been updated'
    );

    this.chatGateway.server
      .to(communityId)
      .emit(GroupChat.GROUP_IMAGE_UPDATED, {
        communityId,
        image: result.data?.image,
        message: actionMessage.message,
        messageId: actionMessage.id,
      });

    return result;
  }

  @Patch('/community/:communityId/details')
  @UseGuards(AuthGuard)
  @ApiParam({ name: 'communityId', type: String })
  @ApiOperation({ summary: '[App] Update group details' })
  async updateGroupDetails(
    @Param('communityId') communityId: string,
    @CurrentUser() user: User,
    @Body() payload: UpdateGroupDetailsDto
  ) {
    const result = await this.groupChatService.updateGroupDetails(
      communityId,
      user.id,
      payload
    );

    const actionMessage = await this.groupChatService.addActionMessage(
      communityId,
      user.id,
      'UPDATE_DETAILS',
      `Group details updated: ${result.data?.name}`
    );

    this.chatGateway.server.to(communityId).emit(GroupChat.GROUP_INFO_UPDATED, {
      communityId,
      data: {
        name: result.data?.name,
        description: result.data?.description,
      },
      message: actionMessage.message,
      messageId: actionMessage.id,
    });

    return result;
  }

  @Patch('/community/:communityId/add-people')
  @UseGuards(AuthGuard)
  @ApiParam({ name: 'communityId', type: String })
  @ApiOperation({ summary: '[App] Add people to group' })
  async addPeopleToGroup(
    @Param('communityId') communityId: string,
    @CurrentUser() user: User,
    @Body() payload: AddPeopleToGroupDto
  ) {
    return this.groupChatService.addPeopleToGroup(
      communityId,
      user.id,
      payload
    );
  }

  @Patch('/community/:communityId/remove-people')
  @UseGuards(AuthGuard)
  @ApiParam({ name: 'communityId', type: String })
  @ApiOperation({ summary: '[App] Remove people from group' })
  async removePeopleFromGroup(
    @Param('communityId') communityId: string,
    @CurrentUser() user: User,
    @Body() payload: RemovePeopleFromGroupDto
  ) {
    return this.groupChatService.removePeopleFromGroup(
      communityId,
      payload,
      user.id
    );
  }

  @Patch('/community/:communityId/leave')
  @UseGuards(AuthGuard)
  @ApiParam({ name: 'communityId', type: String })
  @ApiOperation({ summary: '[App] Leave group' })
  async leaveGroup(
    @Param('communityId') communityId: string,
    @CurrentUser() user: User
  ) {
    return this.groupChatService.leaveGroup(communityId, user.id);
  }

  @Get('community/:communityId/message')
  @UseGuards(AuthGuard)
  @ApiParam({
    name: 'communityId',
    type: String,
    description: 'Community ID',
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    type: String,
    description: 'Message ID used for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of messages to return (default: 50)',
  })
  @ApiOperation({ summary: '[App] Get community messages' })
  async getMessageFromCommunity(
    @Param('communityId') communityId: string,
    @CurrentUser() user: User,
    @Query('cursor') cursor?: string,
    @Query('limit') limit = '50'
  ) {
    const messages = await this.groupChatService.getMessageFromCommunity(
      communityId,
      user.id,
      cursor,
      Number(limit)
    );

    return ApiResponseFromCommon.success('Messages fetched successfully', {
      data: messages,
      nextCursor: messages.length ? messages[messages.length - 1].id : null,
    });
  }

  @Get('community/:communityId/participants')
  @ApiParam({ name: 'communityId', type: String })
  @ApiOperation({ summary: '[App] Get participants from community' })
  @UseGuards(AuthGuard)
  async getParticipants(
    @Param('communityId') communityId: string,
    @CurrentUser() user: User
  ) {
    const result = await this.groupChatService.getParticipants(
      communityId,
      user.id
    );

    return ApiResponseFromCommon.success(
      'Participants fetched successfully',
      result
    );
  }
}
