import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CloudinaryService } from 'src/common/utils/cloudinary/cloudinary.service';
import { UserInteractionService } from 'src/common/utils/user-interaction/user-interaction.service';
import { PrismaService } from '../prisma/prisma.service';
import { SendMessageDto } from './dto/one-to-one.dto';
import { OnlineUsersService } from './online-user.service';

@Injectable()
export class OneToOneChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly onlineUsers: OnlineUsersService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly userInteractionService: UserInteractionService
  ) {}

  getUserKey(userId1: string, userId2: string): string {
    return [userId1, userId2].sort().join('-');
  }

  async findConversation(userId1: string, userId2: string) {
    const userKey = this.getUserKey(userId1, userId2);
    return this.prisma.conversation.findUnique({ where: { userKey } });
  }

  async findOrCreateConversationTx(
    tx: Prisma.TransactionClient,
    userId1: string,
    userId2: string
  ) {
    const userKey = this.getUserKey(userId1, userId2);
    return tx.conversation.upsert({
      where: { userKey },
      create: {
        userKey,
        user1Id: userId1,
        user2Id: userId2,
      },
      update: {}, // no-op
    });
  }

  // async sendMessage(payload: SendMessageDto, senderId: string) {
  //   if (senderId === payload.receiverId) {
  //     throw new BadRequestException('Cannot send message to yourself');
  //   }

  //   return this.prisma.$transaction(async (tx) => {
  //     const isBlocked = await this.userInteractionService.isUserBlocked(
  //       senderId,
  //       payload.receiverId
  //     );

  //     if (isBlocked) {
  //       throw new ForbiddenException(
  //         'Cannot send message. You are blocked or have blocked the user.'
  //       );
  //     }

  //     const conversation = await this.findOrCreateConversationTx(
  //       tx,
  //       senderId,
  //       payload.receiverId
  //     );

  //     const message = await tx.message.create({
  //       data: {
  //         content: payload.message ?? null,
  //         media: payload.media ?? null,
  //         mediaType: payload.mediaType ?? null,
  //         senderId,
  //         conversationId: conversation.id,
  //         sentAt: new Date(),
  //       },
  //       include: {
  //         sender: {
  //           select: {
  //             id: true,
  //             email: true,
  //             fullName: true,
  //             image: true,
  //             role: true,
  //           },
  //         },
  //       },
  //     });

  //     await tx.conversation.update({
  //       where: { id: conversation.id },
  //       data: {
  //         lastMessageId: message.id,
  //         lastMessageAt: message.sentAt,
  //       },
  //     });

  //     return message;
  //   });
  // }

  async sendMessage(payload: SendMessageDto, senderId: string) {
    if (senderId === payload.receiverId) {
      throw new BadRequestException('Cannot send message to yourself');
    }

    return this.prisma.$transaction(async (tx) => {
      // Check if the users are blocked (this uses the main Prisma client, not tx, which is fine)
      const isBlocked = await this.userInteractionService.isUserBlocked(
        senderId,
        payload.receiverId
      );

      if (isBlocked) {
        throw new ForbiddenException(
          'Cannot send message. You are blocked or have blocked the user.'
        );
      }

      // Find or create conversation using the transaction client
      let conversation = await tx.conversation.findFirst({
        where: {
          OR: [
            { user1Id: senderId, user2Id: payload.receiverId },
            { user1Id: payload.receiverId, user2Id: senderId },
          ],
        },
      });

      if (!conversation) {
        conversation = await tx.conversation.create({
          data: {
            user1Id: senderId,
            user2Id: payload.receiverId,
            userKey: this.getUserKey(senderId, payload.receiverId),
          },
        });
      }

      // Create the message
      const message = await tx.message.create({
        data: {
          content: payload.message ?? null,
          media: payload.media ?? null,
          mediaType: payload.mediaType ?? null,
          senderId,
          conversationId: conversation.id,
          sentAt: new Date(),
        },
        include: {
          sender: {
            select: {
              id: true,
              email: true,
              fullName: true,
              image: true,
              role: true,
            },
          },
        },
      });

      // Update conversation with last message info
      await tx.conversation.update({
        where: { id: conversation.id },
        data: {
          lastMessageId: message.id,
          lastMessageAt: message.sentAt,
        },
      });

      return message;
    });
  }

  async getMyConversations(userId: string) {
    const conversations = await this.prisma.conversation.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      orderBy: [
        { lastMessageAt: 'desc' },
        { createdAt: 'desc' }, // fallback for new conversations
      ],
      include: {
        user1: {
          select: {
            id: true,
            email: true,
            fullName: true,
            image: true,
            role: true,
          },
        },
        user2: {
          select: {
            id: true,
            email: true,
            fullName: true,
            image: true,
            role: true,
          },
        },
        lastMessage: {
          include: {
            sender: {
              select: {
                id: true,
                email: true,
                fullName: true,
                image: true,
                role: true,
              },
            },
          },
        },
      },
    });

    return conversations.map((conv) => {
      const otherUser = conv.user1Id === userId ? conv.user2 : conv.user1;

      return {
        conversationId: conv.id,
        otherUser: {
          ...otherUser,
          isOnline: this.onlineUsers.isOnline(otherUser.id),
        },
        lastMessage: conv.lastMessage
          ? {
              content: conv.lastMessage.content,
              sentAt: conv.lastMessage.sentAt,
              sender: {
                ...conv.lastMessage.sender,
                isOnline: this.onlineUsers.isOnline(conv.lastMessage.sender.id),
              },
            }
          : null,
      };
    });
  }

  async getMessagesFromConversation(
    userId: string,
    otherUserId: string,
    cursor?: string,
    limit = 50
  ) {
    const conversation = await this.findConversation(userId, otherUserId);

    if (!conversation) return [];

    return this.prisma.message.findMany({
      where: {
        conversationId: conversation.id,
      },
      orderBy: {
        sentAt: 'desc',
      },
      take: limit,
      skip: cursor ? 1 : 0,
      ...(cursor && {
        cursor: { id: cursor },
      }),
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            fullName: true,
            image: true,
            role: true,
          },
        },
      },
    });
  }
}
