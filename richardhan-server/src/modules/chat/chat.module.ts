import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { OnlineUsersService } from './online-user.service';
import { GroupChatService } from './group-chat.service';
import { OneToOneChatService } from './one-to-one-chat.service';
import { ChatController } from './chat.controller';

@Module({
  providers: [
    ChatGateway,
    ChatService,
    OnlineUsersService,
    GroupChatService,
    OneToOneChatService,
  ],
  controllers: [ChatController],
})
export class ChatModule {}
