import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    type: String,
    example: 'admin@petzy.com',
    required: true,
    description: 'User email',
  })
  email: string;

  @ApiProperty({
    type: String,
    example: '12345678',
    required: true,
    description: 'User password',
  })
  password: string;
}
