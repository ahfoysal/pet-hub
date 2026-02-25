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
import { PetSitterPackageService } from './pet-sitter-package.service';
import { CurrentUser } from 'src/common/decorators/get-user.decorator';
import {
  CreatePetSitterPackageDto,
  PackageQueryDto,
  UpdatePetSitterPackageDto,
} from './dto/pet-sitter-package.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import {
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'src/config/storage.config';

@UseGuards(AuthGuard)
@ApiTags('Pet Sitter - Package')
@Controller('pet-sitter-package')
export class PetSitterPackageController {
  constructor(
    private readonly petSitterPackageService: PetSitterPackageService
  ) {}

  @Patch('toggle/:id')
  @ApiOperation({
    summary: 'Toggle package availability status, Role: Pet Sitter',
  })
  @ApiParam({ name: 'id', type: String, description: 'Package ID' })
  async togglePackageStatus(
    @Param('id') id: string,
    @CurrentUser('id') userId: string
  ) {
    return this.petSitterPackageService.togglePackageStatus(id, userId);
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create Pet Sitter Package, Role: Pet Sitter' })
  @UseInterceptors(FileInterceptor('file', { storage: storageConfig() }))
  async createPackage(
    @CurrentUser('id') userId: string,
    @Body() payload: CreatePetSitterPackageDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.petSitterPackageService.createPackage(userId, payload, file);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get my packages as pet sitter, Role: Pet Sitter' })
  @ApiQuery({ name: 'cursor', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'durationMin', required: false, type: Number })
  @ApiQuery({ name: 'durationMax', required: false, type: Number })
  async getMyPackages(
    @CurrentUser('id') userId: string,
    @Query() query: PackageQueryDto
  ) {
    return this.petSitterPackageService.getMyPackages(userId, query);
  }

  @Get('pet-sitter/:petSitterId')
  @ApiOperation({ summary: 'Get all packages by pet sitter, Role: Pet Owner' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'durationMin', required: false, type: Number })
  @ApiQuery({ name: 'durationMax', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'cursor', required: false, type: String })
  @ApiParam({
    name: 'petSitterId',
    type: String,
    description: 'Pet sitter profile ID',
  })
  async getAllPackagesByPetSitter(
    @Param('petSitterId') petSitterId: string,

    @Query('cursor') cursor?: string,

    @Query('limit', new ParseIntPipe({ optional: true }))
    limit = 10,

    @Query('search') search?: string,

    @Query('minPrice', new ParseIntPipe({ optional: true }))
    minPrice?: number,

    @Query('maxPrice', new ParseIntPipe({ optional: true }))
    maxPrice?: number,

    @Query('durationMin', new ParseIntPipe({ optional: true }))
    durationMin?: number,

    @Query('durationMax', new ParseIntPipe({ optional: true }))
    durationMax?: number
  ) {
    return this.petSitterPackageService.getAllPackagesByPetSitter(
      petSitterId,
      cursor,
      limit,
      search,
      { minPrice, maxPrice, durationMin, durationMax }
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all packages, Role: Pet Owner' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search term to filter packages by name or description',
    type: String,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of packages to return (default 20)',
    type: Number,
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    description:
      'Cursor for pagination (use the last package ID from previous response)',
    type: String,
  })
  async getAllPackages(
    @Query('search') search?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 20,
    @Query('cursor') cursor?: string
  ) {
    const take = Number(limit) || 20;

    return this.petSitterPackageService.getAllPackages(search, take, cursor);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get package by ID, Role: Pet Owner, Pet Sitter' })
  @ApiParam({ name: 'id', type: String, description: 'Package ID' })
  async getPackageById(
    @Param('id') id: string,
    @CurrentUser('id') userId?: string
  ) {
    return this.petSitterPackageService.getPackageDetails(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update package by ID, Role: Pet Sitter' })
  @ApiParam({ name: 'id', type: String, description: 'Package ID' })
  @UseInterceptors(FileInterceptor('file', { storage: storageConfig() }))
  @ApiConsumes('multipart/form-data')
  async updatePackage(
    @Param('id') id: string,
    @Body() payload: UpdatePetSitterPackageDto,
    @CurrentUser('id') userId: string,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.petSitterPackageService.updatePackage(
      id,
      userId,
      payload,
      file
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete package by ID, Role: Pet Sitter' })
  @ApiParam({ name: 'id', type: String, description: 'Package ID' })
  async deletePackage(
    @Param('id') id: string,
    @CurrentUser('id') userId: string
  ) {
    return this.petSitterPackageService.deletePackage(userId, id);
  }
}
