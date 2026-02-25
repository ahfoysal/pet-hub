import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsUUID } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({
    type: 'string',
    format: 'uuid',
    example: '2cf2a7eb-c660-4e27-8387-c8e10cde492d',
    description: 'Product ID',
    required: true,
  })
  @IsUUID()
  productId: string;

  @ApiProperty({
    type: 'string',
    format: 'uuid',
    example: '7d995f51-8948-4d33-b692-23fab636837a',
    description: 'Vendor ID',
    required: true,
  })
  @IsUUID()
  variantId: string;

  @ApiProperty({
    type: Number,
    example: 1,
    required: true,
  })
  @IsInt()
  @IsPositive()
  quantity: number;
}
