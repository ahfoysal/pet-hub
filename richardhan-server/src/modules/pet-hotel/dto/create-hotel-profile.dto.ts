import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, Matches, MaxLength } from 'class-validator';

export class CreateHotelProfileDto {
  @ApiProperty({
    type: String,
    example: 'John Doe',
    required: true,
    description: 'User full name',
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    example: 'user@petzy.com',
    required: true,
    description: 'User email',
  })
  @IsString()
  email: string;

  @ApiProperty({
    type: String,
    example: '12345678',
    required: true,
    description: 'User Phone',
  })
  @IsString()
  phone: string;

  @ApiProperty({
    type: String,
    example: 'Description of the pet hotel',
    required: true,
    description: 'Description',
  })
  @IsString()
  description: string;

  @ApiProperty({
    type: String,
    example: 'House 183, Road 69',
    required: true,
    description: 'Street address',
  })
  @IsString()
  streetAddress: string;

  @ApiProperty({
    type: String,
    example: 'Dhaka',
    required: true,
    description: 'City',
  })
  @IsString()
  city: string;

  @ApiProperty({
    type: String,
    example: 'Bangladesh',
    required: true,
    description: 'Country',
  })
  @IsString()
  country: string;

  @ApiProperty({
    type: String,
    example: '1234',
    required: true,
    description: 'Postal code',
  })
  @IsString()
  @MaxLength(5, { message: 'Postal code must be at most 5 characters long' })
  postalCode: string;

  @ApiProperty({
    example: '08:00',
    description: 'Day shift starting time (HH:mm)',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Time must be in HH:mm format',
  })
  dayStartingTime: string;

  @ApiProperty({
    example: '18:00',
    description: 'Day shift ending time (HH:mm)',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Time must be in HH:mm format',
  })
  dayEndingTime: string;

  @ApiProperty({
    example: '18:00',
    description: 'Night shift starting time (HH:mm)',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Time must be in HH:mm format',
  })
  nightStartingTime: string;

  @ApiProperty({
    example: '08:00',
    description: 'Night shift ending time (HH:mm)',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Time must be in HH:mm format',
  })
  nightEndingTime: string;

  @ApiProperty({
    type: [String],
    format: 'binary',
  })
  @Type(() => Object)
  images: string[];
}
