import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ApiResponse } from 'src/common/response/api-response';
import { CloudinaryService } from 'src/common/utils/cloudinary/cloudinary.service';
import { UserInteractionService } from 'src/common/utils/user-interaction/user-interaction.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import {
  AddCommentOnReelDto,
  CreateReelDto,
  UpdateReelDto,
} from './dto/reel.dto';

@Injectable()
export class ReelService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
    private readonly userInteractionService: UserInteractionService
  ) {}

  async createReel(
    userId: string,
    payload: CreateReelDto,
    file?: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('Video file is required');
    }

    // 1️⃣ Upload video to Cloudinary
    const uploadedVideo = await this.cloudinary.uploadVideo(
      file,
      'reels',
      'Reels'
    );

    // 2️⃣ Create Reel record in Prisma
    const reel = await this.prisma.reel.create({
      data: {
        userId,
        video: uploadedVideo.secure_url,
        duration: uploadedVideo.duration ?? 0, // fallback to 0 if Cloudinary didn't return duration
        caption: payload.caption || null,
        visibility: payload.visibility,
      },
    });

    // 3️⃣ Return API response
    return ApiResponse.success('Reel created successfully', reel);
  }

  async updateReel(reelId: string, payload: UpdateReelDto, userId: string) {
    // 1️⃣ Fetch the reel
    const reel = await this.prisma.reel.findUnique({
      where: { id: reelId },
      select: {
        id: true,
        userId: true,
        isDeleted: true,
      },
    });

    // 2️⃣ Validate ownership & existence
    if (!reel || reel.isDeleted) {
      throw new BadRequestException('Reel not found');
    }

    if (reel.userId !== userId) {
      throw new ForbiddenException('You are not the owner of this reel');
    }

    // 3️⃣ Prepare data for update (only update fields provided)
    const dataToUpdate: Prisma.ReelUpdateInput = {};

    if (payload.caption !== undefined) {
      dataToUpdate.caption = payload.caption;
    }

    if (payload.visibility !== undefined) {
      dataToUpdate.visibility = payload.visibility;
    }

    // 4️⃣ Update the reel
    const updatedReel = await this.prisma.reel.update({
      where: { id: reelId },
      data: dataToUpdate,
    });

    return ApiResponse.success('Reel updated successfully', updatedReel);
  }

  async deleteReel(reelId: string, userId: string) {
    // 1️⃣ Fetch reel (minimal fields needed)
    const reel = await this.prisma.reel.findUnique({
      where: { id: reelId },
      select: {
        id: true,
        userId: true,
        isDeleted: true,
      },
    });

    // 2️⃣ Validate existence, ownership, and deletion status
    if (!reel || reel.isDeleted) {
      throw new BadRequestException('Reel not found');
    }

    if (reel.userId !== userId) {
      throw new ForbiddenException('You are not the owner of this reel');
    }

    // 3️⃣ Soft delete
    await this.prisma.reel.update({
      where: { id: reelId },
      data: { isDeleted: true },
    });

    return ApiResponse.success('Reel deleted successfully');
  }

  async toggleReelLike(reelId: string, userId: string) {
    // 1️⃣ Check if the reel exists and is not deleted
    const reel = await this.prisma.reel.findUnique({
      where: { id: reelId },
      select: { id: true, isDeleted: true },
    });

    if (!reel || reel.isDeleted) {
      throw new BadRequestException('Reel not found');
    }

    // 2️⃣ Toggle like and get updated like count in a single transaction
    const [liked, likeCount] = await this.prisma.$transaction(async (tx) => {
      const existing = await tx.reelLike.findUnique({
        where: { reelId_userId: { reelId, userId } },
      });

      let liked: boolean;

      if (existing) {
        await tx.reelLike.delete({ where: { id: existing.id } });
        liked = false;
      } else {
        await tx.reelLike.create({ data: { reelId, userId } });
        liked = true;
      }

      const likeCount = await tx.reelLike.count({ where: { reelId } });

      return [liked, likeCount] as const;
    });

    // 3️⃣ Return structured API response
    return ApiResponse.success(
      liked ? 'Like removed successfully' : 'Like added successfully',
      { likeCount }
    );
  }

  async addCommentOnReel(
    reelId: string,
    payload: AddCommentOnReelDto,
    userId: string
  ) {
    const reel = await this.prisma.reel.findUnique({
      where: { id: reelId },
      select: { id: true, isDeleted: true },
    });

    if (!reel || reel.isDeleted) {
      throw new BadRequestException('Reel not found');
    }

    if (!payload.content.trim().length) {
      throw new BadRequestException('Comment content is required');
    }

    const comment = await this.prisma.reelComment.create({
      data: { userId, reelId, comment: payload.content },
      select: {
        id: true,
        comment: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            fullName: true,
            image: true,
          },
        },
      },
    });

    const commentCount = await this.prisma.reelComment.count({
      where: { reelId, isDeleted: false },
    });

    return ApiResponse.success('Comment added successfully', {
      ...comment,
      commentCount,
    });
  }

  async getAllReels(userId?: string, limit = 10, cursor?: string) {
    // Hard cap
    limit = Math.min(limit, 20);

    // 1️⃣ Base where
    const where: Prisma.ReelWhereInput = {
      isDeleted: false,
      isHidden: false,
    };

    // 2️⃣ Apply visibility filters if userId exists
    if (userId) {
      const notFilters =
        await this.userInteractionService.getVisibilityFilters<Prisma.ReelWhereInput>(
          userId,
          'REEL'
        );
      if (notFilters.length > 0) {
        where.NOT = notFilters;
      }
    }

    // 3️⃣ Fetch reels
    const reels = await this.prisma.reel.findMany({
      where,
      take: limit + 1,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      orderBy: [{ trendingScore: 'desc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        caption: true,
        createdAt: true,
        trendingScore: true,
        user: {
          select: { id: true, fullName: true, image: true, userName: true },
        },
        likes: userId ? { where: { userId }, select: { id: true } } : false,
        bookmarks: userId ? { where: { userId }, select: { id: true } } : false,
        _count: { select: { likes: true, bookmarks: true } },
      },
    });

    // 4️⃣ Determine next cursor
    let nextCursor: string | null = null;
    if (reels.length > limit) {
      nextCursor = reels.pop()!.id;
    }

    // 5️⃣ Format response
    const data = reels.map((reel) => ({
      id: reel.id,
      caption: reel.caption,
      createdAt: reel.createdAt,
      trendingScore: reel.trendingScore,
      likedByMe: userId ? (reel.likes?.length ?? 0) > 0 : false,
      bookmarkedByMe: userId ? (reel.bookmarks?.length ?? 0) > 0 : false,
      likeCount: reel._count.likes,
      bookmarkCount: reel._count.bookmarks,
      user: reel.user,
    }));

    return ApiResponse.success('Reels fetched successfully', {
      data,
      nextCursor,
    });
  }

  async getReelById(reelId: string, userId?: string) {
    const reel = await this.prisma.reel.findFirst({
      where: { id: reelId, isDeleted: false, isHidden: false },
      select: {
        id: true,
        caption: true,
        video: true,
        duration: true,
        createdAt: true,
        user: {
          select: { id: true, fullName: true, image: true, userName: true },
        },
        likes: userId ? { where: { userId }, select: { id: true } } : false,
        bookmarks: userId ? { where: { userId }, select: { id: true } } : false,
        _count: { select: { likes: true, bookmarks: true } },
      },
    });

    if (!reel) {
      throw new BadRequestException('Reel not found');
    }

    return ApiResponse.success('Reel fetched successfully', {
      id: reel.id,
      caption: reel.caption,
      video: reel.video,
      duration: reel.duration,
      createdAt: reel.createdAt,
      likedByMe: userId ? (reel.likes?.length ?? 0) > 0 : false,
      bookmarkedByMe: userId ? (reel.bookmarks?.length ?? 0) > 0 : false,
      likeCount: reel._count.likes,
      bookmarkCount: reel._count.bookmarks,
      user: reel.user,
    });
  }

  async getCommentsFromReel(reelId: string, limit = 20, cursor?: string) {
    // 1️⃣ Cap the limit for safety
    limit = Math.min(limit, 50);

    // 2️⃣ Fetch comments with cursor pagination
    const comments = await this.prisma.reelComment.findMany({
      where: { reelId, isDeleted: false },
      take: limit + 1, // fetch one extra to determine nextCursor
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
      orderBy: { createdAt: 'desc' }, // newest first
      select: {
        id: true,
        comment: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            fullName: true,
            image: true,
          },
        },
      },
    });

    // 3️⃣ Determine next cursor
    let nextCursor: string | null = null;
    if (comments.length > limit) {
      const nextItem = comments.pop(); // remove extra item
      nextCursor = nextItem!.id;
    }

    // 4️⃣ Return structured response
    return ApiResponse.success('Comments fetched successfully', {
      data: comments,
      nextCursor,
    });
  }
}
