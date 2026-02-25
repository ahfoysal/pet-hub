import { BadRequestException, Injectable } from '@nestjs/common';
import { Post, Reel } from '@prisma/client';
import { ContentTypeEnum } from 'src/common/constants/enums';
import { ApiResponse } from 'src/common/response/api-response';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { HideContentDto } from './dto/hide-content.dto';

@Injectable()
export class HideContentService {
  constructor(private readonly prisma: PrismaService) {}

  async toggleHideContent(userId: string, payload: HideContentDto) {
    let content: Post | Reel | null = null;

    // 1️⃣ Fetch content directly (no visibility filter)
    if (payload.contentType === ContentTypeEnum.POST) {
      content = await this.prisma.post.findUnique({
        where: { id: payload.id },
      });
    } else if (payload.contentType === ContentTypeEnum.REEL) {
      content = await this.prisma.reel.findUnique({
        where: { id: payload.id },
      });
    } else {
      throw new BadRequestException('Invalid content type');
    }

    if (!content || content.isDeleted || content.isHidden) {
      throw new BadRequestException(`${payload.contentType} not found`);
    }

    if (content.userId === userId) {
      // throw new BadRequestException('You cannot hide your own content');
    }

    // 2️⃣ Transaction: toggle hide/unhide safely
    const result = await this.prisma.$transaction(async (tx) => {
      const existingHide = await tx.hiddenContent.findUnique({
        where: {
          userId_contentId_contentType: {
            userId,
            contentId: payload.id,
            contentType: payload.contentType,
          },
        },
      });

      if (existingHide) {
        await tx.hiddenContent.delete({
          where: {
            userId_contentId_contentType: {
              userId,
              contentId: payload.id,
              contentType: payload.contentType,
            },
          },
        });
        return { hidden: false };
      } else {
        await tx.hiddenContent.create({
          data: {
            userId,
            contentId: payload.id,
            contentType: payload.contentType,
          },
        });
        return { hidden: true };
      }
    });

    // 3️⃣ Clear message
    const contentName =
      payload.contentType === ContentTypeEnum.POST ? 'Post' : 'Reel';
    const action = result.hidden ? 'hidden' : 'unhidden';

    return ApiResponse.success(`${contentName} ${action} successfully`, result);
  }
}
