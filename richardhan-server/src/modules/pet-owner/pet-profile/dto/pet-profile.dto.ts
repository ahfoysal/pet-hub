import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';
import { GenderEnum, VaccinationStatusEnum } from 'src/common/constants/enums';
import { TransformToBoolean } from 'src/common/decorators/transform-to-boolean.decorator';
import { TransformToDate } from 'src/common/decorators/transform-to-date.decorator';
import { IsPetAgeWithLimit, IsPetWeight } from './validator';

export class AddPetProfileDto {
  @ApiProperty({ description: 'Name of the pet', example: 'Buddy' })
  @IsString()
  @IsNotEmpty()
  petName: string;

  @ApiProperty({ description: 'Type of the pet', example: 'Dog' })
  @IsString()
  @IsNotEmpty()
  petType: string;

  @ApiProperty({ description: 'Breed of the pet', example: 'Golden Retriever' })
  @IsString()
  @IsNotEmpty()
  breed: string;

  @ApiProperty({
    enum: GenderEnum,
    description: 'Gender of the pet',
    example: GenderEnum.MALE,
  })
  @IsEnum(GenderEnum)
  gender: GenderEnum;

  @ApiProperty({
    description:
      'Age of the pet (e.g., "5 days", "3 weeks", "8 months", "4 years")',
    example: '3 years',
  })
  @IsString()
  @IsNotEmpty()
  @IsPetAgeWithLimit({
    message:
      'Age must be a valid duration: days (≤90), weeks (≤52), months (≤240), or years (≤30)',
  })
  age: string;

  @ApiProperty({
    description: 'Date of birth of the pet',
    type: String,
    format: 'date-time',
    example: '2020-05-12T00:00:00.000Z',
  })
  @TransformToDate()
  dateOfBirth: Date;

  @ApiProperty({
    description: 'Weight of the pet (e.g., "15 kg", "200 g", "30 lbs")',
    example: '12.5 kg',
  })
  @IsString()
  @IsNotEmpty()
  @IsPetWeight({
    message:
      'Weight must be a positive number followed by a unit: g, kg, lb, lbs',
  })
  weight: string;

  @ApiProperty({ description: 'Color of the pet', example: 'Golden' })
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiPropertyOptional({
    description: 'Microchip ID of the pet',
    example: '982374982374',
  })
  @IsString()
  @IsOptional()
  microChipId?: string;

  @ApiProperty({
    enum: VaccinationStatusEnum,
    description: 'Rabies vaccination status',
    example: VaccinationStatusEnum.DUE,
  })
  @IsEnum(VaccinationStatusEnum)
  rabiesStatus: VaccinationStatusEnum;

  @ApiProperty({
    enum: VaccinationStatusEnum,
    description: 'DHPP vaccination status',
    example: VaccinationStatusEnum.UPDATED,
  })
  @IsEnum(VaccinationStatusEnum)
  dhppStatus: VaccinationStatusEnum;

  @ApiProperty({
    enum: VaccinationStatusEnum,
    description: 'Bordetella vaccination status',
    example: VaccinationStatusEnum.NOT_UPDATED,
  })
  @IsEnum(VaccinationStatusEnum)
  bordetellaStatus: VaccinationStatusEnum;

  @ApiPropertyOptional({ description: 'Known allergies', example: 'Peanuts' })
  @IsString()
  @IsOptional()
  allergies?: string;

  @ApiProperty({
    description: 'Veterinarian doctor name',
    example: 'Dr. Smith',
  })
  @IsString()
  @IsNotEmpty()
  vetDoctorName: string;

  @ApiProperty({
    description: 'Veterinarian doctor phone number',
    example: '+1234567890',
  })
  @IsString()
  @IsNotEmpty()
  vetDoctorPhone: string;

  @ApiProperty({
    description: 'Pet temperament',
    example: 'Friendly and playful',
  })
  @IsString()
  @IsNotEmpty()
  temperament: string;

  @ApiProperty({
    description: 'Whether the pet is good with kids',
    example: true,
  })
  @TransformToBoolean()
  @IsBoolean()
  isGoodWithKids: boolean;

  @ApiProperty({
    description: 'Whether the pet is good with other pets',
    example: false,
  })
  @TransformToBoolean()
  @IsBoolean()
  isGoodWithOtherPets: boolean;

  @ApiProperty({
    description: 'Feeding instructions',
    example: 'Feed twice daily, 1 cup each time',
  })
  @IsString()
  @IsNotEmpty()
  feedingInstructions: string;

  @ApiPropertyOptional({
    description: 'Special notes',
    example: 'Needs medication once a day',
  })
  @IsString()
  @IsOptional()
  specialNotes?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Profile image of the pet',
  })
  file: Express.Multer.File;
}

export class UpdatePetProfileDto {
  @ApiPropertyOptional({ description: 'Name of the pet', example: 'Buddy' })
  @IsOptional()
  @IsString()
  petName?: string;

  @ApiPropertyOptional({ description: 'Type of the pet', example: 'Dog' })
  @IsOptional()
  @IsString()
  petType?: string;

  @ApiPropertyOptional({
    description: 'Breed of the pet',
    example: 'Golden Retriever',
  })
  @IsOptional()
  @IsString()
  breed?: string;

  @ApiPropertyOptional({
    enum: GenderEnum,
    description: 'Gender of the pet',
    example: GenderEnum.MALE,
  })
  @IsOptional()
  @IsEnum(GenderEnum)
  gender?: GenderEnum;

  @ApiPropertyOptional({
    description:
      'Age of the pet (e.g., "5 days", "3 weeks", "8 months", "4 years")',
    example: '3 years',
  })
  @IsOptional()
  @IsString()
  @IsPetAgeWithLimit({
    message:
      'Age must be a valid duration: days (≤90), weeks (≤52), months (≤240), or years (≤30)',
  })
  age?: string;

  @ApiPropertyOptional({
    description: 'Date of birth of the pet',
    type: String,
    format: 'date-time',
    example: '2020-05-12T00:00:00.000Z',
  })
  @IsOptional()
  @TransformToDate()
  dateOfBirth?: Date;

  @ApiPropertyOptional({
    description: 'Weight of the pet (e.g., "12.5 kg")',
    example: '12.5 kg',
  })
  @IsOptional()
  @IsString()
  @IsPetWeight({
    message:
      'Weight must be a positive number followed by a unit: g, kg, lb, lbs',
  })
  weight?: string;

  @ApiPropertyOptional({ description: 'Color of the pet', example: 'Golden' })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional({
    description: 'Microchip ID of the pet',
    example: '982374982374',
  })
  @IsOptional()
  @IsString()
  microChipId?: string;

  @ApiPropertyOptional({
    enum: VaccinationStatusEnum,
    description: 'Rabies vaccination status',
    example: VaccinationStatusEnum.DUE,
  })
  @IsOptional()
  @IsEnum(VaccinationStatusEnum)
  rabiesStatus?: VaccinationStatusEnum;

  @ApiPropertyOptional({
    enum: VaccinationStatusEnum,
    description: 'DHPP vaccination status',
    example: VaccinationStatusEnum.UPDATED,
  })
  @IsOptional()
  @IsEnum(VaccinationStatusEnum)
  dhppStatus?: VaccinationStatusEnum;

  @ApiPropertyOptional({
    enum: VaccinationStatusEnum,
    description: 'Bordetella vaccination status',
    example: VaccinationStatusEnum.NOT_UPDATED,
  })
  @IsOptional()
  @IsEnum(VaccinationStatusEnum)
  bordetellaStatus?: VaccinationStatusEnum;

  @ApiPropertyOptional({ description: 'Known allergies', example: 'Peanuts' })
  @IsOptional()
  @IsString()
  allergies?: string;

  @ApiPropertyOptional({
    description: 'Veterinarian doctor name',
    example: 'Dr. Smith',
  })
  @IsOptional()
  @IsString()
  vetDoctorName?: string;

  @ApiPropertyOptional({
    description: 'Veterinarian doctor phone number',
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  vetDoctorPhone?: string;

  @ApiPropertyOptional({
    description: 'Pet temperament',
    example: 'Friendly and playful',
  })
  @IsOptional()
  @IsString()
  temperament?: string;

  @ApiPropertyOptional({
    description: 'Whether the pet is good with kids',
    example: true,
  })
  @IsOptional()
  @TransformToBoolean()
  @IsBoolean()
  isGoodWithKids?: boolean;

  @ApiPropertyOptional({
    description: 'Whether the pet is good with other pets',
    example: false,
  })
  @IsOptional()
  @TransformToBoolean()
  @IsBoolean()
  isGoodWithOtherPets?: boolean;

  @ApiPropertyOptional({
    description: 'Feeding instructions',
    example: 'Feed twice daily, 1 cup each time',
  })
  @IsOptional()
  @IsString()
  feedingInstructions?: string;

  @ApiPropertyOptional({
    description: 'Special notes',
    example: 'Needs medication once a day',
  })
  @IsOptional()
  @IsString()
  specialNotes?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Profile image of the pet',
  })
  @IsOptional()
  file?: Express.Multer.File;
}
