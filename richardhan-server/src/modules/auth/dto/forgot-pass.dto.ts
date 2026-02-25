import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ type: String, example: 'admin@petzy.com', required: true })
  @IsEmail()
  email: string;
}
