import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentSchool } from 'src/common/decorators/current-school.decorator';
import { RequireVerifiedProfile } from 'src/common/decorators/require-verified-profile.decorator';
import { Roles } from 'src/common/decorators/role.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ProfileGuard } from 'src/common/guards/profile.guard';
import { VerifiedProfileGuard } from 'src/common/guards/verified-profile.guard';
import { Role } from 'src/common/types/auth.types';
import { storageConfig } from 'src/config/storage.config';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';
import { TrainerService } from './trainer.service';

@ApiTags('Pet School Trainer')
@Controller('trainer')
export class TrainerController {
  constructor(private readonly trainerService: TrainerService) {}

  @ApiOperation({ summary: 'Create trainer' })
  @UseGuards(AuthGuard, VerifiedProfileGuard)
  @Roles(Role.PET_SCHOOL)
  @RequireVerifiedProfile()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', { storage: storageConfig() }))
  @Post()
  createTrainer(
    @Body() dto: CreateTrainerDto,
    @CurrentSchool('id') petSchoolId: string,
    @UploadedFile() image: Express.Multer.File
  ) {
    return this.trainerService.createTrainer(dto, petSchoolId, image);
  }

  @ApiOperation({ summary: 'Get my trainers by school owner' })
  @UseGuards(AuthGuard, ProfileGuard)
  @Get('my-trainers')
  getMyTrainers(@CurrentSchool('id') petSchoolId: string) {
    return this.trainerService.getMyTrainers(petSchoolId);
  }

  @ApiOperation({ summary: 'Get trainer details' })
  @Get(':trainerId')
  getTrainerDetails(@Param('trainerId') trainerId: string) {
    return this.trainerService.getTrainerDetails(trainerId);
  }

  @ApiOperation({ summary: 'Update trainer information' })
  @Patch(':trainerId')
  @UseGuards(AuthGuard, ProfileGuard)
  @Roles(Role.PET_SCHOOL)
  @UseInterceptors(FileInterceptor('image', { storage: storageConfig() }))
  @ApiConsumes('multipart/form-data')
  updateTrainer(
    @CurrentSchool('id') petSchoolId: string,
    @Body() dto: UpdateTrainerDto,
    @Param('trainerId') trainerId: string,
    @UploadedFile() image: Express.Multer.File
  ) {
    return this.trainerService.updateTrainerInfo(
      trainerId,
      petSchoolId,
      dto,
      image
    );
  }

  @ApiOperation({ summary: 'Delete trainer' })
  @Delete(':trainerId')
  @UseGuards(AuthGuard, ProfileGuard)
  @Roles(Role.PET_SCHOOL)
  deleteTrainer(
    @CurrentSchool('id') petSchoolId: string,
    @Param('trainerId') trainerId: string
  ) {
    return this.trainerService.deleteTrainer(trainerId, petSchoolId);
  }
}
