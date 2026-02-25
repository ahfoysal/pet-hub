import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    example: 'This is a great post!',
    description: 'The text content of the comment',
  })
  @IsString()
  @IsNotEmpty({ message: 'Comment content must not be empty' })
  content: string;
}

export class UpdateCommentDto {
  @ApiPropertyOptional({
    example: 'This is a great post!',
    description: 'The updated text content of the comment, optional',
  })
  @IsString({ message: 'Content must be a string' })
  @IsOptional()
  @MinLength(1, { message: 'Content cannot be empty' })
  content?: string;
}
