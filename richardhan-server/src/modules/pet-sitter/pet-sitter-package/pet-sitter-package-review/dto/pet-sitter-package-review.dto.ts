import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreatePetSitterPackageReviewDto {
  @ApiProperty({
    description: 'Rating for the package',
    minimum: 1,
    maximum: 5,
    example: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({
    description: 'Optional review comment',
    maxLength: 500,
    example: 'Great service, very professional sitter.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  comment?: string;
}

export class UpdatePetSitterPackageReviewDto {
  @ApiPropertyOptional({
    description: 'Rating for the package',
    minimum: 1,
    maximum: 5,
    example: 5,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional({
    description: 'Optional review comment',
    maxLength: 500,
    example: 'Great service, very professional sitter.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  comment?: string;
}
