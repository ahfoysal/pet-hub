import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { TransformToBoolean } from 'src/common/decorators/transform-to-boolean.decorator';

export const MediaTypeEnum = {
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
} as const;

export type MediaTypeEnum = (typeof MediaTypeEnum)[keyof typeof MediaTypeEnum];

export const PostVisibilityEnum = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE',
  FRIENDS: 'FRIENDS',
} as const;

export type PostVisibilityEnum =
  (typeof PostVisibilityEnum)[keyof typeof PostVisibilityEnum];

export class CreatePostDto {
  @ApiPropertyOptional({
    description: 'Post caption',
    example: 'Enjoying the sunset',
  })
  @IsOptional()
  @IsString()
  caption?: string;

  @ApiPropertyOptional({
    description: 'Post location',
    example: 'Seoul, Korea',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    description: 'Post visibility',
    enum: PostVisibilityEnum,
    enumName: 'PostVisibilityType',
    example: PostVisibilityEnum.PUBLIC,
  })
  @IsEnum(PostVisibilityEnum)
  visibility: PostVisibilityEnum;

  @ApiPropertyOptional({
    description: 'Whether comments are allowed on the post',
    example: true,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @TransformToBoolean()
  isCommentAllowed?: boolean;

  @ApiPropertyOptional({
    description: 'Whether to share the post to your story',
    example: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @TransformToBoolean()
  isShareToStory?: boolean;

  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    description: 'Images or videos to upload',
  })
  files?: any[];
}

export class UpdatePostDto {
  @ApiPropertyOptional({
    description: 'Post caption',
    example: 'Enjoying the sunset',
  })
  @IsOptional()
  @IsString()
  caption?: string;

  @ApiPropertyOptional({
    description: 'Post location',
    example: 'Seoul, Korea',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    description: 'Post visibility',
    enum: PostVisibilityEnum,
    enumName: 'PostVisibilityType',
    example: PostVisibilityEnum.PUBLIC,
  })
  @IsOptional()
  @IsEnum(PostVisibilityEnum)
  visibility?: PostVisibilityEnum;

  @ApiPropertyOptional({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    description: 'New images or videos to upload',
  })
  files?: any[];

  @ApiPropertyOptional({
    type: 'array',
    items: { type: 'string' },
    description: 'Existing media links to remove from the post',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (!value) return [];
    // If single string, wrap in array
    return Array.isArray(value) ? value : [value];
  })
  removedMediaLinks?: string[];

  @ApiPropertyOptional({
    description: 'Whether comments are allowed on the post',
    example: true,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @TransformToBoolean()
  isCommentAllowed?: boolean;
}
