import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';
import parseStringArray from 'src/common/utils/parseArray';

export class CreateProductDto {
  @ApiProperty({
    type: String,
    example: 'Product Name',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    example: 'Product Description',
    required: true,
  })
  @IsString()
  description: string;

  @ApiProperty({
    type: String,
    example: 'Product Category',
    required: true,
  })
  @IsString()
  category: string;

  @ApiProperty({
    type: String,
    example: 'Pet Category',
    required: true,
  })
  @IsString()
  petCategory: string;

  @ApiProperty({
    type: 'array',
    example: ['Tag 1', 'Tag 2'],
    required: true,
  })
  @Transform(parseStringArray)
  @IsArray()
  tags: string[];

  @ApiProperty({
    type: [String],
    example: ['Feature 1', 'Feature 2'],
    required: true,
  })
  @Transform(parseStringArray)
  @IsArray()
  features: string[];

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  brandName?: string;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @Transform(parseStringArray)
  @IsArray()
  countryOfOrigin?: string[];

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  manufacturingDate?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  expiryDate?: string;

  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value as string, 10) : undefined))
  @IsInt()
  lowStockThreshold?: number;

  @ApiProperty({
    type: String,
    example: 'SEO Title',
    required: false,
  })
  @IsOptional()
  @IsString()
  seoTitle?: string;

  @ApiProperty({
    type: String,
    example: 'SEO Description',
    required: false,
  })
  @IsOptional()
  @IsString()
  seoDescription?: string;

  @ApiProperty({
    type: [String],
    format: 'binary',
    required: true,
  })
  @Type(() => String)
  images: string;
}

