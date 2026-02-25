import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PetOwnerSummaryService } from './pet-owner-summary.service';
import { CurrentUser } from 'src/common/decorators/get-user.decorator';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';

@ApiTags('Pet Owner Summary')
@UseGuards(AuthGuard)
@Controller('pet-owner-summary')
export class PetOwnerSummaryController {
  constructor(
    private readonly petOwnerSummaryService: PetOwnerSummaryService
  ) {}

  @Get('bookings/summary')
  @ApiOperation({ summary: 'Get booking summary for current pet owner' })
  getBookingSummary(@CurrentUser('id') userId: string) {
    return this.petOwnerSummaryService.getBookingSummary(userId);
  }

  @Get('bookings/recent')
  @ApiOperation({ summary: 'Get recent bookings for current pet owner' })
  getRecentBookings(@CurrentUser('id') userId: string) {
    return this.petOwnerSummaryService.getRecentBookings(userId);
  }

  @Get('pet-sitters/top')
  @ApiOperation({ summary: 'Get top pet sitters for current pet owner' })
  topPetSitters(@CurrentUser('id') userId: string) {
    return this.petOwnerSummaryService.topPetSitters(userId);
  }

  @Get('top/services-packages')
  @ApiOperation({
    summary: 'Get top services and packages for current pet owner',
  })
  getTopServicesAndPackages(@CurrentUser('id') userId: string) {
    return this.petOwnerSummaryService.getTopServicesAndPackages(userId);
  }

  @Get('bookings/history')
  @ApiOperation({ summary: 'Get booking history for current pet owner' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search term for package, service, or pet sitter name',
    type: String,
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    description: 'ID of the last booking from previous page (for pagination)',
    type: String,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Maximum number of bookings to return (max 50)',
    type: Number,
  })
  getMyBookingHistory(
    @CurrentUser('id') userId: string,
    @Query('search') search?: string,
    @Query('cursor') cursor?: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number
  ) {
    const finalLimit = limit ?? 10;
    const trimmedSearch = search?.trim();

    return this.petOwnerSummaryService.getMyBookingHistory(
      userId,
      trimmedSearch,
      cursor,
      finalLimit
    );
  }

  @Get('pet-sitter/history/:id')
  @ApiOperation({ summary: 'Get booking history with a specific pet sitter' })
  @ApiParam({ name: 'id', description: 'Pet sitter ID', type: String })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of bookings to fetch (max 50)',
  })
  @ApiQuery({
    name: 'cursor',
    required: false,
    type: String,
    description: 'Cursor for pagination',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term for package, service, pet, or pet sitter name',
  })
  getPetSitterHistory(
    @CurrentUser('id') userId: string,
    @Param('id') petSitterId: string,
    @Query('limit') limit?: number,
    @Query('cursor') cursor?: string,
    @Query('search') search?: string
  ) {
    return this.petOwnerSummaryService.historyWithPetsitter(
      userId,
      petSitterId,
      limit,
      cursor,
      search
    );
  }
}
