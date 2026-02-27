import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ReplyToReviewDto {
  @ApiProperty({ example: 'Thank you for your feedback!' })
  @IsString()
  @IsNotEmpty()
  reply: string;
}
