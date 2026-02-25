import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ApiResponse } from 'src/common/response/api-response';
import { CloudinaryService } from 'src/common/utils/cloudinary/cloudinary.service';
import { UserInteractionService } from 'src/common/utils/user-interaction/user-interaction.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto, UpdatePostDto } from './dto/community.dto';
import { FriendshipService } from './friendship/friendship.service';
import { FriendshipRelationStatusEnum } from 'src/common/constants/enums';

@Injectable()
export class CommunityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly userInteractionService: UserInteractionService,
    private readonly friendshipService: FriendshipService
  ) {}

  async createPost(
    payload: CreatePostDto,
    userId: string,
    files?: Express.Multer.File[]
  ) {
    if (!files?.length) {
      throw new BadRequestException('File is required');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const uploadedMedia = await this.cloudinaryService.uploadPostsMedia(files);
    const mediaLinks = uploadedMedia.map((m) => m.secure_url);

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    await this.prisma.$transaction(async (prisma) => {
      const newPost = await prisma.post.create({
        data: {
          visibility: payload.visibility,
          caption: payload.caption || null,
          location: payload.location || null,
          media: mediaLinks,
          userId,
          isCommentAllowed: payload.isCommentAllowed || false,
        },
      });

      if (payload.isShareToStory) {
        const storyData = mediaLinks.map((media) => ({
          media,
          userId,
          visibility: payload.visibility,
          location: payload.location || null,
          expiresAt,
        }));
        await prisma.story.createMany({ data: storyData });
      }

      return newPost;
    });

    return ApiResponse.success('Post created successfully', {
      media: mediaLinks,
    });
  }

  async deletePost(postId: string, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId, userId, isDeleted: false },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    await this.prisma.post.update({
      where: { id: postId },
      data: { isDeleted: true },
    });

    return ApiResponse.success('Post deleted successfully');
  }

  async toggleLike(postId: string, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId, isDeleted: false },
    });
    if (!post) throw new NotFoundException('Post not found');

    const like = await this.prisma.postLike.findUnique({
      where: { postId_userId: { postId, userId } },
    });

    if (like) {
      await this.prisma.postLike.delete({
        where: { postId_userId: { postId, userId } },
      });
    } else {
      await this.prisma.postLike.create({ data: { postId, userId } });
    }

    // Return current like count
    const likeCount = await this.prisma.postLike.count({ where: { postId } });

    return ApiResponse.success(
      like ? 'Like removed successfully' : 'Like added successfully',
      { likeCount }
    );
  }

  async editPost(
    postId: string,
    payload: UpdatePostDto,
    userId: string,
    files?: Express.Multer.File[]
  ) {
    const MAX_MEDIA = 10; // maximum allowed media per post

    // Find the post and ensure it belongs to the user
    const post = await this.prisma.post.findUnique({
      where: { id: postId, userId, isDeleted: false },
    });

    if (!post || post.userId !== userId) {
      throw new NotFoundException('Post not found');
    }

    // Remove media links if requested
    let updatedMedia = post.media.filter(
      (media) => !payload.removedMediaLinks?.includes(media)
    );

    if (payload.removedMediaLinks?.length) {
      await this.cloudinaryService.deleteMultipleFiles(
        payload.removedMediaLinks
      );
    }

    // Check if adding new files exceeds MAX_MEDIA
    const totalMediaCount = updatedMedia.length + (files?.length || 0);
    if (totalMediaCount > MAX_MEDIA) {
      throw new BadRequestException(
        `You can only upload up to ${MAX_MEDIA} media items per post`
      );
    }

    // Upload new files using your existing utility (handles images/videos and cleanup)
    if (files?.length) {
      const uploadedMedia =
        await this.cloudinaryService.uploadPostsMedia(files);
      const uploadedLinks = uploadedMedia.map((m) => m.secure_url);
      updatedMedia = [...updatedMedia, ...uploadedLinks];
    }

    // Update the post in a single Prisma call
    const updatedPost = await this.prisma.post.update({
      where: { id: postId },
      data: {
        caption: payload.caption ?? post.caption,
        location: payload.location ?? post.location,
        visibility: payload.visibility ?? post.visibility,
        media: updatedMedia,
        isCommentAllowed: payload.isCommentAllowed ?? post.isCommentAllowed,
      },
    });

    return ApiResponse.success('Post updated successfully', updatedPost);
  }

  async getAllPosts(userId?: string, limit = 20, cursor?: string) {
    const TRENDING_DAYS = 14;
    limit = Math.min(limit, 50);

    const since = new Date();
    since.setDate(since.getDate() - TRENDING_DAYS);

    // 1️⃣ Get friend IDs (only if viewer exists)
    let friendIds: string[] = [];
    if (userId) {
      const friendships = await this.prisma.friendship.findMany({
        where: {
          status: 'ACTIVE',
          OR: [{ userAId: userId }, { userBId: userId }],
        },
        select: { userAId: true, userBId: true },
      });
      friendIds = friendships.map((f) =>
        f.userAId === userId ? f.userBId : f.userAId
      );
    }

    // 2️⃣ Build WHERE clause
    const where: Prisma.PostWhereInput = {
      isDeleted: false,
      isHidden: false,
      createdAt: { gte: since },
      OR: [
        ...(userId ? [{ userId }] : []),
        { visibility: 'PUBLIC' },
        ...(friendIds.length ? [{ userId: { in: friendIds } }] : []),
      ],
    };

    // 3️⃣ Apply NOT filters if viewer exists
    if (userId) {
      const notFilters =
        await this.userInteractionService.getVisibilityFilters<Prisma.PostWhereInput>(
          userId,
          'POST'
        );
      if (notFilters.length) where.NOT = notFilters;
    }

    // 4️⃣ Fetch posts with cursor pagination
    const posts = await this.prisma.post.findMany({
      where,
      take: limit + 1,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
      orderBy: [
        { trendingScore: 'desc' },
        { createdAt: 'desc' },
        { id: 'desc' },
      ],
      select: {
        id: true,
        caption: true,
        location: true,
        media: true,
        createdAt: true,
        trendingScore: true,
        visibility: true,
        user: {
          select: { id: true, fullName: true, image: true, userName: true },
        },
      },
    });

    // 5️⃣ Handle pagination cursor
    let nextCursor: string | null = null;
    if (posts.length > limit) nextCursor = posts.pop()!.id;

    const postIds = posts.map((p) => p.id);
    const authorIds = [...new Set(posts.map((p) => p.user.id))];

    // 6️⃣ Bulk fetch likes, comments, user interactions (only if viewer exists)
    const [likesGrouped, commentsGrouped, userLikes, userBookmarks] =
      await Promise.all([
        this.prisma.postLike.groupBy({
          by: ['postId'],
          _count: { postId: true },
          where: { postId: { in: postIds } },
        }),
        this.prisma.comment.groupBy({
          by: ['postId'],
          _count: { postId: true },
          where: {
            postId: { in: postIds },
            isDeleted: false,
            parentCommentId: null,
          },
        }),
        userId
          ? this.prisma.postLike.findMany({
              where: { postId: { in: postIds }, userId },
              select: { postId: true },
            })
          : Promise.resolve([]),
        userId
          ? this.prisma.bookmark.findMany({
              where: { postId: { in: postIds }, userId },
              select: { postId: true },
            })
          : Promise.resolve([]),
      ]);

    const likesMap = Object.fromEntries(
      likesGrouped.map((l) => [l.postId, l._count.postId])
    );
    const commentsMap = Object.fromEntries(
      commentsGrouped.map((c) => [c.postId, c._count.postId])
    );
    const userLikesSet = new Set(userLikes.map((l) => l.postId));
    const userBookmarksSet = new Set(userBookmarks.map((b) => b.postId));

    // 7️⃣ Bulk fetch friendship status (only if viewer exists)
    const friendshipStatusMap =
      userId && authorIds.length
        ? await this.friendshipService.checkFriendShipStatus(userId, authorIds)
        : {};

    // 8️⃣ Map response
    const items = posts.map((post) => ({
      id: post.id,
      caption: post.caption,
      location: post.location,
      media: post.media,
      createdAt: post.createdAt,
      user: post.user,
      isLiked: userId ? userLikesSet.has(post.id) : false,
      isSaved: userId ? userBookmarksSet.has(post.id) : false,
      likeCount: likesMap[post.id] ?? 0,
      commentCount: commentsMap[post.id] ?? 0,
      visibility: post.visibility,
      friendShipStatus: userId
        ? (friendshipStatusMap[post.user.id] ??
          FriendshipRelationStatusEnum.NONE)
        : FriendshipRelationStatusEnum.NONE,
    }));

    return ApiResponse.success('Posts fetched successfully', {
      items,
      nextCursor,
    });
  }

  async getSinglePost(postId: string, userId?: string) {
    const post = await this.prisma.post.findFirst({
      where: { id: postId, isDeleted: false },
      select: {
        id: true,
        caption: true,
        location: true,
        media: true,
        createdAt: true,
        visibility: true,
        user: {
          select: { id: true, fullName: true, image: true, userName: true },
        },
        _count: {
          select: {
            likes: true,
            comments: { where: { isDeleted: false, parentCommentId: null } },
            bookmarks: true,
          },
        },
        likes: userId
          ? {
              where: { userId },
              select: {
                id: true,
                user: { select: { id: true, fullName: true, image: true } },
              },
            }
          : false,
        bookmarks: userId ? { where: { userId }, select: { id: true } } : false,
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Single friendship status string
    const friendShipMap = userId
      ? await this.friendshipService.checkFriendShipStatus(userId, [
          post.user.id,
        ])
      : {};

    // Extract the status for the single user, default to NONE
    const friendShipStatus =
      friendShipMap[post.user.id] ?? FriendshipRelationStatusEnum.NONE;

    return ApiResponse.success('Post fetched successfully', {
      id: post.id,
      caption: post.caption,
      location: post.location,
      media: post.media,
      createdAt: post.createdAt,
      author: post.user,
      likeCount: post._count.likes,
      commentCount: post._count.comments,
      bookmarkCount: post._count.bookmarks,
      visibility: post.visibility,
      isLiked: userId ? post.likes.length > 0 : false,
      isSaved: userId ? post.bookmarks.length > 0 : false,
      friendShipStatus, // just a single string
    });
  }

  async getPostLikedBy(postId: string) {
    const likedBy = await this.prisma.user.findMany({
      where: {
        postLikes: {
          some: { postId }, // relation from PostLike
        },
      },
      select: { id: true, fullName: true, image: true },
    });

    return ApiResponse.success('Post liked by fetched successfully', {
      likedBy,
    });
  }
}
