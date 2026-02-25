import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FacilityService } from './facility.service';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { UpdateFacilityDto } from './dto/update-facility.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { CurrentUser } from 'src/common/decorators/get-user.decorator';
import type { User } from 'src/common/types/user.type';
import { Role } from 'src/common/types/auth.types';

@ApiTags('Pet Hotel Facilities')
@Controller('pet-hotel/facilities')
export class FacilityController {
  constructor(private readonly facilityService: FacilityService) {}

  @Roles(Role.PET_HOTEL)
  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new facility (service)' })
  create(
    @Body() createFacilityDto: CreateFacilityDto,
    @CurrentUser() user: User
  ) {
    return this.facilityService.createFacility(createFacilityDto, user);
  }

  @Roles(Role.PET_HOTEL)
  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all facilities for the logged-in hotel' })
  findMyFacilities(@CurrentUser() user: User) {
    return this.facilityService.getMyFacilities(user);
  }

  @Roles(Role.PET_HOTEL)
  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a facility' })
  update(
    @Param('id') id: string,
    @Body() updateFacilityDto: UpdateFacilityDto,
    @CurrentUser() user: User
  ) {
    return this.facilityService.updateFacility(id, updateFacilityDto, user);
  }

  @Roles(Role.PET_HOTEL)
  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a facility' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.facilityService.deleteFacility(id, user);
  }
}
