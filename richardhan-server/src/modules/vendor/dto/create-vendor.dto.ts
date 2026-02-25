import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsString, MaxLength } from 'class-validator';

export class CreateVendorDto {
  @ApiProperty({ type: String, example: 'John Doe', required: true })
  @IsString()
  name: string;

  @ApiProperty({ type: String, example: '1234567890', required: true })
  @IsString()
  phone: string;

  @ApiProperty({ type: String, example: 'example@email.com', required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String, example: 'Description', required: true })
  @IsString()
  description: string;

  @ApiProperty({
    type: String,
    example: 'House 183, Road 69',
    required: true,
  })
  @IsString()
  streetAddress: string;

  @ApiProperty({
    type: String,
    example: 'Dhaka',
    required: true,
  })
  @IsString()
  city: string;

  @ApiProperty({
    type: String,
    example: 'Bangladesh',
    required: true,
  })
  @IsString()
  country: string;

  @ApiProperty({
    type: String,
    example: '1234',
    required: true,
  })
  @IsString()
  @MaxLength(5, { message: 'Postal code must be at most 5 characters long' })
  postalCode: string;

  @ApiProperty({
    type: [String],
    format: 'binary',
  })
  @Type(() => Object)
  images: string[];
}
