import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/get-user.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { storageConfig } from 'src/config/storage.config';
import { AddPetProfileDto, UpdatePetProfileDto } from './dto/pet-profile.dto';
import { PetProfileService } from './pet-profile.service';

@UseGuards(AuthGuard)
@ApiTags('Pet Profile')
@Controller('pet-profile')
export class PetProfileController {
  constructor(private readonly petProfileService: PetProfileService) {}

  // ---------------------------------------------------------------------------
  // Add pet profile
  // ---------------------------------------------------------------------------
  @Post()
  @ApiOperation({
    summary: '[App | PetOwner] Add a new pet profile',
    description:
      'Creates a new pet profile for the authenticated user. Requires a profile image upload (multipart/form-data).',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: AddPetProfileDto })
  @ApiResponse({ status: 201, description: 'Pet profile created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @UseInterceptors(FileInterceptor('file', { storage: storageConfig() }))
  async addPetProfile(
    @Body() payload: AddPetProfileDto,
    @CurrentUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.petProfileService.addPetProfile(payload, userId, file);
  }

  // ---------------------------------------------------------------------------
  // Get all pets of current owner (paginated)
  // ---------------------------------------------------------------------------
  @Get('my-pets')
  @ApiOperation({
    summary: '[App | PetOwner] Get all my pets',
    description:
      'Returns a paginated list of all pets owned by the authenticated user. Supports optional search by pet name, breed, or type.',
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    type: String,
    description: 'Cursor ID for pagination (last pet ID from previous page)',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search by pet name, breed, or type',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 20,
    description: 'Number of records to fetch (max 50)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of pets retrieved successfully',
  })
  async getAllMyPets(
    @CurrentUser('id') userId: string,
    @Query('cursor') cursor?: string,
    @Query('search') search?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 20
  ) {
    return this.petProfileService.getAllMyPets(userId, cursor, search, limit);
  }

  // ---------------------------------------------------------------------------
  // Get single pet profile of current owner
  // ---------------------------------------------------------------------------
  @Get('my-pets/:petId')
  @ApiOperation({
    summary: '[App | PetOwner] Get a specific pet profile',
    description:
      'Returns the full profile of a pet owned by the authenticated user by pet ID.',
  })
  @ApiParam({
    name: 'petId',
    type: String,
    description: 'Unique identifier of the pet',
  })
  @ApiResponse({
    status: 200,
    description: 'Pet profile retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Pet not found' })
  async getMyPetProfile(
    @CurrentUser('id') userId: string,
    @Param('petId') petId: string
  ) {
    return this.petProfileService.getMyPetProfile(userId, petId);
  }

  // ---------------------------------------------------------------------------
  // Get pets by owner ID (public)
  // ---------------------------------------------------------------------------
  @Get('pets-by-owner/:ownerId')
  @ApiOperation({
    summary: '[Public] Get pets by owner ID',
    description:
      'Returns a paginated list of pets owned by the specified owner. Only non-deleted pets are returned.',
  })
  @ApiParam({
    name: 'ownerId',
    type: String,
    description: 'Unique identifier of the pet owner',
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    type: String,
    description: 'Cursor ID for pagination (last pet ID from previous page)',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search by pet name, breed, or type',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 20,
    description: 'Number of records to fetch (max 50)',
  })
  @ApiResponse({ status: 200, description: 'Pets retrieved successfully' })
  async getPetsByOwnerId(
    @Param('ownerId') ownerId: string,
    @Query('cursor') cursor?: string,
    @Query('search') search?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 20
  ) {
    return this.petProfileService.getPetsByOwnerId(
      ownerId,
      cursor,
      search,
      limit
    );
  }

  // ---------------------------------------------------------------------------
  // Get a single public pet profile
  // ---------------------------------------------------------------------------
  @Get(':petId')
  @ApiOperation({
    summary: '[Public] Get a pet profile by ID',
    description:
      'Returns detailed information of a public pet profile by ID, including owner info. Only non-deleted pets are returned.',
  })
  @ApiParam({
    name: 'petId',
    type: String,
    description: 'Unique identifier of the pet',
  })
  @ApiResponse({
    status: 200,
    description: 'Public pet profile retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Pet not found' })
  async getPetById(@Param('petId') petId: string) {
    return this.petProfileService.getPetById(petId);
  }

  // ---------------------------------------------------------------------------
  // Delete a pet profile
  // ---------------------------------------------------------------------------
  @Delete(':id')
  @ApiOperation({
    summary: '[App | PetOwner] Delete a pet profile',
    description: 'Soft deletes a pet profile owned by the authenticated user.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Unique identifier of the pet',
  })
  @ApiResponse({ status: 200, description: 'Pet profile deleted successfully' })
  @ApiResponse({ status: 404, description: 'Pet not found' })
  async deletePetProfile(
    @CurrentUser('id') userId: string,
    @Param('id') petId: string
  ) {
    return this.petProfileService.deletePetProfile(userId, petId);
  }

  @Patch(':id')
  @ApiOperation({
    summary: '[App | PetOwner] Update a pet profile',
    description: 'Updates a pet profile owned by the authenticated user.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Unique identifier of the pet',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', { storage: storageConfig() }))
  @ApiBody({ type: UpdatePetProfileDto })
  @ApiResponse({ status: 200, description: 'Pet profile updated successfully' })
  @ApiResponse({ status: 404, description: 'Pet not found' })
  async updatePetProfile(
    @CurrentUser('id') userId: string,
    @Param('id') petId: string,
    @Body() updatePetProfileDto: UpdatePetProfileDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.petProfileService.updatePetProfile(
      userId,
      petId,
      updatePetProfileDto,
      file
    );
  }
}
