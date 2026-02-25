import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { VisibilityEnum } from 'src/common/constants/enums';

export class CreateReelDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Video file for the reel (MP4, MOV, WebM)',
  })
  video: any;

  @IsString()
  @IsOptional()
  @MaxLength(200, { message: 'Caption can be max 200 characters' })
  @ApiProperty({
    type: String,
    required: false,
    maxLength: 200,
    description: 'Optional caption for the reel',
    example: 'Check out my new reel!',
  })
  caption?: string;

  @IsNotEmpty()
  @IsEnum(VisibilityEnum)
  @ApiProperty({
    enum: VisibilityEnum,
    description: 'Visibility of the reel',
    example: VisibilityEnum.PUBLIC,
    default: VisibilityEnum.PUBLIC,
  })
  visibility: VisibilityEnum;
}

export class UpdateReelDto {
  @IsString()
  @IsOptional()
  @MaxLength(200, { message: 'Caption can be max 200 characters' })
  @ApiPropertyOptional({
    type: String,
    description: 'Optional caption for the reel',
    maxLength: 200,
    example: 'Check out my new reel!',
  })
  caption?: string;

  @IsEnum(VisibilityEnum)
  @IsOptional()
  @ApiPropertyOptional({
    enum: VisibilityEnum,
    description: 'Optional visibility of the reel',
    example: VisibilityEnum.PUBLIC,
    default: VisibilityEnum.PUBLIC,
  })
  visibility?: VisibilityEnum;
}

export class AddCommentOnReelDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Content of the comment',
    example: 'Great reel!',
  })
  content: string;
}
