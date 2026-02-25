import {
  Controller,
  Post,
  UseGuards,
  Body,
  Get,
  Param,
  Query,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { PetSitterService } from './pet-sitter.service';
import { CurrentUser } from 'src/common/decorators/get-user.decorator';
import {
  CreatePetSitterProfileDto,
  UpdatePetSitterProfileDto,
} from './dto/pet-sitter-profile.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { PetSitterStatus } from '@prisma/client';

@ApiTags('Pet Sitter')
@UseGuards(AuthGuard)
@Controller('pet-sitter')
export class PetSitterController {
  constructor(private readonly petSitterService: PetSitterService) {}

  @Post('create')
  @ApiOperation({
    summary: '[Web] Create or update pet sitter profile, Role: Pet Owner',
  })
  @ApiBody({ type: CreatePetSitterProfileDto })
  async createPetSitterProfile(
    @CurrentUser('id') userId: string,
    @Body() payload: CreatePetSitterProfileDto
  ) {
    return this.petSitterService.createPetSitterProfile(userId, payload);
  }

  @Get()
  @ApiOperation({
    summary: '[Web || APP] Get all pet sitter profiles, Role: Pet Owner',
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    description: 'Cursor for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items to fetch (max 50)',
    type: Number,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search term (name, bio, designations, languages)',
  })
  @ApiQuery({
    name: 'filter',
    required: false,
    description: 'Filter by pet sitter status',
    enum: PetSitterStatus,
  })
  async getAllPetSitters(
    @CurrentUser('id') userId: string,
    @Query('cursor') cursor?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('search') search?: string,
    @Query('filter') filter?: PetSitterStatus
  ) {
    return this.petSitterService.getAllPetSitterProfiles(
      userId,
      cursor,
      limit,
      search,
      filter
    );
  }

  @Get('me')
  @ApiOperation({
    summary: '[Web || APP] Get my pet sitter profile, Role: Pet Sitter',
  })
  async getPetSitterProfile(@CurrentUser('id') userId: string) {
    return this.petSitterService.getMyPetSitterProfile(userId);
  }

  @Get(':id')
  @ApiOperation({
    summary:
      '[Web || APP] Get single pet sitter profile by ID, Role: Pet Owner',
  })
  @ApiParam({
    name: 'id',
    description: 'Pet sitter profile ID',
    type: 'string',
  })
  async getSinglePetSitter(
    @CurrentUser('id') userId: string,
    @Param('id') petProfileId: string
  ) {
    return this.petSitterService.getSinglePetSitterProfile(
      userId,
      petProfileId
    );
  }

  @Patch(':id')
  @ApiOperation({
    summary: '[Web||APP] Change pet sitter profile status, Role: Pet Sitter',
  })
  @ApiParam({
    name: 'id',
    description: 'Pet sitter profile ID',
    type: 'string',
  })
  async changePetSitterStatus(
    @CurrentUser('id') userId: string,
    @Param('id') petProfileId: string,
    @Body('status') status: PetSitterStatus
  ) {
    return this.petSitterService.changePetSitterStatus(
      userId,
      petProfileId,
      status
    );
  }

  @Patch('/update-profile')
  @ApiOperation({
    summary: 'Update pet sitter profile details, Role: Pet Sitter',
    description: `Update the profile of the authenticated pet sitter. You can provide any of the following optional fields: designation, bio, years of experience, languages, street address, city, country, and postal code. Only fields included in the request will be updated; unspecified fields will remain unchanged.`,
  })
  @ApiBody({ type: UpdatePetSitterProfileDto })
  async updatePetSitterProfile(
    @CurrentUser('id') userId: string,
    @Body() payload: UpdatePetSitterProfileDto
  ) {
    return this.petSitterService.updatePetSitterProfile(userId, payload);
  }
}
