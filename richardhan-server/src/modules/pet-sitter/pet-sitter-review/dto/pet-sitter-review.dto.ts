import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  Min,
  Max,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreatePetSitterReviewDto {
  @ApiProperty({
    description: 'Rating given to the pet sitter (1-5)',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsInt({ message: 'Rating must be an integer' })
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating cannot be more than 5' })
  rating: number;

  @ApiPropertyOptional({
    description: 'Optional comment about the pet sitter',
    example: 'Very caring and punctual!',
    maxLength: 500,
  })
  @IsOptional()
  @IsString({ message: 'Comment must be a string' })
  @MaxLength(500, { message: 'Comment can be at most 500 characters' })
  comment?: string;
}

export class UpdatePetSitterReviewDto {
  @ApiPropertyOptional({
    description: 'Updated rating for the pet sitter (1-5)',
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
    description:
      'Updated comment for the pet sitter (optional, max 500 characters)',
    maxLength: 500,
    example: 'Updated review comment here',
  })
  @IsOptional()
  @IsString({ message: 'Comment must be a string' })
  @MaxLength(500, { message: 'Comment cannot exceed 500 characters' })
  comment?: string;
}
