import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateAddressDto {
  @ApiPropertyOptional({
    type: String,
    example: 'House 183, Road 69',
    required: true,
  })
  @IsOptional()
  @IsString()
  streetAddress: string;

  @ApiPropertyOptional({
    type: String,
    example: 'Dhaka',
    required: true,
  })
  @IsOptional()
  @IsString()
  city: string;

  @ApiPropertyOptional({
    type: String,
    example: 'Bangladesh',
    required: true,
  })
  @IsOptional()
  @IsString()
  country: string;

  @ApiPropertyOptional({
    type: String,
    example: '1234',
    required: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(5, { message: 'Postal code must be at most 5 characters long' })
  postalCode: string;
}
