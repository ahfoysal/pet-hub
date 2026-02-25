import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoomStatus, RoomType } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import parseStringArray from 'src/common/utils/parseArray';

export class CreateHotelRoomDto {
  @ApiPropertyOptional({
    example: 'Cozy Stay 101',
    description: 'Room name',
  })
  @IsOptional()
  @IsString()
  roomName: string;

  @ApiProperty({
    example: 'A-101',
    description: 'Unique room number or code',
  })
  @IsString()
  roomNumber: string;

  @ApiProperty({
    example: 'Spacious air-conditioned room with balcony',
    description: 'Room description',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: ['AC', 'CCTV', 'WiFi', 'Pet Bed'],
    description: 'List of room amenities',
    type: [String],
  })
  @Transform(parseStringArray)
  @IsArray()
  @IsString({ each: true })
  roomAmenities: string[];

  @ApiProperty({
    enum: RoomType,
    example: RoomType.PET_ONLY,
    description: 'Type of room',
  })
  @IsEnum(RoomType)
  roomType: RoomType;

  @ApiProperty({
    enum: RoomStatus,
    example: RoomStatus.AVAILABLE,
    description: 'Current room status',
  })
  @IsEnum(RoomStatus)
  status: RoomStatus;

  @ApiProperty({
    example: 3,
    description: 'Maximum number of pets allowed',
  })
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  petCapacity: number;

  @ApiPropertyOptional({
    example: 2,
    description: 'Maximum number of humans allowed',
    required: false,
  })
  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsInt()
  @Min(1)
  humanCapacity?: number;

  @ApiProperty({
    example: 2500,
    description: 'Room price per night',
  })
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(0)
  price: number;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    description: 'Room images',
  })
  images: Express.Multer.File[];
}
