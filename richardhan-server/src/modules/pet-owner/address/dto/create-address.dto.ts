import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({
    example: 'John Doe',
    required: true,
    description: 'Full name',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    example: '+1234567890',
    required: true,
    description: 'Phone number',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  // @ApiProperty({
  //   example: 'example@email.com',
  //   required: true,
  //   description: 'Email',
  // })
  // @IsString()
  // @IsNotEmpty()
  // email: string;

  @ApiProperty({
    example: 'Dhaka',
    required: true,
    description: 'City',
  })
  @IsString()
  city: string;

  @ApiProperty({
    example: '123 Main St',
    required: true,
    description: 'Street address',
  })
  @IsString()
  street: string;

  @ApiProperty({
    example: '12345',
    required: true,
    description: 'Postal code',
  })
  @IsString()
  postalCode: string;

  @ApiProperty({
    example: 'Bangladesh',
    required: true,
    description: 'Country',
  })
  @IsString()
  country: string;
}
