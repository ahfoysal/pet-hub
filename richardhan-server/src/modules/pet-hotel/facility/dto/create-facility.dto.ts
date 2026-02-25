import { IsInt, IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { ConsumerType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFacilityDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: ConsumerType })
  @IsEnum(ConsumerType)
  @IsNotEmpty()
  facilityFor: ConsumerType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  price: number;
}
