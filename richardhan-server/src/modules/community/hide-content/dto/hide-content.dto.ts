import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ContentTypeEnum } from 'src/common/constants/enums';

export class HideContentDto {
  @ApiProperty({
    description: 'The ID of the content (post or reel) to hide/unhide',
    type: String,
    example: 'a1b2c3d4-5678-90ab-cdef-1234567890ab',
  })
  @IsString()
  @IsNotEmpty({ message: 'Content ID is required' })
  id: string;

  @ApiProperty({
    description: 'The type of content to hide/unhide',
    enum: ContentTypeEnum,
    example: ContentTypeEnum.POST,
  })
  @IsEnum(ContentTypeEnum, {
    message: 'contentType must be either POST or REEL',
  })
  @Transform(({ value }) => value as ContentTypeEnum)
  contentType: ContentTypeEnum;
}
