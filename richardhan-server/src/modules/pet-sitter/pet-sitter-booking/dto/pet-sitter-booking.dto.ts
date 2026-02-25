import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { PetSitterBookingTypeEnum } from 'src/common/constants/enums';

export class CreatePetSitterBookingDto {
  @ApiProperty({ description: 'IDs of pets for this booking', type: [String] })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  petIds: string[];

  @ApiProperty({
    description: 'Booking start time',
    type: String,
    format: 'date-time',
  })
  @IsDateString()
  bookingTime: Date;

  @ApiPropertyOptional({ description: 'Package ID for package bookings' })
  @IsOptional()
  @IsString()
  packageId?: string;

  @ApiPropertyOptional({ description: 'Service ID for service bookings' })
  @IsOptional()
  @IsString()
  serviceId?: string;

  @ApiProperty({ description: 'Is booking for own home' })
  @IsBoolean()
  isOwnHome: boolean;

  @ApiProperty({
    description: 'Type of booking',
    enum: PetSitterBookingTypeEnum,
  })
  @IsEnum(PetSitterBookingTypeEnum)
  bookingType: PetSitterBookingTypeEnum;

  @ApiPropertyOptional({ description: 'Additional services' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  additionalServices?: string[];

  @ApiPropertyOptional({
    description: 'Optional note from the pet sitter',
    maxLength: 500,
    example: 'Took extra care during the walk, all pets are happy!',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  specialInstructions?: string;
}

export class RequestToCompleteDto {
  @ApiPropertyOptional({
    description: 'Optional note from the pet sitter about the completion',
    maxLength: 500,
    example: 'Took extra care during the walk, all pets are happy!',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  completionNote?: string;

  @ApiProperty({
    description: 'Files uploaded by the pet sitter as proof of completion',
    type: 'array',
    items: { type: 'string', format: 'binary' },
  })
  files: any[];
}
