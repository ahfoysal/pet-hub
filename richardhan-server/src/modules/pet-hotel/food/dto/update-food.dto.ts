import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray } from 'class-validator';
import parseStringArray from 'src/common/utils/parseArray';
import { CreateFoodDto } from './create-food.dto';

export class UpdateFoodDto extends PartialType(CreateFoodDto) {
  @ApiPropertyOptional({
    type: 'array',
    items: { type: 'string' },
    description: 'Previous images of the food',
  })
  @Transform(parseStringArray)
  @IsArray()
  prevImages?: string[];
}
