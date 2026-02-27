import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum FinanceStatus {
  RELEASED = 'RELEASED',
  PENDING = 'PENDING',
  HOLD = 'HOLD',
  CANCELLED = 'CANCELLED',
}

export class FinanceQueryDto {
  @ApiPropertyOptional({ minimum: 1, default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ minimum: 1, maximum: 100, default: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({ enum: FinanceStatus })
  @IsEnum(FinanceStatus)
  @IsOptional()
  status?: FinanceStatus;
}
