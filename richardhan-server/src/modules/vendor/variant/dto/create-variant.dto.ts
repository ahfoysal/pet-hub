import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateVariantDto {
  @ApiProperty({
    type: String,
    example: '2cf2a7eb-c660-4e27-8387-c8e10cde492d',
    required: true,
  })
  @IsString()
  productId: string;

  @ApiProperty({
    type: Number,
    example: 25,
    required: true,
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  originalPrice: number;

  @ApiProperty({
    type: Number,
    example: 20,
    required: true,
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  sellingPrice: number;

  @ApiProperty({
    example: { size: 'L', color: 'red' },
    description: 'Dynamic variant attributes',
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value
  )
  @IsObject()
  attributes: Record<string, string>;

  @ApiProperty({
    type: Number,
    example: 200,
    required: true,
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  stock: number;

  @ApiProperty({
    type: String,
    example: 'SKU123',
    required: false,
  })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({
    type: [String],
    format: 'binary',
    required: true,
  })
  @Type(() => String)
  images: string[];
}
