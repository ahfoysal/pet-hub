import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import parseStringArray from 'src/common/utils/parseArray';
import { CreateHotelRoomDto } from './create-room.dto';

export class UpdateHotelRoomDto extends PartialType(CreateHotelRoomDto) {
  @ApiPropertyOptional({
    type: [String],
    example: ['image1.jpg', 'image2.jpg'],
  })
  @Transform(parseStringArray)
  @IsOptional()
  prevImages?: string[];
}
