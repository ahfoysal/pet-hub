import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PetSitterBookingService } from './pet-sitter-booking.service';
import {
  CreatePetSitterBookingDto,
  RequestToCompleteDto,
} from './dto/pet-sitter-booking.dto';
import {
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/get-user.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { PetSitterBookingStatus } from '@prisma/client';
import { PetSitterBookingTypeEnum } from 'src/common/constants/enums';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'src/config/storage.config';

@UseGuards(AuthGuard)
@ApiTags('Pet Sitter - Booking')
@Controller('pet-sitter-booking')
export class PetSitterBookingController {
  constructor(
    private readonly petSitterBookingService: PetSitterBookingService
  ) {}

  @Post('create')
  @ApiOperation({ summary: 'Create Pet Sitter Booking, Role: Pet Owner' })
  async createBooking(
    @CurrentUser('id') userId: string,
    @Body() dto: CreatePetSitterBookingDto
  ) {
    return this.petSitterBookingService.createBooking(userId, dto);
  }

  @Get('pet-owner/my-bookings')
  @ApiOperation({ summary: 'Get My Pet Owner Bookings, Role: Pet Owner' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
    example: 20,
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    type: String,
    description: 'Cursor for pagination',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: PetSitterBookingStatus,
    description: 'Filter by booking status',
  })
  @ApiQuery({
    name: 'bookingType',
    required: false,
    enum: PetSitterBookingTypeEnum,
    description: 'Filter by booking type',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search by pet name or pet sitter name',
  })
  @ApiResponse({ status: 200, description: 'List of bookings returned.' })
  async getMyBookingsAsPetOwner(
    @CurrentUser('id') userId: string,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('cursor') cursor?: string,
    @Query('status') status?: PetSitterBookingStatus,
    @Query('bookingType') bookingType?: PetSitterBookingTypeEnum,
    @Query('search') search?: string
  ) {
    limit = Math.min(limit, 50);
    return this.petSitterBookingService.getMyBookingsAsPetOwner(
      userId,
      cursor,
      limit,
      { status, bookingType },
      search
    );
  }

  @Get('pet-sitter/my-bookings')
  @ApiOperation({ summary: 'Get My Pet Sitter Bookings. Role: Pet Sitter' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
    example: 20,
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    type: String,
    description: 'Cursor for pagination',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: PetSitterBookingStatus,
    description: 'Filter by booking status',
  })
  @ApiQuery({
    name: 'bookingType',
    required: false,
    enum: PetSitterBookingTypeEnum,
    description: 'Filter by booking type',
  })
  @ApiResponse({ status: 200, description: 'List of bookings returned.' })
  async getMyBookingsAsPetSitter(
    @CurrentUser('id') userId: string,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('cursor') cursor?: string,
    @Query('status') status?: PetSitterBookingStatus,
    @Query('bookingType') bookingType?: PetSitterBookingTypeEnum
  ) {
    limit = Math.min(limit, 50);
    return this.petSitterBookingService.getMyBookingsAsPetSitter(
      userId,
      cursor,
      limit,
      { status, bookingType }
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Booking Details by ID, Role: Pet Owner, Pet Sitter',
  })
  @ApiParam({ name: 'id', type: String, description: 'Booking ID' })
  @ApiResponse({ status: 200, description: 'Booking details returned.' })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  async getBookingDetailsForOwner(@Param('id') bookingId: string) {
    return this.petSitterBookingService.getBookingDetails(bookingId);
  }

  @Patch(':id/confirm')
  @ApiOperation({ summary: 'Confirm booking as pet sitter' })
  @ApiParam({ name: 'id', type: String, description: 'Booking ID' })
  @ApiResponse({ status: 200, description: 'Booking confirmed successfully.' })
  @ApiResponse({
    status: 404,
    description: 'Booking not found or not allowed.',
  })
  async confirmBooking(
    @Param('id') bookingId: string,
    @CurrentUser('id') userId: string
  ) {
    return this.petSitterBookingService.confirmBooking(bookingId, userId);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel a booking (pet sitter or pet owner)' })
  @ApiParam({ name: 'id', type: String, description: 'Booking ID' })
  @ApiResponse({ status: 200, description: 'Booking canceled successfully.' })
  @ApiResponse({
    status: 404,
    description: 'Booking not found or not allowed.',
  })
  async cancelBooking(
    @Param('id') bookingId: string,
    @CurrentUser('id') userId: string
  ) {
    return this.petSitterBookingService.cancelBooking(bookingId, userId);
  }

  @Patch(':id/in-progress')
  @ApiOperation({ summary: 'Mark booking as in progress (pet sitter)' })
  @ApiParam({ name: 'id', type: String, description: 'Booking ID' })
  @ApiResponse({ status: 200, description: 'Booking marked as in progress.' })
  @ApiResponse({
    status: 404,
    description: 'Booking not found or not allowed.',
  })
  async markAsInProgress(
    @Param('id') bookingId: string,
    @CurrentUser('id') userId: string
  ) {
    return this.petSitterBookingService.markAsInProgress(bookingId, userId);
  }

  @Patch(':id/request-to-complete')
  @ApiOperation({ summary: 'Request to complete booking (pet sitter)' })
  @ApiParam({ name: 'id', type: String, description: 'Booking ID' })
  @ApiResponse({
    status: 200,
    description: 'Completion request sent successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'No files provided or invalid request.',
  })
  @ApiResponse({
    status: 404,
    description:
      'Booking not found or you are not allowed to request completion.',
  })
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'files', maxCount: 10 }], {
      storage: storageConfig('pet-sitter-booking-completion-proof'),
    })
  )
  @ApiConsumes('multipart/form-data')
  async requestToComplete(
    @Param('id') bookingId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: RequestToCompleteDto,
    @UploadedFiles() files: { files?: Express.Multer.File[] }
  ) {
    // Ensure files exist from the uploaded object
    const uploadedFiles = files.files ?? [];

    return this.petSitterBookingService.requestToComplete(
      bookingId,
      userId,
      dto,
      uploadedFiles
    );
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: 'Complete booking (pet owner)' })
  @ApiParam({ name: 'id', type: String, description: 'Booking ID' })
  @ApiResponse({ status: 200, description: 'Booking completed successfully.' })
  @ApiResponse({
    status: 404,
    description: 'Booking not found or not allowed.',
  })
  async completeBooking(
    @Param('id') bookingId: string,
    @CurrentUser('id') userId: string
  ) {
    return this.petSitterBookingService.completeBooking(bookingId, userId);
  }

  @Get('pet/:petId')
  @ApiOperation({
    summary: 'Get booking history by pet ID, Role: Pet Owner',
    description:
      'Returns paginated booking history for a specific pet owned by the current user',
  })
  @ApiParam({
    name: 'petId',
    description: 'Pet ID',
    required: true,
    type: String,
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    description: 'Cursor for pagination (last booking ID from previous page)',
    type: String,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of records to return (default: 20)',
    type: Number,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by service name or pet sitter name',
    type: String,
  })
  async getBookingsByPetId(
    @Param('petId') petId: string,
    @CurrentUser('id') userId: string,
    @Query('cursor') cursor?: string,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
    @Query('search') search?: string
  ) {
    return this.petSitterBookingService.getMyPetsBookingHistoryByPetId(
      userId,
      petId,
      cursor,
      limit,
      search
    );
  }
}
