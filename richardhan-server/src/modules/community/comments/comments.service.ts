import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateCommentDto, UpdateCommentDto } from './dto/comments.dto';
import { ApiResponse } from 'src/common/response/api-response';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async addComment(payload: CreateCommentDto, postId: string, userId: string) {
    // 1️⃣ Validate user
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // 2️⃣ Validate post
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: {
        id: true,
        isDeleted: true,
        visibility: true,
        userId: true,
        isCommentAllowed: true,
      },
    });

    if (!post || post.isDeleted) {
      throw new NotFoundException('Post not found ');
    }

    if (post.visibility === 'PRIVATE' && post.userId !== userId) {
      throw new ForbiddenException(
        'You are not allowed to comment on this post'
      );
    }

    if (!post.isCommentAllowed) {
      throw new ForbiddenException('Comments are disabled on this post');
    }

    if (post.visibility === 'FRIENDS') {
      const isFriend = await this.prisma.friendship.findFirst({
        where: {
          status: 'ACTIVE',
          OR: [
            { userAId: userId, userBId: post.userId },
            { userAId: post.userId, userBId: userId },
          ],
        },
      });
      if (!isFriend) {
        throw new ForbiddenException('You can only comment on friends’ posts');
      }
    }

    // 3️⃣ Create comment
    const comment = await this.prisma.comment.create({
      data: {
        content: payload.content,
        userId,
        postId,
        parentCommentId: null,
      },
      include: {
        user: { select: { id: true, fullName: true, image: true } },
      },
    });

    return ApiResponse.success('Comment added successfully', comment);
  }

  async addReply(payload: CreateCommentDto, commentId: string, userId: string) {
    // 1️⃣ Validate user
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('User not found');

    // 2️⃣ Validate parent comment
    const parentComment = await this.prisma.comment.findFirst({
      where: { id: commentId, isDeleted: false },
    });
    if (!parentComment) throw new NotFoundException('Comment not found');

    // 3️⃣ Create reply
    const reply = await this.prisma.comment.create({
      data: {
        content: payload.content,
        userId,
        postId: parentComment.postId, // inherit postId from parent
        parentCommentId: commentId,
      },
    });

    return ApiResponse.success('Reply added successfully', reply);
  }

  async editComment(
    commentId: string,
    userId: string,
    payload: UpdateCommentDto
  ) {
    // 1️⃣ Validate user
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('User not found');

    // 2️⃣ Validate comment
    const comment = await this.prisma.comment.findFirst({
      where: { id: commentId, isDeleted: false },
    });
    if (!comment) throw new NotFoundException('Comment not found');

    // 3️⃣ Check ownership (optional but recommended)
    if (comment.userId !== userId) {
      throw new ForbiddenException('You are not allowed to edit this comment');
    }

    // 4️⃣ Update comment
    const updatedComment = await this.prisma.comment.update({
      where: { id: commentId },
      data: {
        content: payload.content, // assuming validation ensures content is present
      },
    });

    return ApiResponse.success('Comment updated successfully', updatedComment);
  }

  async deleteComment(commentId: string, userId: string) {
    // 1️⃣ Validate user
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('User not found');

    // 2️⃣ Get comment
    const comment = await this.prisma.comment.findFirst({
      where: { id: commentId, isDeleted: false },
    });
    if (!comment) throw new NotFoundException('Comment not found');

    // 3️⃣ Get post
    const post = await this.prisma.post.findUnique({
      where: { id: comment.postId },
    });
    if (!post) throw new NotFoundException('Post not found');

    // 4️⃣ Authorization
    const isCommentAuthor = comment.userId === userId;
    const isPostAuthor = post.userId === userId;

    if (!isCommentAuthor && !isPostAuthor) {
      throw new ForbiddenException(
        'You are not allowed to delete this comment'
      );
    }

    // 5️⃣ Transaction (atomic delete)
    await this.prisma.$transaction([
      this.prisma.comment.update({
        where: { id: commentId },
        data: { isDeleted: true },
      }),
      this.prisma.comment.updateMany({
        where: {
          parentCommentId: commentId,
          isDeleted: false,
        },
        data: { isDeleted: true },
      }),
    ]);

    return ApiResponse.success('Comment and replies deleted successfully');
  }

  async toggleLikeComment(commentId: string, userId: string) {
    // Check if comment exists and is not deleted
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
      select: { id: true, isDeleted: true },
    });

    if (!comment || comment.isDeleted) {
      throw new NotFoundException('Comment not found');
    }

    const existingLike = await this.prisma.commentLike.findUnique({
      where: { commentId_userId: { commentId, userId } },
    });

    if (existingLike) {
      await this.prisma.commentLike.delete({
        where: { commentId_userId: { commentId, userId } },
      });
    } else {
      await this.prisma.commentLike.create({
        data: { commentId, userId },
      });
    }

    const likeCount = await this.prisma.commentLike.count({
      where: { commentId },
    });

    return ApiResponse.success(
      existingLike ? 'Like removed successfully' : 'Like added successfully',
      { likeCount }
    );
  }

  async getCommentsByPostId(
    postId: string,
    userId?: string,
    limit = 10,
    cursor?: string // optional cursor
  ) {
    limit = Math.min(limit, 20);

    const post = await this.prisma.post.findFirst({
      where: { id: postId, isDeleted: false },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const comments = await this.prisma.comment.findMany({
      where: { postId, parentCommentId: null, isDeleted: false },
      orderBy: { createdAt: 'desc' }, // keep newest first
      take: limit + 1, // fetch one extra to check if there is a next page
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0, // skip the cursor itself
      include: {
        user: { select: { id: true, fullName: true, image: true } },
        replies: {
          where: { isDeleted: false },
          orderBy: { createdAt: 'asc' },
          include: {
            user: { select: { id: true, fullName: true, image: true } },
            commentLikes: userId ? { where: { userId } } : false,
          },
        },
        commentLikes: userId ? { where: { userId } } : false,
      },
    });

    // Determine next cursor
    let nextCursor: string | null = null;
    if (comments.length > limit) {
      const nextComment = comments.pop(); // remove extra record
      nextCursor = nextComment!.id;
    }

    // Format response
    const formatted = comments.map((c) => ({
      id: c.id,
      content: c.content,
      createdAt: c.createdAt,
      author: c.user,
      replies: c.replies.map((r) => ({
        id: r.id,
        content: r.content,
        createdAt: r.createdAt,
        author: r.user,
        likeCount: r.commentLikes?.length ?? 0,
        isLiked: (r.commentLikes?.length ?? 0) > 0,
      })),
      replyCount: c.replies.length,
      likeCount: c.commentLikes?.length ?? 0,
      isLiked: (c.commentLikes?.length ?? 0) > 0,
    }));

    return ApiResponse.success('Comments fetched successfully', {
      comments: formatted,
      nextCursor,
    });
  }
}
