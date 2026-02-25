import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Prisma, Visibility } from '@prisma/client';
import { ApiResponse } from 'src/common/response/api-response';
import { CloudinaryService } from 'src/common/utils/cloudinary/cloudinary.service';
import { UserInteractionService } from 'src/common/utils/user-interaction/user-interaction.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import {
  AddStoryDto,
  ChangeStoryVisibilityDto,
  ReplyStoryDto,
} from './dto/story.dto';

@Injectable()
export class StoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
    private readonly userInteractionService: UserInteractionService
  ) {}

  async addStory(
    userId: string,
    payload: AddStoryDto,
    file?: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    let media;

    if (file.mimetype.startsWith('image/')) {
      media = await this.cloudinary.uploadImageFromBuffer(file, 'stories');
    } else if (file.mimetype.startsWith('video/')) {
      media = await this.cloudinary.uploadVideo(file, 'stories', 'Stories');
    }

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // +24 hours

    const story = await this.prisma.story.create({
      data: {
        media: media.secure_url,
        userId,
        visibility: payload.visibility || 'PUBLIC',
        location: payload.location || null,
        expiresAt,
      },
    });

    return ApiResponse.success('Story added successfully', story);
  }

  async changeStoryVisibility(
    storyId: string,
    payload: ChangeStoryVisibilityDto,
    userId: string
  ) {
    const story = await this.prisma.story.findFirst({
      where: { id: storyId, isDeleted: false },
    });

    if (!story) {
      throw new BadRequestException('Story not found');
    }

    if (story.userId !== userId) {
      throw new ForbiddenException('You are not the owner of this story');
    }

    const updatedStory = await this.prisma.story.update({
      where: { id: storyId },
      data: { visibility: payload.visibility },
    });

    return ApiResponse.success(
      'Story visibility changed successfully',
      updatedStory
    );
  }

  async toggleStoryPublished(storyId: string, userId: string) {
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
      select: { id: true, userId: true, isPublished: true, expiresAt: true },
    });

    if (!story) throw new BadRequestException('Story not found');

    if (story.userId !== userId)
      throw new ForbiddenException('You are not the owner of this story');

    if (story.expiresAt < new Date())
      throw new BadRequestException('Story has expired');

    const updatedStory = await this.prisma.story.update({
      where: { id: storyId },
      data: { isPublished: !story.isPublished },
    });

    const message = updatedStory.isPublished
      ? 'Story has been published successfully'
      : 'Story has been unpublished successfully';

    return ApiResponse.success(message, updatedStory);
  }

  async deleteStory(storyId: string, userId: string) {
    // 1️⃣ Fetch story with only necessary fields
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
      select: { id: true, userId: true, expiresAt: true, isDeleted: true },
    });

    if (!story || story.isDeleted) {
      throw new BadRequestException('Story not found or already deleted');
    }

    if (story.userId !== userId) {
      throw new ForbiddenException('You are not the owner of this story');
    }

    if (story.expiresAt < new Date()) {
      throw new BadRequestException('Story has expired');
    }

    // 2️⃣ Soft delete
    const deletedStory = await this.prisma.story.update({
      where: { id: storyId },
      data: { isDeleted: true },
    });

    return ApiResponse.success('Story deleted successfully', deletedStory);
  }

  async incrementViewCount(storyId: string, userId: string) {
    // Check if the user already viewed the story
    const existingView = await this.prisma.storyView.findUnique({
      where: { storyId_userId: { storyId, userId } },
    });

    if (existingView) {
      const story = await this.prisma.story.findUnique({
        where: { id: storyId },
        select: { viewCount: true, isDeleted: true, isPublished: true },
      });

      if (!story || story.isDeleted || !story.isPublished) {
        throw new BadRequestException('Story not found or not available');
      }

      return ApiResponse.success(
        'Story view count not incremented (already viewed)',
        { viewCount: story.viewCount }
      );
    }

    // Transaction: create StoryView & increment viewCount atomically
    const [, updatedStory] = await this.prisma.$transaction([
      this.prisma.storyView.create({
        data: { storyId, userId },
      }),
      this.prisma.story.update({
        where: { id: storyId },
        data: { viewCount: { increment: 1 } },
        select: { viewCount: true },
      }),
    ]);

    return ApiResponse.success('Story view count incremented successfully', {
      viewCount: updatedStory.viewCount,
    });
  }

  async toggleStoryLike(storyId: string, userId: string) {
    // 1️⃣ Fetch story & check availability
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
      select: { id: true, isDeleted: true, isPublished: true, likeCount: true },
    });

    if (!story || story.isDeleted || !story.isPublished) {
      throw new BadRequestException('Story not found or not available');
    }

    // 2️⃣ Transaction: toggle like & update likeCount atomically
    const result = await this.prisma.$transaction(async (prisma) => {
      const existingLike = await prisma.storyLike.findUnique({
        where: { storyId_userId: { storyId, userId } },
      });

      if (existingLike) {
        await prisma.storyLike.delete({
          where: { storyId_userId: { storyId, userId } },
        });

        const updatedStory = await prisma.story.update({
          where: { id: storyId },
          data: { likeCount: { decrement: 1 } },
          select: { likeCount: true },
        });

        return { action: 'removed', likeCount: updatedStory.likeCount };
      } else {
        await prisma.storyLike.create({ data: { storyId, userId } });

        const updatedStory = await prisma.story.update({
          where: { id: storyId },
          data: { likeCount: { increment: 1 } },
          select: { likeCount: true },
        });

        return { action: 'added', likeCount: updatedStory.likeCount };
      }
    });

    return ApiResponse.success(
      result.action === 'added'
        ? 'Story like added successfully'
        : 'Story like removed successfully',
      { likeCount: result.likeCount }
    );
  }

  async getStories(
    userId: string,
    limit = 20,
    cursor?: string // just use the story id for pagination
  ) {
    limit = Math.min(limit, 50);
    const now = new Date();

    // 1️⃣ Fetch active friends
    const friendships = await this.prisma.friendship.findMany({
      where: {
        status: 'ACTIVE',
        OR: [{ userAId: userId }, { userBId: userId }],
      },
      select: { userAId: true, userBId: true },
    });

    const friendIds = friendships.map((f) =>
      f.userAId === userId ? f.userBId : f.userAId
    );

    // 2️⃣ Build visibility rules
    const visibilityOr: Prisma.StoryWhereInput[] = [
      { userId }, // own stories
      { visibility: Visibility.PUBLIC }, // public stories
    ];

    if (friendIds.length) {
      visibilityOr.push({
        userId: { in: friendIds },
        visibility: Visibility.FRIENDS,
      });
    }

    const where: Prisma.StoryWhereInput = {
      isDeleted: false,
      isPublished: true,
      expiresAt: { gte: now },
      AND: [{ OR: visibilityOr }],
    };

    // 2️⃣ Apply block + mute filters
    if (userId) {
      const notFilters =
        await this.userInteractionService.getStoryVisibilityFilters(userId);
      if (notFilters.length) {
        where.NOT = notFilters;
      }
    }

    // 3️⃣ Fetch stories
    const stories = await this.prisma.story.findMany({
      where,
      take: limit + 1,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }), // id-only cursor
      orderBy: [
        { trendingScore: 'desc' },
        { createdAt: 'desc' },
        { id: 'desc' },
      ],
      select: {
        id: true,
        media: true,
        location: true,
        createdAt: true,
        expiresAt: true,
        likeCount: true,
        visibility: true,
        viewCount: true,
        trendingScore: true,
        user: { select: { id: true, fullName: true, image: true } },
        storyLikes: { where: { userId }, select: { id: true } },
        storyViews: { where: { userId }, select: { id: true } },
      },
    });

    // 4️⃣ Cursor pagination
    let nextCursor: string | null = null;
    if (stories.length > limit) {
      nextCursor = stories.pop()!.id;
    }

    // 5️⃣ Map response
    const items = stories.map((story) => {
      const remainingMs = story.expiresAt.getTime() - now.getTime();
      const remainingHours = Math.max(0, remainingMs / (1000 * 60 * 60));

      return {
        id: story.id,
        media: story.media,
        location: story.location,
        createdAt: story.createdAt,
        expiresAt: story.expiresAt,
        user: story.user,
        remainingHours,
        likeCount: story.likeCount,
        viewCount: story.viewCount,
        isLiked: story.storyLikes.length > 0,
        isViewed: story.storyViews.length > 0,
        visibility: story.visibility,
      };
    });

    return ApiResponse.success('Stories fetched successfully', {
      items,
      nextCursor,
    });
  }

  async getMyStories(userId: string, limit = 20, cursor?: string) {
    // 1️⃣ Cap the limit
    limit = Math.min(limit, 50);

    // 2️⃣ Fetch stories with cursor pagination and replies
    const stories = await this.prisma.story.findMany({
      where: { userId, isDeleted: false, isPublished: true },
      take: limit + 1, // fetch one extra to check if there’s a next page
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1, // skip the cursor itself
      }),
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        media: true,
        location: true,
        createdAt: true,
        likeCount: true,
        viewCount: true,
        visibility: true,
        expiresAt: true,
        storyReplies: {
          select: {
            id: true,
            comment: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                fullName: true, // include any user fields you want
                image: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' }, // oldest first
        },
      },
    });

    // 3️⃣ Determine next cursor
    let nextCursor: string | null = null;
    if (stories.length > limit) {
      nextCursor = stories.pop()!.id;
    }

    const now = new Date();

    const items = stories.map((story) => {
      const remainingMs = story.expiresAt.getTime() - now.getTime();
      const remainingHours = Math.max(0, remainingMs / (1000 * 60 * 60)); // convert ms to hours

      return {
        ...story,
        remainingHours,
      };
    });

    return ApiResponse.success('My stories fetched successfully', {
      items,
      nextCursor,
    });
  }

  async replyStory(userId: string, storyId: string, payload: ReplyStoryDto) {
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
    });

    if (!story || story.isDeleted || !story.isPublished) {
      throw new BadRequestException('Story not found or unpublished');
    }

    if (!payload.comment?.trim()) {
      throw new BadRequestException('Comment cannot be empty');
    }

    await this.prisma.storyReplies.create({
      data: {
        userId,
        storyId,
        comment: payload.comment,
      },
    });

    return ApiResponse.success('Reply added successfully');
  }

  async getRepliesByStoryId(
    storyId: string,
    userId: string,
    limit = 20,
    cursor?: string
  ) {
    const story = await this.prisma.story.findFirst({
      where: {
        id: storyId,
        userId,
        isDeleted: false,
        isPublished: true,
      },
    });

    if (!story) {
      throw new ForbiddenException('Access denied');
    }

    limit = Math.min(limit, 50);

    const replies = await this.prisma.storyReplies.findMany({
      where: {
        storyId,
        isDeleted: false,
      },
      take: limit + 1,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      orderBy: { id: 'desc' }, // MUST match cursor
      select: {
        id: true,
        comment: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            fullName: true,
            image: true,
            userName: true,
          },
        },
      },
    });

    let nextCursor: string | null = null;
    if (replies.length > limit) {
      nextCursor = replies.pop()!.id;
    }

    return ApiResponse.success('Replies fetched successfully', {
      items: replies,
      nextCursor,
    });
  }
}
