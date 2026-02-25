import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailDto {
  @ApiProperty({ type: String, example: '123456', required: true })
  code: string;
}
