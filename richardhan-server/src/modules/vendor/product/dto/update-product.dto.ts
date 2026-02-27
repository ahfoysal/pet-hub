import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';
import parseStringArray from 'src/common/utils/parseArray';

export class UpdateProductDto {
  @ApiPropertyOptional({ type: String, example: 'Product Name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ type: String, example: 'Product Description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: ['Tag 1', 'Tag 2'],
    required: false,
  })
  @IsOptional()
  @Transform(parseStringArray)
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    example: ['Feature 1', 'Feature 2'],
    required: false,
  })
  @IsOptional()
  @Transform(parseStringArray)
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  brandName?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @Transform(parseStringArray)
  @IsArray()
  countryOfOrigin?: string[];

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  manufacturingDate?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  expiryDate?: string;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value as string, 10) : undefined))
  @IsInt()
  lowStockThreshold?: number;

  @ApiPropertyOptional({ type: String, example: 'SEO Title' })
  @IsOptional()
  @IsString()
  seoTitle?: string;

  @ApiPropertyOptional({ type: String, example: 'SEO Description' })
  @IsOptional()
  @IsString()
  seoDescription?: string;

  @ApiPropertyOptional({
    type: [String],
    format: 'binary',
    required: false,
  })
  @IsOptional()
  images?: string[];
}
