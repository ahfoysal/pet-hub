import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ApiResponse } from 'src/common/response/api-response';
import { CloudinaryService } from 'src/common/utils/cloudinary/cloudinary.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CourseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  async createCourse(
    schoolId: string,
    dto: CreateCourseDto,
    file: Express.Multer.File
  ) {
    const trainer = await this.prisma.employee.findUnique({
      where: {
        id: dto.trainerId,
        petSchoolId: schoolId,
      },
    });
    if (!trainer) throw new NotFoundException('Trainer not found');
    const uploadedFiles = await this.cloudinaryService.uploadFile(file);
    const imageUrl = uploadedFiles.secure_url;

    return this.prisma.$transaction(async (tx) => {
      const course = await tx.course.create({
        data: {
          schoolId,
          name: dto.name,
          details: dto.details,
          courseFor: dto.courseFor,
          courseLevel: dto.courseLevel,
          courseObjective: dto.courseObjective,
          outcomes: dto.outcomes,
          discount: dto.discount,
          duration: dto.duration,
          classPerWeek: dto.classPerWeek,
          price: dto.price,
          startDate: new Date(dto.startDate),
          endDate: new Date(dto.endDate),
          trainerId: dto.trainerId,
          thumbnailImg: imageUrl,
          location: dto.location,
        },
      });

      await tx.courseSchedule.createMany({
        data: dto.schedules.map((s) => ({
          courseId: course.id,
          days: s.days,
          time: s.time,
          totalSeats: s.totalSeats,
          availableSeats: s.totalSeats,
        })),
      });
      return ApiResponse.success('Course created successfully', {
        course,
      });
    });
  }

  async getAllCourses(search?: string, page: number = 1, limit: number = 10) {
    const numberedPage = Number(page);
    const numberedLimit = Number(limit);
    const skip = (numberedPage - 1) * numberedLimit;

    const where: Prisma.CourseWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { details: { contains: search, mode: 'insensitive' } },
            { courseFor: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        skip,
        take: numberedLimit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          school: {
            select: {
              id: true,
              name: true,
              rating: true,
            },
          },
          trainer: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),

      this.prisma.course.count({ where }),
    ]);

    return ApiResponse.success('Courses found', {
      data: courses,
      meta: {
        total,
        page: numberedPage,
        limit: numberedLimit,
        totalPages: Math.ceil(total / limit),
      },
    });
  }

  async getCourseById(courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        trainer: {
          select: {
            id: true,
            name: true,
          },
        },
        schedules: true,
        school: {
          select: {
            id: true,
            name: true,
            rating: true,
          },
        },
      },
    });

    return ApiResponse.success('Course found', course);
  }

  async getSchoolCourses(
    schoolId: string,
    search?: string,
    page = 1,
    limit = 10
  ) {
    const numberedPage = Number(page);
    const numberedLimit = Number(limit);
    const skip = (numberedPage - 1) * numberedLimit;

    const where: Prisma.CourseWhereInput = {
      schoolId,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { details: { contains: search, mode: 'insensitive' } },
          { courseFor: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        skip,
        take: numberedLimit,
        orderBy: { createdAt: 'desc' },
        include: {
          trainer: {
            select: {
              id: true,
              name: true,
            },
          },
          schedules: true,
        },
      }),

      this.prisma.course.count({ where }),
    ]);

    const formattedCourses = this.formatCourse(courses);

    return ApiResponse.success('Courses found', {
      data: formattedCourses,
      meta: {
        total,
        page: numberedPage,
        limit: numberedLimit,
        totalPages: Math.ceil(total / limit),
      },
    });
  }

  formatCourse(courses: any[]) {
    return courses.map((course) => {
      const totalSeats = course.schedules.reduce(
        (total, schedule) => schedule.totalSeats + total,
        0
      );

      const totalEnrolled = course.schedules.reduce(
        (total, schedule) =>
          schedule.totalSeats - schedule.availableSeats + total,
        0
      );

      return {
        ...course,
        totalSeats,
        totalEnrolled,
      };
    });
  }

  async getNextSchedules(schoolId: string) {
    const schedules = await this.prisma.courseSchedule.findMany({
      where: {
        course: { schoolId },
      },
      include: {
        course: {
          select: { name: true },
        },
      },
    });

    const nextDays = this.getNext7Days();

    const result = nextDays.map((day) => {
      const matches = schedules.filter((s) => s.days.includes(day.weekday));

      return {
        date: day.date,
        weekday: day.weekday,
        schedules: matches.map((m) => ({
          courseName: m.course.name,
          time: m.time,
          availableSeats: m.availableSeats,
          totalSeats: m.totalSeats,
        })),
      };
    });

    return ApiResponse.success('Next schedules found', result);
  }

  getNext7Days() {
    const days: { date: Date; weekday: string }[] = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);

      days.push({
        date: d,
        weekday: d.toLocaleDateString('en-US', { weekday: 'long' }),
      });
    }

    return days;
  }

  async updateCourse(
    courseId: string,
    schoolId: string,
    dto: UpdateCourseDto,
    file?: Express.Multer.File
  ) {
    if (file) {
      const uploadedFiles = await this.cloudinaryService.uploadFile(file);
      dto.image = uploadedFiles.secure_url;
    }

    const course = await this.prisma.course.findUnique({
      where: { id: courseId, schoolId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const updateCourseData = {
      name: dto.name ?? course.name,
      details: dto.details ?? course.details,
      courseFor: dto.courseFor ?? course.courseFor,
      discount: dto.discount ?? course.discount,
      duration: dto.duration ?? course.duration,
      price: dto.price ?? course.price,
      trainerId: dto.trainerId ?? course.trainerId,
      thumbnailImg: dto.image ?? course.thumbnailImg,
      startDate: dto.startDate ? new Date(dto.startDate) : course.startDate,
      endDate: dto.endDate ? new Date(dto.endDate) : course.endDate,
      location: dto.location ?? course.location,
      courseLevel: dto.courseLevel ?? course.courseLevel,
      outcomes: dto.outcomes ?? course.outcomes,
      classPerWeek: dto.classPerWeek ?? course.classPerWeek,
      courseObjective: dto.courseObjective ?? course.courseObjective,
    };

    const updatedCourse = await this.prisma.course.update({
      where: { id: courseId, schoolId },
      data: updateCourseData,
    });

    return ApiResponse.success('Course updated successfully', updatedCourse);
  }

  async deleteCourse(courseId: string, schoolId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId, schoolId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    await this.prisma.course.delete({
      where: { id: courseId, schoolId },
    });

    return ApiResponse.success('Course deleted successfully', {
      courseId: course.id,
    });
  }

  async getMyCourses(userId: string, petProfileId?: string) {
    const enrollments = await this.prisma.courseUser.findMany({
      where: {
        userId,
        ...(petProfileId && { petProfileId }),
      },
      include: {
        petProfile: {
          select: { id: true, petName: true },
        },
        course: {
          include: {
            school: {
              select: { id: true, name: true },
            },
            trainer: {
              select: { id: true, name: true },
            },
          },
        },
        schedule: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return ApiResponse.success('Enrolled courses found', enrollments);
  }
}
