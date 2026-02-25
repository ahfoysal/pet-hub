import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsObject, IsOptional } from 'class-validator';

export class UpdateVariantDto {
  @ApiPropertyOptional({ type: Number, example: 25 })
  @Transform(({ value }) => Number(value))
  @IsOptional()
  originalPrice?: number;

  @ApiPropertyOptional({ type: Number, example: 20 })
  @Transform(({ value }) => Number(value))
  @IsOptional()
  sellingPrice?: number;

  @ApiPropertyOptional({ type: Number, example: 10 })
  @Transform(({ value }) => Number(value))
  @IsOptional()
  stock?: number;

  @ApiPropertyOptional({
    type: 'string',
    example: 'https://example.com/image1.jpg, https://example.com/image2.jpg',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string' && value.trim()) {
      return value
        .split(',')
        .map((s: string) => s.trim())
        .filter(Boolean);
    }
    return value;
  })
  prevImages?: string[];

  @ApiPropertyOptional({
    example: { size: 'L', color: 'red' },
    description: 'Dynamic variant attributes',
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value
  )
  @IsObject()
  @IsOptional()
  attributes?: Record<string, string>;

  @ApiPropertyOptional({ type: String, example: 'SKU123' })
  @IsOptional()
  sku?: string;

  @ApiPropertyOptional({
    type: [String],
    format: 'binary',
  })
  @IsOptional()
  @Type(() => Object)
  images?: string[];
}
