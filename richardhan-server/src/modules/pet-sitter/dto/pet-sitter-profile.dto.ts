import {
  IsString,
  IsNumber,
  IsArray,
  ArrayNotEmpty,
  Min,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreatePetSitterProfileDto {
  @ApiProperty({
    description: 'Designation or job title of the pet sitter',
    example: 'Dog Walker',
  })
  @IsString({ message: 'Designation must be a string' })
  @MaxLength(50, { message: 'Designation is too long (max 50 characters)' })
  designation: string;

  @ApiProperty({
    description: 'Brief biography of the pet sitter',
    example: 'I love taking care of dogs and cats.',
  })
  @IsString({ message: 'Bio must be a string' })
  @MaxLength(500, { message: 'Bio is too long (max 500 characters)' })
  bio: string;

  @ApiProperty({
    description: 'Years of experience as a pet sitter',
    example: 3,
  })
  @IsNumber({}, { message: 'Years of experience must be a number' })
  @Min(0, { message: 'Years of experience cannot be negative' })
  yearsOfExperience: number;

  @ApiProperty({
    description: 'Languages the pet sitter speaks',
    example: ['English', 'Bengali'],
  })
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  @IsArray({ message: 'Languages must be an array of strings' })
  @ArrayNotEmpty({ message: 'Languages array cannot be empty' })
  @IsString({ each: true, message: 'Each language must be a string' })
  languages: string[];

  @ApiProperty({ description: 'Street address', example: '123 Main St' })
  @IsString({ message: 'Street address must be a string' })
  streetAddress: string;

  @ApiProperty({ description: 'City', example: 'Dhaka' })
  @IsString({ message: 'City must be a string' })
  city: string;

  @ApiProperty({ description: 'Country', example: 'Bangladesh' })
  @IsString({ message: 'Country must be a string' })
  country: string;

  @ApiProperty({ description: 'Postal code', example: '1207' })
  @IsString({ message: 'Postal code must be a string' })
  postalCode: string;
}

export class UpdatePetSitterProfileDto {
  @ApiPropertyOptional({
    description: 'Designation or job title of the pet sitter',
    example: 'Dog Walker',
  })
  @IsOptional()
  @IsString({ message: 'Designation must be a string' })
  @MaxLength(50, { message: 'Designation is too long (max 50 characters)' })
  designations?: string;

  @ApiPropertyOptional({
    description: 'Brief biography of the pet sitter',
    example: 'I love taking care of dogs and cats...',
  })
  @IsOptional()
  @IsString({ message: 'Bio must be a string' })
  @MaxLength(500, { message: 'Bio is too long (max 500 characters)' })
  bio?: string;

  @ApiPropertyOptional({
    description: 'Years of experience of the pet sitter',
    example: 3,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Years of experience must be a number' })
  @Min(0, { message: 'Years of experience cannot be negative' })
  yearsOfExperience?: number;

  @ApiPropertyOptional({
    description: 'Languages spoken by the pet sitter',
    example: ['English', 'Spanish'],
    type: [String],
  })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  @IsArray({ message: 'Languages must be an array' })
  @ArrayNotEmpty({ message: 'Languages array cannot be empty' })
  @IsString({ each: true, message: 'Each language must be a string' })
  languages?: string[];

  @ApiPropertyOptional({
    description: 'Street address of the pet sitter',
    example: '123 Main St',
  })
  @IsOptional()
  @IsString({ message: 'Street address must be a string' })
  @MaxLength(100, {
    message: 'Street address is too long (max 100 characters)',
  })
  streetAddress?: string;

  @ApiPropertyOptional({
    description: 'City of the pet sitter',
    example: 'New York',
  })
  @IsOptional()
  @IsString({ message: 'City must be a string' })
  @MaxLength(50, { message: 'City is too long (max 50 characters)' })
  city?: string;

  @ApiPropertyOptional({
    description: 'Country of the pet sitter',
    example: 'USA',
  })
  @IsOptional()
  @IsString({ message: 'Country must be a string' })
  @MaxLength(50, { message: 'Country is too long (max 50 characters)' })
  country?: string;

  @ApiPropertyOptional({
    description: 'Postal code of the pet sitter',
    example: '10001',
  })
  @IsOptional()
  postalCode?: string;
}
