import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsArray,
  IsNumber,
  Min,
  ArrayMaxSize,
  IsNotEmpty,
  IsOptional,
  IsInt,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

const MAX_SERVICES_PER_PACKAGE = 10;

/* ------------------ Helpers ------------------ */

const toNumber = (value: any) => {
  if (value === undefined || value === null || value === '') return undefined;
  const num = Number(value);
  if (Number.isNaN(num)) {
    throw new Error('Invalid number');
  }
  return num;
};

/* ------------------ AddOn DTO ------------------ */

/* ------------------ Package DTO ------------------ */

export class CreatePetSitterPackageDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => toNumber(value))
  offeredPrice?: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => toNumber(value))
  durationInMinutes: number;

  @ApiProperty({ type: [String] })
  @IsArray()
  @ArrayMaxSize(MAX_SERVICES_PER_PACKAGE)
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value; // already an array
    if (typeof value === 'string') return value.split(',').map((v) => v.trim()); // comma-separated string
    return [];
  })
  serviceIds: string[];

  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}

export class UpdatePetSitterPackageDto {
  @ApiProperty({ required: false, description: 'Package name (optional)' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? undefined : value))
  name?: string;

  @ApiProperty({
    required: false,
    description: 'Package description (optional)',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? undefined : value))
  description?: string;

  @ApiProperty({
    required: false,
    description: 'Offered price (optional, cannot exceed calculated price)',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) =>
    value === '' || value === undefined ? undefined : Number(value)
  )
  offeredPrice?: number;

  @ApiProperty({
    required: false,
    description: 'Duration in minutes (optional)',
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) =>
    value === '' || value === undefined ? undefined : Number(value)
  )
  durationInMinutes?: number;

  @ApiProperty({
    type: [String],
    required: false,
    description: 'Service IDs to merge (optional)',
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(MAX_SERVICES_PER_PACKAGE)
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (!value || (Array.isArray(value) && !value.length)) return undefined;
    if (Array.isArray(value)) return value; // already an array
    if (typeof value === 'string')
      return value.includes(',')
        ? value.split(',').map((v) => v.trim()) // comma-separated string
        : [value]; // single string
    return undefined;
  })
  serviceIds?: string[];

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Optional package image file',
  })
  file?: Express.Multer.File;
}

export class PackageQueryDto {
  @IsOptional()
  cursor?: string;

  @IsOptional()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit = 10;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  maxPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  durationMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  durationMax?: number;
}
