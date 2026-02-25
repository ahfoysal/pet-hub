import { ApiProperty } from '@nestjs/swagger';

export class ResendOtpDto {
  @ApiProperty({
    type: String,
    example: 'admin@petzy.com',
    required: true,
    description: 'User email',
  })
  email: string;
}
