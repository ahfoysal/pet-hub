import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from 'src/common/utils/cloudinary/cloudinary.service';
import {
  AddPeopleToGroupDto,
  ChangeGroupOwnerDto,
  CreateCommunityChatDto,
  RemovePeopleFromGroupDto,
  UpdateGroupDetailsDto,
} from './dto/chat.dto';
import { ApiResponse } from 'src/common/response/api-response';
import { SendGroupMessageEventDto } from './dto/group-chat.dto';

@Injectable()
export class GroupChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  async addActionMessage(
    communityId: string,
    userId: string,
    actionType: string,
    message: string
  ) {
    // Verify community exists
    const community = await this.prisma.communityTopic.findUnique({
      where: { id: communityId },
    });

    if (!community) throw new NotFoundException('Community not found');

    // Create action message
    const actionMessage = await this.prisma.communityMessage.create({
      data: {
        topicId: communityId,
        senderId: userId, // usually the user performing the action
        message,
        messageType: 'ACTION_MESSAGE',
      },
    });

    return actionMessage;
  }

  async createCommunityChat(
    payload: CreateCommunityChatDto,
    userId: string,
    file?: Express.Multer.File
  ) {
    const { participantIds = [], file: _ignored, ...dto } = payload;

    let imageUrl: string | undefined;

    if (file) {
      const result = await this.cloudinaryService.uploadFile(file, {
        folder: 'group-logos',
        resourceType: 'image',
      });
      imageUrl = result.secure_url;
    }

    const allParticipants = [...new Set([userId, ...participantIds])];
    const idsToValidate = allParticipants.filter((id) => id !== userId);

    if (idsToValidate.length > 0) {
      const validUsers = await this.prisma.user.findMany({
        where: { id: { in: idsToValidate } },
        select: { id: true },
      });

      if (validUsers.length !== idsToValidate.length) {
        throw new BadRequestException('Invalid participant ids');
      }
    }

    return this.prisma.communityTopic.create({
      data: {
        // ✅ only Prisma fields
        name: dto.name,
        description: dto.description,
        image: imageUrl,
        creatorId: userId,
        isDeleted: false,
        communityTopicUsers: {
          create: allParticipants.map((id) => ({ userId: id })),
        },
      },
      include: {
        communityTopicUsers: {
          include: {
            user: {
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
  }

  async getCommunityDetails(communityId: string) {
    const community = await this.prisma.communityTopic.findUnique({
      where: { id: communityId },
      include: {
        communityTopicUsers: {
          select: {
            user: {
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
        creator: {
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

    if (!community || community.isDeleted) {
      throw new NotFoundException('Community not found');
    }

    const participants = community.communityTopicUsers.map((item) => item.user);

    return ApiResponse.success('Community found', {
      id: community.id,
      name: community.name,
      description: community.description,
      image: community.image,
      createdAt: community.createdAt,
      creator: community.creator,
      participants,
    });
  }

  async getMyJoinedCommunities(userId: string) {
    const communities = await this.prisma.communityTopic.findMany({
      where: {
        isDeleted: false,
        communityTopicUsers: {
          some: { userId },
        },
      },
      orderBy: [{ lastMessageAt: 'desc' }, { createdAt: 'desc' }],
      include: {
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

    return ApiResponse.success('Communities found', communities);
  }

  async updateGroupImage(
    communityId: string,
    userId: string,
    file?: Express.Multer.File
  ) {
    if (!file) throw new BadRequestException('File is required');

    const community = await this.prisma.communityTopic.findUnique({
      where: { id: communityId },
      select: { id: true, creatorId: true, isDeleted: true },
    });

    if (!community || community.isDeleted) {
      throw new NotFoundException('Community not found');
    }

    if (community.creatorId !== userId) {
      throw new ForbiddenException(
        'Only the community creator can update the group image'
      );
    }

    const uploadResult = await this.cloudinaryService.uploadFile(file, {
      folder: 'group-logos',
      resourceType: 'image',
    });

    const updatedCommunity = await this.prisma.communityTopic.update({
      where: { id: communityId },
      data: { image: uploadResult.secure_url },
      select: { id: true, image: true },
    });

    return ApiResponse.success(
      'Group image updated successfully',
      updatedCommunity
    );
  }

  async updateGroupDetails(
    communityId: string,
    userId: string,
    payload: UpdateGroupDetailsDto
  ) {
    const community = await this.prisma.communityTopic.findUnique({
      where: { id: communityId },
      select: { id: true, creatorId: true, isDeleted: true },
    });

    if (!community || community.isDeleted) {
      throw new NotFoundException('Community not found');
    }
    if (community.creatorId !== userId) {
      throw new ForbiddenException(
        'Only the community creator can update the group details'
      );
    }

    const updateData: Partial<UpdateGroupDetailsDto> = {};
    if (payload.name !== undefined) updateData.name = payload.name;
    if (payload.description !== undefined)
      updateData.description = payload.description;

    const updatedCommunity = await this.prisma.communityTopic.update({
      where: { id: communityId },
      data: updateData,
      select: { id: true, name: true, description: true },
    });

    return ApiResponse.success(
      'Group details updated successfully',
      updatedCommunity
    );
  }

  async addPeopleToGroup(
    communityId: string,
    userId: string,
    payload: AddPeopleToGroupDto
  ) {
    const community = await this.prisma.communityTopic.findUnique({
      where: { id: communityId },
      select: { id: true, creatorId: true, isDeleted: true },
    });

    if (!community || community.isDeleted)
      throw new NotFoundException('Community not found');
    if (community.creatorId !== userId)
      throw new ForbiddenException(
        'Only the community creator can add people to the group'
      );

    if (!payload.participantIds || payload.participantIds.length === 0)
      throw new BadRequestException('No participant IDs provided');

    const idsToAdd = payload.participantIds.filter((id) => id !== userId);

    if (idsToAdd.length === 0)
      return ApiResponse.success('No valid participants to add', null);

    const validUsers = await this.prisma.user.findMany({
      where: { id: { in: idsToAdd } },
      select: { id: true },
    });

    const validIds = validUsers.map((u) => u.id);
    if (validIds.length !== idsToAdd.length)
      throw new BadRequestException('Invalid participant IDs');

    const existingParticipants = await this.prisma.communityTopicUser.findMany({
      where: { communityTopicId: communityId },
      select: { userId: true },
    });
    const existingIds = existingParticipants.map((p) => p.userId);

    const newParticipantIds = validIds.filter(
      (id) => !existingIds.includes(id)
    );
    if (newParticipantIds.length === 0)
      return ApiResponse.success('No new participants to add', null);

    const updatedParticipants = await this.prisma.$transaction(
      async (prisma) => {
        await prisma.communityTopicUser.createMany({
          data: newParticipantIds.map((id) => ({
            userId: id,
            communityTopicId: communityId,
          })),
          skipDuplicates: true,
        });

        return prisma.communityTopicUser.findMany({
          where: { communityTopicId: communityId },
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                image: true,
                role: true,
              },
            },
          },
        });
      }
    );

    return ApiResponse.success('People added to group successfully', {
      communityId,
      participants: updatedParticipants.map((p) => p.user),
    });
  }

  async removePeopleFromGroup(
    communityId: string,
    payload: RemovePeopleFromGroupDto,
    userId: string
  ) {
    const community = await this.prisma.communityTopic.findUnique({
      where: { id: communityId },
      select: { id: true, creatorId: true, isDeleted: true },
    });

    if (!community || community.isDeleted)
      throw new NotFoundException('Community not found');
    if (community.creatorId !== userId)
      throw new ForbiddenException(
        'Only the community creator can remove people from the group'
      );

    if (payload.participantId === userId)
      throw new BadRequestException(
        'Creator cannot remove themselves from the group'
      );

    const participant = await this.prisma.communityTopicUser.findUnique({
      where: {
        userId_communityTopicId: {
          userId: payload.participantId,
          communityTopicId: communityId,
        },
      },
    });

    if (!participant)
      throw new NotFoundException('User is not a member of this group');

    await this.prisma.communityTopicUser.delete({
      where: {
        userId_communityTopicId: {
          userId: payload.participantId,
          communityTopicId: communityId,
        },
      },
    });

    return ApiResponse.success('User removed from group successfully', {
      communityId,
      removedUserId: payload.participantId,
    });
  }

  async leaveGroup(communityId: string, userId: string) {
    return this.prisma.$transaction(async (prisma) => {
      const community = await prisma.communityTopic.findUnique({
        where: { id: communityId },
        select: { id: true, creatorId: true, isDeleted: true },
      });

      if (!community || community.isDeleted)
        throw new NotFoundException('Community not found');

      const membership = await prisma.communityTopicUser.findUnique({
        where: {
          userId_communityTopicId: { userId, communityTopicId: communityId },
        },
      });

      if (!membership)
        throw new NotFoundException('You are not a member of this group');

      if (community.creatorId === userId) {
        const newOwner = await prisma.communityTopicUser.findFirst({
          where: { communityTopicId: communityId, userId: { not: userId } },
          select: { userId: true },
        });

        if (!newOwner) {
          await prisma.communityTopicUser.delete({
            where: {
              userId_communityTopicId: {
                userId,
                communityTopicId: communityId,
              },
            },
          });

          await prisma.communityTopic.update({
            where: { id: communityId },
            data: { isDeleted: true },
          });

          return ApiResponse.success(
            'You left the group and the group was deleted as you were the last member.',
            { communityId }
          );
        }

        await prisma.communityTopic.update({
          where: { id: communityId },
          data: { creatorId: newOwner.userId },
        });

        await prisma.communityTopicUser.delete({
          where: {
            userId_communityTopicId: { userId, communityTopicId: communityId },
          },
        });

        return ApiResponse.success(
          'You left the group. Ownership was transferred to another member.',
          { communityId, newOwnerId: newOwner.userId }
        );
      }

      await prisma.communityTopicUser.delete({
        where: {
          userId_communityTopicId: { userId, communityTopicId: communityId },
        },
      });

      return ApiResponse.success('You left the group successfully.', {
        communityId,
        userId,
      });
    });
  }

  async changeGroupOwner(
    communityId: string,
    userId: string,
    payload: ChangeGroupOwnerDto
  ) {
    // 1️⃣ Get the community
    const community = await this.prisma.communityTopic.findUnique({
      where: { id: communityId },
      select: {
        id: true,
        creatorId: true,
        isDeleted: true,
        communityTopicUsers: { select: { userId: true } },
      },
    });

    if (!community || community.isDeleted) {
      throw new NotFoundException('Community not found');
    }

    // 2️⃣ Only the current creator can change the owner
    if (community.creatorId !== userId) {
      throw new ForbiddenException(
        'Only the community creator can change the group owner'
      );
    }

    // 3️⃣ Prevent re-assigning the same owner
    if (community.creatorId === payload.participantId) {
      throw new BadRequestException('Participant is already the group owner');
    }

    // 4️⃣ Check that the participant is actually in the community
    const participant = await this.prisma.communityTopicUser.findUnique({
      where: {
        userId_communityTopicId: {
          userId: payload.participantId,
          communityTopicId: communityId,
        },
      },
    });

    if (!participant) {
      throw new NotFoundException(
        'The specified participant is not a member of this community'
      );
    }

    // 5️⃣ Update the community owner
    const updatedCommunity = await this.prisma.communityTopic.update({
      where: { id: communityId },
      data: { creatorId: payload.participantId },
      select: { id: true, creatorId: true },
    });

    return ApiResponse.success(
      'Group owner changed successfully',
      updatedCommunity
    );
  }

  // -- socket service

  async getParticipantIds(communityId: string): Promise<string[]> {
    const community = await this.prisma.communityTopic.findUnique({
      where: { id: communityId },
      select: {
        communityTopicUsers: {
          select: { userId: true },
        },
      },
    });

    if (!community) {
      throw new NotFoundException('Community not found');
    }

    return [...new Set(community.communityTopicUsers.map((u) => u.userId))];
  }

  async getUserInfo(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, fullName: true, image: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getUserCommunityIds(userId: string): Promise<string[]> {
    const communities = await this.prisma.communityTopicUser.findMany({
      where: { userId },
      select: { communityTopicId: true },
    });

    // Return unique community IDs as an array
    return Array.from(new Set(communities.map((c) => c.communityTopicId)));
  }

  async sendMessageToGroup(userId: string, payload: SendGroupMessageEventDto) {
    if (!payload.message && !payload.media) {
      throw new BadRequestException('Message or media is required');
    }

    if (payload.media && !payload.mediaType) {
      throw new BadRequestException(
        'mediaType is required if media is provided'
      );
    }

    const community = await this.prisma.communityTopic.findUnique({
      where: { id: payload.communityId },
      select: { id: true },
    });

    if (!community) {
      throw new NotFoundException('Community not found');
    }

    const isMember = await this.prisma.communityTopicUser.findUnique({
      where: {
        userId_communityTopicId: {
          userId,
          communityTopicId: payload.communityId,
        },
      },
    });

    if (!isMember) {
      throw new ForbiddenException('You are not a member of this community');
    }

    const message = await this.prisma.$transaction(async (tx) => {
      const createdMessage = await tx.communityMessage.create({
        data: {
          senderId: userId,
          topicId: payload.communityId,
          message: payload.message ?? null,
          media: payload.media ?? null,
          mediaType: payload.media ? payload.mediaType : null,
        },
        include: {
          sender: {
            select: {
              id: true,
              fullName: true,
              image: true,
              role: true,
            },
          },
        },
      });

      await tx.communityTopic.update({
        where: { id: payload.communityId },
        data: {
          lastMessageId: createdMessage.id,
          lastMessageAt: new Date(),
        },
      });

      return createdMessage;
    });

    return message;
  }

  async getMessageFromCommunity(
    communityId: string,
    userId: string,
    cursor?: string,
    limit = 50
  ) {
    const isMember = await this.prisma.communityTopicUser.findUnique({
      where: {
        userId_communityTopicId: {
          userId,
          communityTopicId: communityId,
        },
      },
    });

    if (!isMember) {
      throw new ForbiddenException('You are not a member of this community');
    }

    const messages = await this.prisma.communityMessage.findMany({
      where: { topicId: communityId },
      orderBy: { createdAt: 'desc' }, // newest → oldest
      take: limit,
      skip: cursor ? 1 : 0,
      ...(cursor && { cursor: { id: cursor } }),
      select: {
        id: true,
        senderId: true,
        message: true,
        media: true,
        mediaType: true,
        createdAt: true,
        sender: {
          select: {
            id: true,
            fullName: true,
            image: true,
            role: true,
          },
        },
      },
    });

    return messages;
  }

  async getParticipants(communityId: string, userId: string) {
    const isMember = await this.prisma.communityTopicUser.findUnique({
      where: {
        userId_communityTopicId: {
          userId,
          communityTopicId: communityId,
        },
      },
    });

    if (!isMember) {
      throw new ForbiddenException('You are not a member of this community');
    }

    const users = await this.prisma.communityTopicUser.findMany({
      where: { communityTopicId: communityId },
      select: { user: { select: { id: true, fullName: true, image: true } } },
    });
    return users.map((x) => x.user);
  }
}
