import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentSchool } from 'src/common/decorators/current-school.decorator';
import { CurrentUser } from 'src/common/decorators/get-user.decorator';
import { Roles } from 'src/common/decorators/role.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ProfileGuard } from 'src/common/guards/profile.guard';
import { Role } from 'src/common/types/auth.types';
import { AdmissionService } from './admission.service';
import { EnrollCourseDto } from './dto/enroll-course.dto';
import { RespondAdmissionDto } from './dto/respond-admission.dto';

@ApiTags('Pet School Admission')
@Controller('course/admission')
export class AdmissionController {
  constructor(private readonly admissionService: AdmissionService) {}

  // Course enrollment
  @ApiOperation({ summary: 'Enroll in a course' })
  @UseGuards(AuthGuard)
  @Roles(Role.PET_OWNER)
  @Post()
  enroll(@Body() dto: EnrollCourseDto, @CurrentUser('id') userId: string) {
    return this.admissionService.enrollToCourse(dto, userId);
  }

  @ApiOperation({ summary: 'Get all enroll requests' })
  @UseGuards(AuthGuard, ProfileGuard)
  @Roles(Role.PET_SCHOOL)
  @Get('/requests')
  getEnrollRequests(@CurrentSchool('id') schoolId: string) {
    return this.admissionService.getEnrollRequests(schoolId);
  }

  // Get admission details
  @ApiOperation({ summary: 'Get admission details' })
  @UseGuards(AuthGuard, ProfileGuard)
  @Roles(Role.PET_SCHOOL)
  @Get('/requests/:id')
  getAdmissionDetails(@Param('id') admissionId: string) {
    return this.admissionService.getAdmissionDetails(admissionId);
  }

  @ApiOperation({ summary: 'Accept or reject course admission request' })
  @UseGuards(AuthGuard, ProfileGuard)
  @Roles(Role.PET_SCHOOL)
  @Patch('/:id/respond')
  respondToAdmission(
    @Param('id') admissionId: string,
    @Body() dto: RespondAdmissionDto,
    @CurrentSchool('id') schoolId: string
  ) {
    return this.admissionService.respondToAdmission(admissionId, dto, schoolId);
  }
}
