import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ConsumerType, FoodType } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import parseStringArray from 'src/common/utils/parseArray';

export class CreateFoodDto {
  @ApiProperty({ enum: FoodType, description: 'Type of food' })
  @IsEnum(FoodType)
  foodType: FoodType;

  @ApiProperty({ enum: ConsumerType, description: 'Type of consumer' })
  @IsEnum(ConsumerType)
  foodFor: ConsumerType;

  @ApiProperty({ example: 'Premium Dog Food', description: 'Food name' })
  @IsString()
  name: string;

  @ApiProperty({
    type: [String],
    example: ['chicken', 'beef'],
    description: 'Ingredients',
  })
  @Transform(parseStringArray)
  @IsArray()
  @IsString({ each: true })
  ingredients: string[];

  @ApiProperty({ example: 'Premium Dog Food', description: 'Description' })
  @IsString()
  description: string;

  @ApiProperty({ example: 499, description: 'Price' })
  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsPositive()
  price: number;

  @ApiProperty({ example: 2, description: 'Number of serving' })
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  numberOfServing: number;

  @ApiProperty({ example: 250, description: 'Gram per serving' })
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  gramPerServing: number;

  @ApiProperty({
    title: 'Pet Category',
    example: 'Dog',
    description: 'Pet Category',
  })
  petCategory: string;

  @ApiProperty({ example: 'Golden Retriever', description: 'Pet Breed' })
  @IsString()
  petBreed: string;

  @ApiProperty({ example: 350, description: 'Calories' })
  @Transform(({ value }) => Number(value))
  @IsInt()
  calories: number;

  @ApiProperty({ example: 24.5, description: 'Protein' })
  @Transform(({ value }) => Number(value))
  protein: number;

  @ApiProperty({ example: 12.3, description: 'Fat' })
  @Transform(({ value }) => Number(value))
  fat: number;

  @ApiPropertyOptional({
    example: 3,
    required: false,
    description: 'Minimum Age in months',
  })
  @Transform(({ value }) => Number(value))
  @IsOptional()
  minAge?: number;

  @ApiPropertyOptional({
    example: 120,
    required: false,
    description: 'Maximum Age in months',
  })
  @Transform(({ value }) => Number(value))
  @IsOptional()
  maxAge?: number;

  @ApiProperty({ default: true, description: 'Is Available' })
  @Transform(({ value }) => Boolean(value))
  @IsBoolean()
  isAvailable: boolean;

  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    description: 'Images',
  })
  @Type(() => Object)
  files: string[];
}
