import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsArray,
  ArrayNotEmpty,
  ArrayUnique,
  IsOptional,
} from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({
    description: 'Name of the service',
    example: 'Dog Walking',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Description of the service',
    example: 'A 30-minute dog walking session in your neighborhood',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Price in cents',
    example: 1500,
  })
  @Transform(({ value }) => Number(value)) // convert string → number
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Duration of the service in minutes',
    example: 30,
  })
  @Transform(({ value }) => Number(value)) // convert string → number
  @IsNumber()
  @Min(1)
  duration: number;

  @ApiProperty({
    description: 'Thumbnail image file for the service',
    type: 'string',
    format: 'binary',
  })
  file: Express.Multer.File;

  @ApiProperty({
    description: 'What is included in the service',
    example: ['Walk for 30 mins', 'Water refill'],
    type: [String],
  })
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.split(',').map((v) => v.trim())
      : Array.isArray(value)
        ? value
        : []
  )
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  whatsIncluded: string[];

  @ApiPropertyOptional({
    description: 'Tags associated with the service',
    example: ['walking', 'pet care'],
    type: [String],
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.split(',').map((v) => v.trim())
      : Array.isArray(value)
        ? value
        : []
  )
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  tags?: string[];
}

export class UpdateServiceDto {
  @ApiPropertyOptional({
    description: 'Name of the service',
    example: 'Dog Walking',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Description of the service',
    example: 'A 30-minute dog walking session in your neighborhood',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Price in cents',
    example: 1500,
  })
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({
    description: 'Duration of the service in minutes',
    example: 30,
  })
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsNumber()
  @Min(1)
  durationInMinutes?: number;

  @ApiPropertyOptional({
    description: 'Thumbnail image file for the service',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  file?: Express.Multer.File;

  @ApiPropertyOptional({
    description: 'What is included in the service',
    example: ['Walk for 30 mins', 'Water refill'],
    type: [String],
  })
  @Transform(({ value }) =>
    value ? (Array.isArray(value) ? value : [value]) : undefined
  )
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  whatsIncluded?: string[];

  @ApiPropertyOptional({
    description: 'Tags associated with the service',
    example: ['walking', 'pet care'],
    type: [String],
  })
  @Transform(({ value }) =>
    value ? (Array.isArray(value) ? value : [value]) : undefined
  )
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  tags?: string[];
}
