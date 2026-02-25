import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class UpdateCartItemDto {
  @ApiProperty({ type: 'number', minimum: 1 })
  @IsInt()
  @IsPositive()
  quantity: number;
}
