import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CourseLevel, DiscountType } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import parseStringArray from 'src/common/utils/parseArray';
import { CreateCourseScheduleDto } from './create-schedules.dto';

export class CreateCourseDto {
  @ApiProperty({
    type: String,
    example: 'Dog Training',
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    example: 'Dog Training Details',
  })
  @IsString()
  details: string;

  @ApiProperty({
    type: String,
    example: 'Obedience',
  })
  @IsString()
  courseObjective: string;

  @ApiProperty({
    type: [String],
    example: [
      'Professional training techniques',
      'Positive reinforcement methods',
    ],
  })
  @Transform(parseStringArray)
  @IsArray()
  outcomes: string[];

  @ApiProperty({
    type: Number,
    example: 1000,
  })
  @Transform(({ value }) => Number(value))
  @IsInt()
  price: number;

  @ApiProperty({
    type: String,
    example: 'Dog',
  })
  @IsString()
  courseFor: string;

  @ApiProperty({
    type: String,
    example: 'Korea',
  })
  @IsString()
  location: string;

  @ApiPropertyOptional({
    type: Number,
    example: 10,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  discount: number;

  @ApiPropertyOptional({
    enum: DiscountType,
    example: DiscountType.PERCENTAGE,
  })
  @IsOptional()
  @IsString()
  discountType: DiscountType;

  @ApiProperty({
    type: Number,
    example: 10,
    description: 'Duration in weeks',
  })
  @Transform(({ value }) => Number(value))
  @IsInt()
  duration: number;

  @ApiProperty({
    type: Number,
    example: 3,
    description: 'Class per week',
  })
  @Transform(({ value }) => Number(value))
  @IsInt()
  classPerWeek: number;

  @ApiProperty({
    type: String,
    example: 'aca734af-4f8f-48f8-9364-5446ac539d3f',
  })
  trainerId: string;

  @ApiProperty({ enum: CourseLevel })
  courseLevel: CourseLevel;

  @ApiProperty({
    type: String,
    format: 'binary',
  })
  @Type(() => Object)
  image: string;

  @ApiProperty({
    type: Date,
    example: '2026-02-22',
    description: 'Starting time (YYYY-MM-DD)',
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    type: Date,
    example: '2026-05-22',
    description: 'Ending time (YYYY-MM-DD)',
  })
  @IsDateString()
  endDate: string;

  @ApiProperty({
    type: String,
    example: JSON.stringify([
      {
        days: ['Monday', 'Wednesday'],
        time: '10:00 AM',
        totalSeats: 10,
      },
      {
        days: ['Saturday', 'Sunday'],
        time: '6:00 PM',
        totalSeats: 8,
      },
    ]),
    description: 'JSON string of course schedules',
  })
  @Transform(({ value }) => JSON.parse(value as string))
  @ValidateNested({ each: true })
  @Type(() => CreateCourseScheduleDto)
  schedules: CreateCourseScheduleDto[];
}
