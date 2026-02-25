import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateOrderStatusDto {
  @ApiProperty({ type: String, enum: OrderStatus, required: true })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
