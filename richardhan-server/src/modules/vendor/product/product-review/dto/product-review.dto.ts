import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AddProductReviewDto {
  @ApiProperty({ example: 4, minimum: 1, maximum: 5 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ example: 'Good quality and fast delivery' })
  @MaxLength(500)
  @IsString()
  @IsNotEmpty()
  review: string;
}

export class ReplyToReviewDto {
  @ApiProperty({ example: 'Thank you for your feedback!' })
  @MaxLength(500)
  @IsString()
  @IsNotEmpty()
  reply: string;
}

export class FlagReviewDto {
  @ApiProperty({ example: 'Inappropriate language' })
  @IsString()
  @IsNotEmpty()
  reason: string;
}
