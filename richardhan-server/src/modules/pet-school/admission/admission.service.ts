import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CourseEnrollmentStatus } from '@prisma/client';
import { ApiResponse } from 'src/common/response/api-response';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { EnrollCourseDto } from './dto/enroll-course.dto';
import { RespondAdmissionDto } from './dto/respond-admission.dto';

@Injectable()
export class AdmissionService {
  constructor(private readonly prisma: PrismaService) {}

  async enrollToCourse(dto: EnrollCourseDto, userId: string) {
    const { courseId, petProfileId, scheduleId } = dto;

    const pet = await this.prisma.petProfile.findFirst({
      where: { id: petProfileId, petOwner: { userId } },
    });
    if (!pet) {
      throw new ForbiddenException('Pet does not belong to this user');
    }

    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) throw new NotFoundException('Course not found');

    const schedule = await this.prisma.courseSchedule.findUnique({
      where: { id: scheduleId },
    });
    if (!schedule) throw new NotFoundException('Schedule not found');

    if (schedule.availableSeats <= 0) {
      throw new BadRequestException('No seats available');
    }

    // Check if already enrolled
    const alreadyEnrolled = await this.prisma.courseUser.findUnique({
      where: {
        petProfileId_scheduleId: {
          petProfileId,
          scheduleId,
        },
      },
    });
    if (alreadyEnrolled)
      throw new BadRequestException('Already enrolled in this course schedule');

    return this.prisma.$transaction(async (tx) => {
      // Create enrollment
      await tx.courseUser.create({
        data: {
          userId,
          petProfileId,
          courseId,
          scheduleId,
        },
      });

      return ApiResponse.success(
        'Enrolled successfully, please wait for approval'
      );
    });
  }

  async getEnrollRequests(schoolId: string) {
    const enrollments = await this.prisma.courseUser.findMany({
      where: { course: { schoolId } },
      select: {
        id: true,
        paymentId: true,
        petProfile: {
          select: {
            id: true,
            petName: true,
            petType: true,
            breed: true,
            profileImg: true,
          },
        },
        user: { select: { id: true, fullName: true, image: true } },
        course: { select: { id: true, name: true } },
        schedule: { select: { id: true, time: true } },
        status: true,
        createdAt: true,
      },
    });

    return ApiResponse.success('Enroll requests found', enrollments);
  }

  async getAdmissionDetails(admissionId: string) {
    const enrollment = await this.prisma.courseUser.findUnique({
      where: { id: admissionId },
      select: {
        id: true,
        petProfile: {
          select: {
            id: true,
            petName: true,
            petType: true,
            breed: true,
            profileImg: true,
          },
        },
        status: true,
        course: {
          select: {
            id: true,
            avgRating: true,
            name: true,
            courseObjective: true,
            classPerWeek: true,
            duration: true,
            price: true,
          },
        },
        createdAt: true,
      },
    });

    return ApiResponse.success('Admission request found', enrollment);
  }

  async respondToAdmission(
    admissionId: string,
    dto: RespondAdmissionDto,
    schoolId: string
  ) {
    const enrollment = await this.prisma.courseUser.findUnique({
      where: { id: admissionId },
      include: { course: true },
    });

    if (!enrollment) {
      throw new NotFoundException('Admission request not found');
    }

    if (enrollment.course.schoolId !== schoolId) {
      throw new ForbiddenException(
        'You can only respond to admission requests for your school courses'
      );
    }

    if (enrollment.status !== CourseEnrollmentStatus.PENDING) {
      throw new BadRequestException(
        `Admission request is already ${enrollment.status.toLowerCase()}`
      );
    }

    if (dto.status === CourseEnrollmentStatus.APPROVED) {
      const schedule = await this.prisma.courseSchedule.findUnique({
        where: { id: enrollment.scheduleId },
      });
      if (!schedule || schedule.availableSeats <= 0) {
        throw new BadRequestException('No seats available for this schedule');
      }
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.courseUser.update({
        where: { id: admissionId },
        data: {
          status: dto.status,
          ...(dto.status === CourseEnrollmentStatus.APPROVED && {
            enrolledAt: new Date(),
          }),
          ...(dto.status === CourseEnrollmentStatus.REJECTED && {
            cancelledAt: new Date(),
          }),
        },
      });

      if (dto.status === CourseEnrollmentStatus.APPROVED) {
        await tx.courseSchedule.update({
          where: { id: enrollment.scheduleId },
          data: { availableSeats: { decrement: 1 } },
        });
      }
    });

    const message =
      dto.status === CourseEnrollmentStatus.APPROVED
        ? 'Admission request accepted'
        : 'Admission request rejected';

    return ApiResponse.success(message);
  }
}
