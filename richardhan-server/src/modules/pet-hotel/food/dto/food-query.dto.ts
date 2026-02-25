import { ApiPropertyOptional } from '@nestjs/swagger';
import { ConsumerType, FoodType } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class FoodQueryDto {
  @ApiPropertyOptional({ enum: FoodType })
  @IsOptional()
  @IsEnum(FoodType)
  foodType?: FoodType;

  @ApiPropertyOptional({ enum: ConsumerType })
  @IsOptional()
  @IsEnum(ConsumerType)
  foodFor?: ConsumerType;

  @ApiPropertyOptional({ example: 'Dog' })
  @IsOptional()
  petCategory?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;
}
