import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { HideContentService } from './hide-content.service';
import { HideContentDto } from './dto/hide-content.dto';
import { CurrentUser } from 'src/common/decorators/get-user.decorator';
import { ApiOperation, ApiResponse, ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';

@ApiTags('Community - Hide Content')
@Controller('hide-content')
export class HideContentController {
  constructor(private readonly hideContentService: HideContentService) {}

  /**
   * Toggle hide/unhide for a post or reel.
   * If the content is already hidden by the user, this will unhide it.
   * If the content is not hidden yet, this will hide it.
   */
  @UseGuards(AuthGuard)
  @Post('toggle')
  @ApiOperation({
    summary: '[App] Toggle hide content',
    description:
      'Hides or unhide a post or reel for the authenticated user. ' +
      'Admin-hidden content or deleted content cannot be hidden by the user. ' +
      'Use the same endpoint to toggle between hide and unhide.',
  })
  @ApiBody({
    description: 'Payload containing content ID and type (POST or REEL)',
    type: HideContentDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Content hidden or unhidden successfully',
    schema: {
      example: { success: true, message: 'Post hidden successfully' },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid content or cannot hide globally hidden content',
  })
  async toggleHideContent(
    @CurrentUser('id') userId: string,
    @Body() payload: HideContentDto
  ) {
    return this.hideContentService.toggleHideContent(userId, payload);
  }
}
