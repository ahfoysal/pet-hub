import { Injectable, NotFoundException } from '@nestjs/common';
import { ApiResponse } from 'src/common/response/api-response';
import { CloudinaryService } from 'src/common/utils/cloudinary/cloudinary.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';

@Injectable()
export class TrainerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  async createTrainer(
    dto: CreateTrainerDto,
    petSchoolId: string,
    file: Express.Multer.File
  ) {
    const uploadedImage = await this.cloudinaryService.uploadFile(file);
    const trainer = await this.prisma.employee.create({
      data: {
        ...dto,
        petSchoolId,
        image: uploadedImage.secure_url,
      },
    });

    return ApiResponse.success('Trainer created successfully', trainer);
  }

  async getMyTrainers(petSchoolId: string) {
    const trainers = await this.prisma.employee.findMany({
      where: {
        petSchoolId,
      },
      include: {
        courses: {
          select: {
            enrollments: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    const formatted = trainers.map((trainer) => ({
      id: trainer.id,
      name: trainer.name,
      email: trainer.email,
      phone: trainer.phone,
      specialization: trainer.specialization,
      image: trainer.image,
      totalCourses: trainer.courses.length,
      totalStudents: trainer.courses.reduce(
        (sum, course) => sum + course.enrollments.length,
        0
      ),
    }));

    console.log(trainers);

    const totalStudents = formatted.reduce(
      (total, trainer) => trainer.totalStudents + total,
      0
    );
    const avgRating =
      trainers.reduce((total, trainer) => trainer.avgRating + total, 0) /
      trainers.length;

    return ApiResponse.success('Trainers fetched successfully', {
      stats: {
        totalTrainers: trainers.length,
        totalStudents,
        avgRating,
      },
      trainers: formatted,
    });
  }

  async getTrainerDetails(trainerId: string) {
    const trainer = await this.prisma.employee.findUnique({
      where: {
        id: trainerId,
      },
      include: {
        petSchoolProfile: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return ApiResponse.success('Trainer fetched successfully', trainer);
  }

  async updateTrainerInfo(
    trainerId: string,
    schoolId: string,
    dto: UpdateTrainerDto,
    file?: Express.Multer.File
  ) {
    const trainer = await this.prisma.employee.findUnique({
      where: {
        id: trainerId,
        petSchoolId: schoolId,
      },
    });
    if (!trainer) throw new NotFoundException('Trainer not found');

    if (file) {
      const uploadedFiles = await this.cloudinaryService.uploadFile(file);
      dto.image = uploadedFiles.secure_url;
    }

    const updatedTrainer = await this.prisma.employee.update({
      where: {
        id: trainerId,
        petSchoolId: schoolId,
      },
      data: {
        ...dto,
        image: dto.image ?? trainer.image,
      },
    });

    return ApiResponse.success('Trainer updated successfully', updatedTrainer);
  }

  async deleteTrainer(trainerId: string, schoolId: string) {
    const trainer = await this.prisma.employee.findUnique({
      where: {
        id: trainerId,
        petSchoolId: schoolId,
      },
    });
    if (!trainer) throw new NotFoundException('Trainer not found');

    await this.prisma.employee.delete({
      where: {
        id: trainerId,
        petSchoolId: schoolId,
      },
    });

    return ApiResponse.success('Trainer deleted successfully', {
      trainerId: trainer.id,
    });
  }
}
