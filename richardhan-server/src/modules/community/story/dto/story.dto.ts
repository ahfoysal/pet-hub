import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { VisibilityEnum } from 'src/common/constants/enums';

export class AddStoryDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'The story image file to upload (JPEG, PNG, or MP4)',
  })
  file: any; // Swagger uses this to render file input

  @ApiPropertyOptional({
    type: String,
    description: 'Optional location for the story, e.g., "New York City"',
    example: 'New York City',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    enum: VisibilityEnum,
    description:
      'Visibility of the story. PUBLIC = anyone can see, FRIENDS = only friends, PRIVATE = only you',
    example: VisibilityEnum.PUBLIC,
    default: VisibilityEnum.PUBLIC,
  })
  @IsOptional()
  @IsEnum(VisibilityEnum)
  visibility?: VisibilityEnum;
}

export class ChangeStoryVisibilityDto {
  @ApiProperty({
    description:
      'Visibility of the story. Allowed values: PUBLIC, FRIENDS, PRIVATE',
    example: 'PUBLIC',
    enum: ['PUBLIC', 'FRIENDS', 'PRIVATE'], // literal values
    required: true,
  })
  @IsEnum(VisibilityEnum)
  visibility: VisibilityEnum;
}

export class ReplyStoryDto {
  @ApiProperty({
    type: String,
    description: 'comment',
    example: 'comment',
  })
  @IsString()
  @IsNotEmpty()
  comment: string;
}
