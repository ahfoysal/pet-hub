import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SavedPetSitterService } from './saved-pet-sitter.service';
import { CurrentUser } from 'src/common/decorators/get-user.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Pet Sitter - Saved Pet Sitter')
@Controller('saved-pet-sitter')
@UseGuards(AuthGuard)
export class SavedPetSitterController {
  constructor(private readonly savedPetSitterService: SavedPetSitterService) {}

  @Post(':petSitterId')
  @ApiOperation({ summary: '[App] Toggle pet sitter save, Role: Pet owner' })
  @ApiParam({
    name: 'petSitterId',
    type: String,
    description: 'ID of the pet sitter to save or remove from saved',
  })
  async toggleSavePetSitter(
    @Param('petSitterId') petSitterId: string,
    @CurrentUser('id') userId: string
  ) {
    return this.savedPetSitterService.toggleSavePetSitter(petSitterId, userId);
  }

  @Get()
  @ApiOperation({ summary: '[App] Get saved pet sitters, Role: Pet owner' })
  @ApiQuery({
    name: 'cursor',
    required: false,
    description:
      'The ID of the last saved pet sitter from previous page for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items to return (max 50)',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by pet sitter name, bio, designations, or languages',
  })
  async getSavedPetSitters(
    @CurrentUser('id') userId: string,
    @Query('cursor') cursor?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('search') search?: string
  ) {
    return this.savedPetSitterService.getMySavedPetSitters(
      userId,
      cursor,
      limit,
      search
    );
  }
}
