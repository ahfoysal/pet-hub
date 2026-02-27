import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PlatformSettingsService } from './platform-settings.service';
import { PlatformSettingsDto } from './dto/platform-settings.dto';
import { CurrentUser } from 'src/common/decorators/get-user.decorator';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/types/auth.types';

@Controller('platform-settings')
@ApiTags('Admin - Platform Settings')
@UseGuards(AuthGuard)
export class PlatformSettingsController {
  constructor(
    private readonly platformSettingsService: PlatformSettingsService
  ) {}

  @Patch()
  @ApiOperation({
    summary: 'Update platform settings',
    description:
      'Updates platform-wide settings such as platform fee and commission rate. Only admins are allowed.',
  })
  @Roles(Role.ADMIN)
  async updatePlatformSettings(
    @Body() payload: PlatformSettingsDto,
    @CurrentUser('id') userId: string
  ) {
    return await this.platformSettingsService.updatePlatformSettings(payload, userId);
  }

  @Get()
  @ApiOperation({
    summary: 'Get platform settings',
    description:
      'Retrieves platform-wide settings such as platform fee and commission rate.',
  })
  async getPlatformSettings(@CurrentUser('id') userId: string) {
    return await this.platformSettingsService.getPlatformSettings(userId);
  }

  @Get('/history')
  @ApiOperation({
    summary: 'Get platform settings history',
    description:
      'Retrieves the change history of platform-wide settings including platform fee and commission rate. Supports cursor-based pagination and search.',
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    description: 'Cursor for pagination (history record ID)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of records to return (max 50)',
    example: 20,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by admin name or email',
  })
  async getPlatformSettingsHistory(
    @CurrentUser('id') userId: string,
    @Query('cursor') cursor?: string,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
    @Query('search') search?: string
  ) {
    return await this.platformSettingsService.getPlatformSettingsHistory(
      userId,
      cursor,
      limit,
      search
    );
  }
}
