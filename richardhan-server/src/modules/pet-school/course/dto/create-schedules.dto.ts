import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsInt, IsString } from 'class-validator';
import parseStringArray from 'src/common/utils/parseArray';

export class CreateCourseScheduleDto {
  @ApiProperty({
    type: [String],
    example: ['Monday', 'Tuesday', 'Wednesday'],
  })
  @Transform(parseStringArray)
  @IsArray()
  @IsString({ each: true })
  days: string[];

  @ApiProperty({ type: String, example: '10:00 AM' })
  @IsString()
  time: string;

  @ApiProperty({ type: Number, example: 10 })
  @Transform(({ value }) => Number(value))
  @IsInt()
  totalSeats: number;
}
