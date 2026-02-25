import { Module } from '@nestjs/common';
import { PetSchoolService } from './pet-school.service';
import { PetSchoolController } from './pet-school.controller';
import { CourseModule } from './course/course.module';
import { TrainerModule } from './trainer/trainer.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AdmissionModule } from './admission/admission.module';

@Module({
  controllers: [PetSchoolController],
  providers: [PetSchoolService],
  imports: [CourseModule, TrainerModule, DashboardModule, AdmissionModule],
})
export class PetSchoolModule {}
