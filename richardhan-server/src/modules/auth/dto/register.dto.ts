import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsOptional } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    type: String,
    example: 'John Doe',
    required: true,
    description: 'User full name',
  })
  fullName: string;

  @ApiProperty({
    type: String,
    example: 'user@petzy.com',
    required: true,
    description: 'User email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    example: '+1234567890',
    required: true,
    description: 'User phone number',
  })
  phone: string;

  @ApiProperty({
    type: String,
    example: '12345678',
    required: true,
    description: 'User password',
  })
  password: string;

  @ApiProperty({
    description: 'Files to upload',
    type: 'array',
    items: { type: 'string', format: 'binary' },
    required: false,
  })
  @IsOptional()
  @Type(() => Object)
  file: string;
}
