import { Injectable } from '@nestjs/common';
import { ApiResponse } from 'src/common/response/api-response';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats(schoolId: string) {
    const now = new Date();

    // total pets enrolled
    const totalPetsEnrolled = await this.prisma.courseUser.findMany({
      where: {
        course: {
          schoolId,
        },
      },
      distinct: ['petProfileId'],
      select: {
        petProfileId: true,
      },
    });

    const totalPetsCount = totalPetsEnrolled.length;

    // active courses
    const activeCourses = await this.prisma.course.count({
      where: {
        schoolId,
        startDate: { lte: now },
        endDate: { gte: now },
      },
    });

    // Ongoing enrollments
    const ongoingEnrollments = await this.prisma.courseUser.count({
      where: {
        course: {
          schoolId,
          startDate: { lte: now },
          endDate: { gte: now },
        },
      },
    });

    // Available seats today
    const courses = await this.prisma.course.findMany({
      where: {
        schoolId,
        startDate: { lte: now },
        endDate: { gte: now },
      },
      select: {
        id: true,
        schedules: {
          select: {
            availableSeats: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });
    const availableSeatsToday = courses.reduce((total, course) => {
      const availableSeats = course.schedules.reduce(
        (sum, schedule) => sum + schedule.availableSeats,
        0
      );

      return total + availableSeats;
    }, 0);

    return ApiResponse.success('Dashboard stats fetched', {
      totalPetsEnrolled: totalPetsCount,
      activeCourses,
      ongoingEnrollments,
      availableSeatsToday,
    });
  }

  async getEnrollmentTrend(petSchoolId: string) {
    const enrollments = await this.prisma.courseUser.findMany({
      where: {
        course: {
          schoolId: petSchoolId,
        },
        enrolledAt: {
          not: null,
        },
      },
      select: {
        enrolledAt: true,
      },
    });

    const trendMap = new Map<string, number>();

    enrollments.forEach(({ enrolledAt }) => {
      if (enrolledAt) {
        const date = enrolledAt.toISOString().split('T')[0];
        trendMap.set(date, (trendMap.get(date) || 0) + 1);
      }
    });

    const result = Array.from(trendMap.entries()).map(([date, count]) => ({
      date,
      count,
    }));

    return ApiResponse.success('Enrollment trend fetched', result);
  }

  async getCourseWiseEnrollments(petSchoolId: string) {
    const courses = await this.prisma.course.findMany({
      where: {
        schoolId: petSchoolId,
      },
      select: {
        name: true,
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });

    const result = courses.map((course) => ({
      courseName: course.name,
      students: course._count.enrollments,
    }));

    return ApiResponse.success('Course-wise enrollments fetched', result);
  }

  async getTrainerPerformance(petSchoolId: string) {
    const trainers = await this.prisma.employee.findMany({
      where: {
        petSchoolId,
      },
      select: {
        id: true,
        name: true,
        courses: {
          select: {
            enrollments: {
              select: { id: true },
            },
          },
        },
      },
    });

    const result = trainers.map((trainer) => ({
      trainerName: trainer.name,
      students: trainer.courses.reduce(
        (total, course) => total + course.enrollments.length,
        0
      ),
    }));

    return ApiResponse.success('Trainer performance fetched', result);
  }

  async getEnrollmentStatusDistribution(petSchoolId: string) {
    const enrollments = await this.prisma.courseUser.groupBy({
      by: ['status'],
      where: {
        course: {
          schoolId: petSchoolId,
        },
      },
      _count: {
        status: true,
      },
    });

    const result = enrollments.map((item) => ({
      status: item.status,
      count: item._count.status,
    }));

    return ApiResponse.success(
      'Enrollment status distribution fetched',
      result
    );
  }

  async getDashboardCharts(petSchoolId: string) {
    const enrollmentTrend = (await this.getEnrollmentTrend(petSchoolId)).data;
    const courseWiseEnrollments = (
      await this.getCourseWiseEnrollments(petSchoolId)
    ).data;
    const trainerPerformance = (await this.getTrainerPerformance(petSchoolId))
      .data;
    const enrollmentStatusDistribution = (
      await this.getEnrollmentStatusDistribution(petSchoolId)
    ).data;
    const stats = (await this.getDashboardStats(petSchoolId)).data;

    return ApiResponse.success('Dashboard charts fetched', {
      stats,
      enrollmentTrend,
      courseWiseEnrollments,
      trainerPerformance,
      enrollmentStatusDistribution,
    });
  }
}
