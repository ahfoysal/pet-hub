import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import parseStringArray from 'src/common/utils/parseArray';
import { CreateHotelProfileDto } from './create-hotel-profile.dto';

export class UpdateHotelProfileDto extends PartialType(CreateHotelProfileDto) {
  @ApiPropertyOptional({
    description:
      'Array of existing image URLs to keep (after deletions). Send as comma-separated string in form data.',
    example: 'https://example.com/image1.jpg, https://example.com/image2.jpg',
    type: 'string',
    required: false,
  })
  @IsOptional()
  @Transform(parseStringArray)
  prevImages?: string[];
}
