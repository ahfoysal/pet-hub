import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CurrentSchool } from 'src/common/decorators/current-school.decorator';
import { CurrentUser } from 'src/common/decorators/get-user.decorator';
import { RequireVerifiedProfile } from 'src/common/decorators/require-verified-profile.decorator';
import { Roles } from 'src/common/decorators/role.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ProfileGuard } from 'src/common/guards/profile.guard';
import { VerifiedProfileGuard } from 'src/common/guards/verified-profile.guard';
import { Role } from 'src/common/types/auth.types';
import { storageConfig } from 'src/config/storage.config';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@ApiTags('Pet School Course')
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @ApiOperation({ summary: 'Create course by verified school owner' })
  @UseGuards(AuthGuard, VerifiedProfileGuard)
  @RequireVerifiedProfile()
  @UseInterceptors(FileInterceptor('image', { storage: storageConfig() }))
  @ApiConsumes('multipart/form-data')
  @Post('create')
  async createCourse(
    @Body() dto: CreateCourseDto,
    @CurrentSchool('id') schoolId: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.courseService.createCourse(schoolId, dto, file);
  }

  @ApiOperation({ summary: 'Get all courses' })
  @Get('all')
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  getAllCourses(
    @Query('search') search?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10
  ) {
    return this.courseService.getAllCourses(search, page, limit);
  }

  @ApiOperation({ summary: 'Get all courses by verified school owner' })
  @UseGuards(AuthGuard, ProfileGuard)
  @Get('my-courses')
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  getSchoolCourses(
    @CurrentSchool('id') schoolId: string,
    @Query('search') search?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return this.courseService.getSchoolCourses(schoolId, search, page, limit);
  }

  @ApiOperation({ summary: 'Get course details by id' })
  @Get('details/:courseId')
  getCourseById(@Query('courseId') courseId: string) {
    return this.courseService.getCourseById(courseId);
  }

  @UseGuards(AuthGuard, ProfileGuard)
  @RequireVerifiedProfile()
  @Get('next-schedules')
  getNextSchedules(@CurrentSchool('id') schoolId: string) {
    return this.courseService.getNextSchedules(schoolId);
  }

  @Patch(':courseId')
  @UseGuards(AuthGuard, ProfileGuard)
  @RequireVerifiedProfile()
  @UseInterceptors(FileInterceptor('image', { storage: storageConfig() }))
  @ApiConsumes('multipart/form-data')
  updateCourse(
    @Query('courseId') courseId: string,
    @CurrentSchool('id') schoolId: string,
    @Body() dto: UpdateCourseDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.courseService.updateCourse(courseId, schoolId, dto, file);
  }

  @ApiOperation({ summary: 'Delete course by id' })
  @UseGuards(AuthGuard, ProfileGuard)
  @RequireVerifiedProfile()
  @Delete(':courseId')
  deleteCourse(
    @Param('courseId') courseId: string,
    @CurrentSchool('id') schoolId: string
  ) {
    return this.courseService.deleteCourse(courseId, schoolId);
  }

  @ApiTags('Pet School Course Enrollment')
  @ApiOperation({ summary: 'Get enrolled courses by pet owner' })
  @UseGuards(AuthGuard)
  @Roles(Role.PET_OWNER)
  @Get('enrolled')
  @ApiQuery({ name: 'petId', required: false })
  getMyCourses(
    @CurrentUser('id') userId: string,
    @Query('petId') petId?: string
  ) {
    return this.courseService.getMyCourses(userId, petId);
  }
}
