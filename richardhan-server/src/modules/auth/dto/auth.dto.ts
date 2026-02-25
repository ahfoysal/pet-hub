import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from 'src/common/types/auth.types';

export class CheckIfPhoneNumberUserExistsDto {
  @ApiProperty({
    description: 'The phone number of the user to check',
    example: '+8801712345678',
  })
  @IsString({ message: 'Phone number must be a string' })
  @IsPhoneNumber(undefined, { message: 'Phone number must be valid' })
  phone: string;
}

export class CheckIfEmailUserExistsDto {
  @ApiProperty({
    description: 'The email of the user to check',
    example: 'user@example.com',
  })
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Email must be valid' })
  email: string;
}

export class PetOwnerSignUpDto {
  @ApiProperty({
    description: 'Email address of the user',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
  })
  @IsString({ message: 'Full name must be a string' })
  @IsNotEmpty({ message: 'Full name is required' })
  fullName: string;

  @ApiProperty({
    description: 'Phone number of the user',
    example: '+8801712345678',
  })
  @IsPhoneNumber(undefined, { message: 'Invalid phone number' })
  @IsNotEmpty({ message: 'Phone number is required' })
  phone: string;

  @ApiProperty({
    description: 'Username of the user',
    example: 'john_doe',
  })
  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username is required' })
  userName: string;

  @ApiProperty({
    description: 'Street address of the user',
    example: '123 Main Street',
  })
  @IsString({ message: 'Street address must be a string' })
  @IsNotEmpty({ message: 'Street address is required' })
  streetAddress: string;

  @ApiProperty({
    description: 'City of the user',
    example: 'Dhaka',
  })
  @IsString({ message: 'City must be a string' })
  @IsNotEmpty({ message: 'City is required' })
  city: string;

  @ApiProperty({
    description: 'Country of the user',
    example: 'Bangladesh',
  })
  @IsString({ message: 'Country must be a string' })
  @IsNotEmpty({ message: 'Country is required' })
  country: string;

  @ApiProperty({
    description: 'Postal code of the user',
    example: '1207',
  })
  @IsString({ message: 'Postal code must be a string' })
  @IsNotEmpty({ message: 'Postal code is required' })
  postalCode: string;

  @ApiProperty({
    description:
      'Indicates whether signup is done via email (true) or phone OTP (false)',
    example: true,
  })
  @IsBoolean({ message: 'isEmailLogin must be a boolean' })
  isEmailLogin: boolean;

  @ApiPropertyOptional({
    description: 'Firebase token of the user',
    example: 'token',
  })
  @IsOptional()
  @IsString({ message: 'Firebase token must be a string' })
  // @IsNotEmpty({ message: 'Firebase token is required' })
  firebaseToken?: string;
}

// BUG
// MUST REMOVE THIS TODO
// TODO: Remove this code
export class ChangeRoleDto {
  @ApiProperty({
    description: 'Role of the user',
    example: Role.PET_OWNER,
    enum: Role,
  })
  @IsEnum(Role, { message: 'Invalid role' })
  role: Role;

  @ApiPropertyOptional({
    description: 'User email',
    example: 'user@example.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email address' })
  email?: string;

  @ApiPropertyOptional({
    description: 'User phone number',
    example: '+8801712345678',
  })
  @IsOptional()
  phone?: string;
}

export class CheckFirebaseTokenDto {
  @ApiProperty({
    description: 'Firebase token of the user',
    example: 'token',
  })
  @IsString({ message: 'Firebase token must be a string' })
  @IsNotEmpty({ message: 'Firebase token is required' })
  firebaseToken: string;
}
