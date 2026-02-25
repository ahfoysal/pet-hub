import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Max } from 'class-validator';
import { ContentTypeEnum } from 'src/common/constants/enums';

export class GetBookmarksQueryDto {
  @IsOptional()
  @IsEnum(ContentTypeEnum, {
    message: `Filter bookmarks by ${Object.values(ContentTypeEnum).join(' or ')}`,
  })
  @ApiPropertyOptional({
    description: `Filter bookmarks by ${Object.values(ContentTypeEnum).join(' or ')}`,
    enum: ContentTypeEnum,
  })
  filter?: ContentTypeEnum;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Cursor for pagination' })
  cursor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Max(50, { message: 'Limit cannot exceed 50' })
  @ApiPropertyOptional({
    description: 'Number of items to return (max 50)',
    default: 20,
  })
  limit?: number = 20;
}
