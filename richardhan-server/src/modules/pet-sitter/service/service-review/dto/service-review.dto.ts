import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  Min,
  Max,
  IsString,
  MaxLength,
  IsNotEmpty,
  MinLength,
  IsOptional,
} from 'class-validator';

export class CreateServiceReviewDto {
  @ApiProperty({
    description: 'Rating given to the service',
    example: 4,
    minimum: 1,
    maximum: 5,
  })
  @IsNotEmpty({ message: 'Rating is required' })
  @IsInt({ message: 'Rating must be an integer' })
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating cannot be more than 5' })
  rating: number;

  @ApiProperty({
    description: 'Review comment for the service',
    example: 'The service was excellent!',
    required: true,
  })
  @IsString({ message: 'Comment must be a string' })
  @MaxLength(500, { message: 'Comment is too long (max 500 characters)' })
  @IsNotEmpty({ message: 'Comment is required' })
  @MinLength(5, { message: 'Comment must be at least 5 characters long' })
  comment: string;
}

export class UpdateReviewDto {
  @ApiPropertyOptional({
    description: 'Updated rating of the review (1-5)',
    minimum: 1,
    maximum: 5,
    example: 4,
  })
  @IsOptional()
  @IsInt({ message: 'Rating must be an integer' })
  @Min(1, { message: 'Rating cannot be less than 1' })
  @Max(5, { message: 'Rating cannot be more than 5' })
  rating?: number;

  @ApiPropertyOptional({
    description: 'Updated comment for the review',
    maxLength: 500,
    example: 'Updated review comment here',
  })
  @IsOptional()
  @IsString({ message: 'Comment must be a string' })
  @MaxLength(500, { message: 'Comment is too long (max 500 characters)' })
  comment?: string;
}
