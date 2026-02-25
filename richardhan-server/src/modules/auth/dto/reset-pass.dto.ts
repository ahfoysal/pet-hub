import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ type: String, example: '123456', required: true })
  @IsString()
  code: string;

  @ApiProperty({ type: String, example: '123456', required: true })
  @IsString()
  @MinLength(6)
  password: string;
}
