import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    type: [String],
    example: ['2cf2a7eb-c660-4e27-8387-c8e10cde492d'],
    required: true,
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  cartItemIds: string[];

  @ApiProperty({
    type: String,
    format: 'uuid',
    example: '2cf2a7eb-c660-4e27-8387-c8e10cde492d',
    required: true,
  })
  @IsUUID()
  shippingAddressId: string;
}
