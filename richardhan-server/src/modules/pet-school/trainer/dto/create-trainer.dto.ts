import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsEmail, IsString } from 'class-validator';
import parseStringArray from 'src/common/utils/parseArray';

export class CreateTrainerDto {
  @ApiProperty({ type: String, example: 'John Doe', required: true })
  @IsString()
  name: string;

  @ApiProperty({ type: String, example: 'example@email.com', required: true })
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({ type: String, example: '1234567890', required: true })
  @IsString()
  phone: string;

  @ApiProperty({
    type: [String],
    example: ['Obedience Training', 'Behavioral Training'],
    required: true,
  })
  @Transform(parseStringArray)
  @IsArray()
  specialization: string[];

  @ApiProperty({
    type: String,
    format: 'binary',
  })
  @Type(() => Object)
  image: string;
}
