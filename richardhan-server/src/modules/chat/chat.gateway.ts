import { Logger, UseFilters } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OneToOneChatService } from './one-to-one-chat.service';
import { OnlineUsersService } from './online-user.service';
import { GroupChat, OneToOneChat } from './constant';
import { LoadMessagesEventDto, SendMessageDto } from './dto/one-to-one.dto';
import {
  AddPeopleToGroupEventDto,
  CreateGroupChatEventDto,
  LOAD_MESSAGES_FROM_GROUP_EVENT,
  RemovePeopleFromGroupEventDto,
  SendGroupMessageEventDto,
} from './dto/group-chat.dto';
import { GroupChatService } from './group-chat.service';
import { AllWsExceptionsFilter } from 'src/common/filters/global-socket-exception.filter';

@WebSocketGateway({
  cors: { origin: '*', credentials: true },
  transports: ['websocket', 'polling'],
  allowEIO3: true,
})
@UseFilters(AllWsExceptionsFilter)
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger = new Logger('ChatGateway');

  constructor(
    private readonly oneToOneChatService: OneToOneChatService,
    private readonly jwtService: JwtService,
    private readonly onlineUsers: OnlineUsersService,
    private readonly groupChatService: GroupChatService
  ) {}

  private extractToken(client: Socket): string | null {
    let token =
      client.handshake.auth?.token || (client.handshake.query?.token as string);
    if (!token) {
      const authHeader = client.handshake.headers?.authorization;
      if (typeof authHeader === 'string')
        token = authHeader.replace('Bearer ', '');
    }
    if (token?.startsWith('Bearer ')) token = token.replace('Bearer ', '');
    return token || null;
  }

  afterInit() {
    this.logger.log('✅ WebSocket Gateway initialized');
  }
  async handleConnection(client: Socket) {
    try {
      // Extract and verify token
      const token = this.extractToken(client);
      if (!token) throw new WsException('No token provided');

      const payload: any = await this.jwtService.verifyAsync(token);
      const userId = payload.id as string;

      client.data.user = { id: userId };

      // Join user's personal room
      if (!client.rooms.has(userId)) await client.join(userId);

      // Join all community rooms
      const communityIds =
        await this.groupChatService.getUserCommunityIds(userId);
      for (const id of communityIds) {
        if (!client.rooms.has(id)) await client.join(id);
      }

      // Increment online connections
      this.onlineUsers.setOnline(userId);

      // Emit connected event
      client.emit('connected', {
        message: 'Connected',
        userId,
        communities: communityIds,
      });

      this.logger.log(`🟢 User ${userId} is online`);
    } catch (err) {
      this.logger.error(`Connection failed: ${(err as Error).message}`);
      client.emit('error', { message: (err as Error).message });
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    try {
      const userId = client.data.user?.id as string;
      if (!userId) return;

      // Decrement connection count
      this.onlineUsers.setOffline(userId);

      // Log offline only if no remaining connections
      if (!this.onlineUsers.isOnline(userId)) {
        this.logger.log(`🔴 User ${userId} is offline`);
      }

      // Clean up user data
      client.data.user = null;
    } catch (err) {
      this.logger.error(`Error during disconnect: ${(err as Error).message}`);
      // no need to emit errors — socket is disconnecting anyway
    }
  }

  // -------- one to one ---------

  @SubscribeMessage(OneToOneChat.GET_ONLINE_FRIENDS)
  async getOnlineFriends(
    client: Socket,
    payload: { limit?: string; cursor?: string } // incoming payload from client
  ) {
    const userId = client.data.user?.id as string;
    if (!userId)
      return client.emit('error', { message: 'User not authenticated' });

    // Parse and validate limit
    let limit = 20; // default
    if (payload?.limit) {
      const parsed = parseInt(payload.limit, 10);
      if (!isNaN(parsed)) {
        limit = Math.min(Math.max(parsed, 1), 100); // 1-100 range
      }
    }

    // Call service
    const friends = await this.onlineUsers.getOnlineFriends({
      userId,
      limit,
      cursor: payload?.cursor,
    });

    // Emit result back to client
    client.emit(OneToOneChat.GET_ONLINE_FRIENDS, friends);
  }

  @SubscribeMessage(OneToOneChat.SEND_MESSAGE)
  async sendMessage(client: Socket, payload: SendMessageDto) {
    const senderId = client.data.user?.id as string;
    if (!senderId) throw new WsException('Unauthorized');

    // Send message
    const message = await this.oneToOneChatService.sendMessage(
      {
        receiverId: payload.receiverId,
        message: payload.message,
        media: payload.media,
        mediaType: payload.mediaType,
      },
      senderId
    );

    // Emit to sender and receiver
    this.server.to(senderId).emit(OneToOneChat.NEW_MESSAGE, message);
    this.server
      .to(payload.receiverId)
      .emit(OneToOneChat.RECEIVE_MESSAGE, message);

    // Update contacts in parallel
    const [senderContacts, receiverContacts] = await Promise.all([
      this.oneToOneChatService.getMyConversations(senderId),
      this.oneToOneChatService.getMyConversations(payload.receiverId),
    ]);

    this.server
      .to(senderId)
      .emit(OneToOneChat.CONTACTS_UPDATED, senderContacts);
    this.server
      .to(payload.receiverId)
      .emit(OneToOneChat.CONTACTS_UPDATED, receiverContacts);
  }

  @SubscribeMessage(OneToOneChat.LOAD_CONTACTS)
  async loadContacts(client: Socket) {
    const userId = client.data.user?.id as string;
    if (!userId) throw new WsException('Unauthorized');

    const contacts = await this.oneToOneChatService.getMyConversations(userId);

    client.emit(OneToOneChat.CONTACTS_UPDATED, contacts);
  }

  @SubscribeMessage(OneToOneChat.LOAD_MESSAGES)
  async loadMessages(client: Socket, payload: LoadMessagesEventDto) {
    const userId = client.data.user?.id as string;

    if (!userId) throw new WsException('Unauthorized');

    const messages = await this.oneToOneChatService.getMessagesFromConversation(
      payload.otherUserId,
      userId,
      payload.cursor,
      payload.limit
    );

    client.emit(OneToOneChat.MESSAGES_LOADED, messages);
  }

  // -------- group chat ---------

  @SubscribeMessage(GroupChat.GROUP_CREATED)
  groupCreated(client: Socket, payload: CreateGroupChatEventDto) {
    if (!payload.communityId) throw new WsException('Community ID is required');

    this.server.to(payload.communityId).emit(GroupChat.GROUP_CREATED, {
      message: 'Group created',
    });
  }
  @SubscribeMessage(GroupChat.USER_JOINED)
  async userJoinedGroup(client: Socket, payload: AddPeopleToGroupEventDto) {
    if (!payload.participantId || !payload.communityId) {
      throw new WsException('participantId and communityId are required');
    }

    // Fetch user info (may throw WsException if user not found)
    const user = await this.groupChatService.getUserInfo(payload.participantId);

    // Add the user's socket to the community room
    this.server.in(payload.participantId).socketsJoin(payload.communityId);

    // Create action message in DB
    const actionMessage = await this.groupChatService.addActionMessage(
      payload.communityId,
      user.id,
      'JOIN',
      `${user.fullName} joined the group`
    );

    // Emit the action message to all clients in the community
    this.server
      .to(payload.communityId)
      .emit(GroupChat.NEW_MESSAGE, actionMessage);

    // Emit USER_JOINED event for UI purposes
    this.server.to(payload.communityId).emit(GroupChat.USER_JOINED, {
      communityId: payload.communityId,
      user: {
        id: user.id,
        fullName: user.fullName,
        image: user.image,
      },
      message: actionMessage.message,
      messageId: actionMessage.id,
    });
  }

  @SubscribeMessage(GroupChat.USER_LEFT)
  async userLeftGroup(client: Socket, payload: CreateGroupChatEventDto) {
    const userId = client.data.user?.id as string;
    if (!userId) throw new WsException('Unauthorized');
    if (!payload.communityId) throw new WsException('communityId is required');

    // Fetch user info
    const user = await this.groupChatService.getUserInfo(userId);

    // Create action message for leaving
    const actionMessage = await this.groupChatService.addActionMessage(
      payload.communityId,
      user.id,
      'LEAVE',
      `${user.fullName} left the group`
    );

    // Emit the action message to all clients in the community
    this.server
      .to(payload.communityId)
      .emit(GroupChat.NEW_MESSAGE, actionMessage);

    // Emit USER_LEFT event for UI purposes
    this.server.to(payload.communityId).emit(GroupChat.USER_LEFT, {
      communityId: payload.communityId,
      user: {
        id: user.id,
        fullName: user.fullName,
        image: user.image,
      },
      message: actionMessage.message,
      messageId: actionMessage.id,
    });

    // Remove user's sockets from the community room
    this.server.in(userId).socketsLeave(payload.communityId);
  }

  // @SubscribeMessage(GroupChat.GROUP_INFO_UPDATED)
  // groupInfoUpdated(client: Socket, payload: CreateGroupChatEventDto) {
  //   this.server.to(payload.communityId).emit(GroupChat.GROUP_INFO_UPDATED, {
  //     communityId: payload.communityId,
  //   });
  // }

  // @SubscribeMessage(GroupChat.GROUP_IMAGE_UPDATED)
  // groupImageUpdated(client: Socket, payload: CreateGroupChatEventDto) {
  //   this.server.to(payload.communityId).emit(GroupChat.GROUP_IMAGE_UPDATED, {
  //     communityId: payload.communityId,
  //   });
  // }

  @SubscribeMessage(GroupChat.USER_REMOVED)
  async userRemoved(client: Socket, payload: RemovePeopleFromGroupEventDto) {
    if (!payload.participantId || !payload.communityId) {
      throw new WsException('participantId and communityId are required');
    }

    // Fetch removed user info
    const userRemoved = await this.groupChatService.getUserInfo(
      payload.participantId
    );

    // Create action message in DB
    const actionMessage = await this.groupChatService.addActionMessage(
      payload.communityId,
      userRemoved.id,
      'REMOVE',
      `${userRemoved.fullName} was removed from the group`
    );

    // Broadcast action message
    this.server
      .to(payload.communityId)
      .emit(GroupChat.NEW_MESSAGE, actionMessage);

    // Emit USER_REMOVED event for UI
    this.server.to(payload.communityId).emit(GroupChat.USER_REMOVED, {
      communityId: payload.communityId,
      user: {
        id: userRemoved.id,
        fullName: userRemoved.fullName,
        image: userRemoved.image,
      },
      message: actionMessage.message,
      messageId: actionMessage.id,
    });

    // Remove the user's sockets from the community room
    this.server.in(payload.participantId).socketsLeave(payload.communityId);
  }

  @SubscribeMessage(GroupChat.SEND_MESSAGE)
  async sendMessageToGroup(client: Socket, payload: SendGroupMessageEventDto) {
    const userId = client.data.user?.id as string;
    if (!userId) throw new WsException('Unauthorized');
    if (!payload.communityId) throw new WsException('communityId is required');

    // Send the message
    const message = await this.groupChatService.sendMessageToGroup(
      userId,
      payload
    );

    // Broadcast to the community
    this.server.to(payload.communityId).emit(GroupChat.NEW_MESSAGE, message);
  }

  @SubscribeMessage(GroupChat.LOAD_MESSAGES)
  async getMessageFromCommunity(
    client: Socket,
    payload: LOAD_MESSAGES_FROM_GROUP_EVENT
  ) {
    const userId = client.data.user?.id as string;
    if (!userId) throw new WsException('Unauthorized');
    if (!payload.communityId) throw new WsException('communityId is required');

    // Fetch messages from the community
    const messages = await this.groupChatService.getMessageFromCommunity(
      payload.communityId,
      userId
    );

    // Send messages only to the requesting client
    client.emit(GroupChat.MESSAGES_LOADED, messages);
  }

  @SubscribeMessage(GroupChat.LOAD_PARTICIPANTS)
  async loadParticipants(client: Socket, payload: { communityId: string }) {
    const userId = client.data.user?.id as string;
    if (!userId) throw new WsException('Unauthorized');
    if (!payload.communityId) throw new WsException('communityId is required');

    // Fetch participants
    const participants = await this.groupChatService.getParticipants(
      payload.communityId,
      userId
    );

    // Send updated participants to the requesting client
    client.emit(GroupChat.PARTICIPANTS_UPDATED, participants);
  }
}
