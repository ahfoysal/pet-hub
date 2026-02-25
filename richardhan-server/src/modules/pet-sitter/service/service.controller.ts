import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Param,
  Query,
  ParseIntPipe,
  Get,
  Patch,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';
import { ServiceService } from './service.service';
import { CurrentUser } from 'src/common/decorators/get-user.decorator';
import { storageConfig } from 'src/config/storage.config';
import { AuthGuard } from 'src/common/guards/auth.guard';

@UseGuards(AuthGuard)
@ApiTags('Pet Sitter - Services')
@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', { storage: storageConfig() }))
  @ApiBody({
    description: 'Create a new service with file upload',
    type: CreateServiceDto,
  })
  @ApiOperation({
    summary: '[Pet Sitter || Web] Create a new service, Role: Pet Sitter',
  })
  async createService(
    @Body() body: CreateServiceDto,
    @CurrentUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.serviceService.createService(userId, body, file);
  }

  @Get('/pet-sitter/:petSitterId')
  @ApiOperation({
    summary: '[ALL] Get all services of a pet sitter, Role: Pet Owner',
  })
  @ApiParam({
    name: 'petSitterId',
    description: 'ID of the pet sitter',
    type: 'string',
  })
  @ApiQuery({
    name: 'cursor',
    description:
      'Cursor for pagination (service ID of the last item from previous page)',
    required: false,
    type: 'string',
  })
  @ApiQuery({
    name: 'search',
    description: 'Search keyword for service name or description',
    required: false,
    type: 'string',
  })
  @ApiQuery({
    name: 'limit',
    description: 'Number of services to fetch (max 50)',
    required: false,
    type: 'number',
  })
  async getAllServicesByPetSitter(
    @CurrentUser('id') userId: string,
    @Param('petSitterId') petSitterId: string,
    @Query('cursor') cursor?: string,
    @Query('search') search?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 20
  ) {
    return this.serviceService.getAllServicesByPetSitter(
      petSitterId,
      userId,
      cursor,
      search,
      limit
    );
  }

  @Get()
  @ApiOperation({ summary: '[ALL] Get all services, Role: Pet Owner' })
  @ApiQuery({
    name: 'limit',
    description: 'Number of services to fetch (max 50)',
    required: false,
    type: 'number',
  })
  @ApiQuery({
    name: 'cursor',
    description:
      'Cursor for pagination (service ID of the last item from previous page)',
    required: false,
    type: 'string',
  })
  @ApiQuery({
    name: 'search',
    description:
      'Search keyword for service name, description, tags, or whatsIncluded',
    required: false,
    type: 'string',
  })
  @ApiQuery({
    name: 'minPrice',
    description: 'Minimum price filter',
    required: false,
    type: 'number',
  })
  @ApiQuery({
    name: 'maxPrice',
    description: 'Maximum price filter',
    required: false,
    type: 'number',
  })
  async getAllService(
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 20,
    @Query('cursor') cursor?: string,
    @Query('search') search?: string,
    @Query('minPrice', new ParseIntPipe({ optional: true })) minPrice?: number,
    @Query('maxPrice', new ParseIntPipe({ optional: true })) maxPrice?: number
  ) {
    const filters = { minPrice, maxPrice };
    return this.serviceService.getAllService(cursor, limit, search, filters);
  }

  @Get('me')
  @ApiOperation({
    summary: '[Pet Sitter || Web] Get all my services, Role: Pet Sitter',
  })
  @ApiQuery({
    name: 'limit',
    description: 'Number of services to fetch (max 50)',
    required: false,
    type: 'number',
  })
  @ApiQuery({
    name: 'cursor',
    description:
      'Cursor for pagination (service ID of the last item from previous page)',
    required: false,
    type: 'string',
  })
  @ApiQuery({
    name: 'search',
    description:
      'Search keyword for service name, description, tags or whatsIncluded',
    required: false,
    type: 'string',
  })
  async getAllMyService(
    @CurrentUser('id') userId: string,
    @Query('cursor') cursor?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 20,
    @Query('search') search?: string
  ) {
    return this.serviceService.getAllMyService(userId, cursor, limit, search);
  }

  @Get('/tags')
  @ApiOperation({ summary: 'Get all unique service tags, Role: Pet Owner' })
  @ApiQuery({
    name: 'search',
    description:
      'Optional search keyword to filter tags by service name, description, tags, or whatsIncluded',
    required: false,
    type: 'string',
  })
  async getAllTags(@Query('search') search?: string) {
    return this.serviceService.getAllServiceTags(search);
  }

  @Get(':id')
  @ApiOperation({
    summary: '[ALL] Get a service by ID, Role: Pet Owner, Pet Sitter',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique ID of the service to fetch',
    type: 'string',
  })
  async getServiceById(
    @Param('id') serviceId: string,
    @CurrentUser('id') userId: string
  ) {
    return this.serviceService.getServiceById(serviceId, userId);
  }

  @Patch(':id/toggle-availability')
  @ApiOperation({
    summary:
      '[Pet Sitter || Web] Toggle service availability, Role: Pet Sitter',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique ID of the service to toggle availability',
    type: 'string',
  })
  async toggleServiceAvailability(
    @Param('id') serviceId: string,
    @CurrentUser('id') userId: string
  ) {
    return this.serviceService.toggleServiceAvailability(userId, serviceId);
  }

  @Delete(':id')
  @ApiOperation({
    summary: '[Pet Sitter || Web] Delete a service, Role: Pet Sitter',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique ID of the service to delete',
    type: 'string',
  })
  async deleteService(
    @Param('id') serviceId: string,
    @CurrentUser('id') userId: string
  ) {
    return this.serviceService.deleteService(userId, serviceId);
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', { storage: storageConfig() }))
  @ApiBody({
    description: 'Update a service with optional file upload',
    type: UpdateServiceDto,
  })
  @ApiOperation({
    summary: '[Pet Sitter || Web] Update a service, Role: Pet Sitter',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique ID of the service to update',
    type: 'string',
  })
  async updateService(
    @Body() body: UpdateServiceDto,
    @Param('id') serviceId: string,
    @CurrentUser('id') userId: string,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.serviceService.updateService(body, userId, serviceId, file);
  }
}
