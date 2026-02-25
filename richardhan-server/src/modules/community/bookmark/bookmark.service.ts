import { Injectable, NotFoundException } from '@nestjs/common';
import { ApiResponse } from 'src/common/response/api-response';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class BookmarkService {
  constructor(private readonly prisma: PrismaService) {}

  async toggleBookmarkPost(postId: string, userId: string) {
    // 1️⃣ Check post existence
    const post = await this.prisma.post.findFirst({
      where: {
        id: postId,
        isDeleted: false,
      },
      select: { id: true },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // 2️⃣ Toggle bookmark atomically
    const bookmarked = await this.prisma.$transaction(async (tx) => {
      const existing = await tx.bookmark.findUnique({
        where: {
          userId_postId_bookMarkType: {
            userId,
            postId,
            bookMarkType: 'POST',
          },
        },
      });

      if (existing) {
        await tx.bookmark.delete({
          where: { id: existing.id },
        });
        return false;
      }

      await tx.bookmark.create({
        data: {
          userId,
          postId,
          bookMarkType: 'POST',
        },
      });

      return true;
    });

    return ApiResponse.success(
      `Post ${bookmarked ? 'bookmarked' : 'bookmark removed'} successfully`,
      { bookmarked }
    );
  }

  async toggleBookmarkReel(reelId: string, userId: string) {
    // 1️⃣ Check reel existence
    const reel = await this.prisma.reel.findFirst({
      where: {
        id: reelId,
        isDeleted: false,
      },
      select: { id: true },
    });

    if (!reel) {
      throw new NotFoundException('Reel not found');
    }

    // 2️⃣ Toggle bookmark atomically
    const bookmarked = await this.prisma.$transaction(async (tx) => {
      const existing = await tx.bookmark.findUnique({
        where: {
          userId_reelId_bookMarkType: {
            userId,
            reelId,
            bookMarkType: 'REEL',
          },
        },
      });

      if (existing) {
        await tx.bookmark.delete({
          where: { id: existing.id },
        });
        return false;
      }

      await tx.bookmark.create({
        data: {
          userId,
          reelId,
          bookMarkType: 'REEL',
        },
      });

      return true;
    });

    return ApiResponse.success(
      `Reel ${bookmarked ? 'bookmarked' : 'bookmark removed'} successfully`,
      { bookmarked }
    );
  }

  async getAllMyBookmarks(
    userId: string,
    filter?: 'POST' | 'REEL',
    cursor?: string,
    limit = 20
  ) {
    limit = Math.min(limit, 50);

    const bookmarks = await this.prisma.bookmark.findMany({
      where: {
        isDeleted: false,
        userId,
        ...(filter ? { bookMarkType: filter } : {}),
      },
      take: limit + 1,
      ...(cursor && {
        skip: 1,
        cursor: { id: cursor },
      }),
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        bookMarkType: true,
        createdAt: true,

        post: {
          select: {
            id: true,
            caption: true,
            media: true,
            createdAt: true,
            isDeleted: true,
          },
        },

        reel: {
          select: {
            id: true,
            video: true,
            caption: true,
            duration: true,
            createdAt: true,
            isDeleted: true,
          },
        },
      },
    });

    // Remove soft-deleted content
    const validBookmarks = bookmarks.filter(
      (b) =>
        (b.bookMarkType === 'POST' && b.post && !b.post.isDeleted) ||
        (b.bookMarkType === 'REEL' && b.reel && !b.reel.isDeleted)
    );

    let nextCursor: string | null = null;
    if (validBookmarks.length > limit) {
      nextCursor = validBookmarks[limit - 1].id;
      validBookmarks.length = limit;
    }

    const result = {
      items: validBookmarks.map((b) => ({
        id: b.id,
        type: b.bookMarkType,
        createdAt: b.createdAt,
        post: b.post
          ? {
              id: b.post.id,
              caption: b.post.caption,
              media: b.post.media,
              createdAt: b.post.createdAt,
            }
          : null,
        reel: b.reel
          ? {
              id: b.reel.id,
              video: b.reel.video,
              caption: b.reel.caption,
              duration: b.reel.duration,
              createdAt: b.reel.createdAt,
            }
          : null,
      })),
      nextCursor,
    };

    return ApiResponse.success('Bookmarks fetched successfully', result);
  }

  async getSingleBookMark(bookmarkId: string, userId: string) {
    const bookmark = await this.prisma.bookmark.findFirst({
      where: {
        id: bookmarkId,
        userId,
        isDeleted: false,
        OR: [{ post: { isDeleted: false } }, { reel: { isDeleted: false } }],
      },
      include: {
        post: {
          select: {
            id: true,
            caption: true,
            media: true,
            createdAt: true,
          },
        },
        reel: {
          select: {
            id: true,
            video: true,
            caption: true,
            duration: true,
            createdAt: true,
          },
        },
      },
    });

    if (!bookmark) {
      throw new NotFoundException('Bookmark not found');
    }

    return ApiResponse.success('Bookmark found', bookmark);
  }

  async deleteBookmark(bookmarkId: string, userId: string) {
    const bookmark = await this.prisma.bookmark.findFirst({
      where: {
        id: bookmarkId,
        userId,
        isDeleted: false,
      },
    });

    if (!bookmark) {
      throw new NotFoundException('Bookmark not found');
    }

    await this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        isDeleted: true,
      },
    });

    return ApiResponse.success('Bookmark deleted successfully');
  }
}
