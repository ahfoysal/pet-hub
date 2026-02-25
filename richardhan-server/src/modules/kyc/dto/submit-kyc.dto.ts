import { ApiProperty } from '@nestjs/swagger';
import { IdentificationType, OrganizationType } from '@prisma/client';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateKycDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'example@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '1999-05-12' })
  @IsDateString()
  dateOfBirth: string;

  @ApiProperty({ example: 'Male' })
  @IsString()
  @IsOptional()
  gender?: string;

  @ApiProperty({ example: 'Bangladeshi' })
  @IsString()
  @IsOptional()
  nationality?: string;

  // Profile Image
  @ApiProperty({ type: 'string', format: 'binary' })
  image: any;

  @ApiProperty({ enum: IdentificationType })
  @IsEnum(IdentificationType)
  identificationType: IdentificationType;

  @ApiProperty({ example: '1234567890' })
  @IsString()
  @IsOptional()
  identificationNumber?: string;

  // ID Front
  @ApiProperty({ type: 'string', format: 'binary' })
  identificationFrontImage: any;

  // ID Back
  @ApiProperty({ type: 'string', format: 'binary' })
  identificationBackImage: any;

  // Signature
  @ApiProperty({ type: 'string', format: 'binary' })
  signatureImage: any;

  @ApiProperty({ example: '+8801712345678' })
  // @IsPhoneNumber(undefined, { message: 'Invalid phone number' })
  phoneNumber: string;

  @ApiProperty({ example: 'Dhaka, Bangladesh' })
  @IsString()
  @IsOptional()
  presentAddress?: string;

  @ApiProperty({ example: 'Chittagong, Bangladesh' })
  @IsString()
  @IsOptional()
  permanentAddress?: string;

  @ApiProperty({ example: 'Father Name' })
  @IsString()
  @IsOptional()
  emergencyContactName?: string;

  @ApiProperty({ example: 'Father' })
  @IsString()
  @IsOptional()
  emergencyContactRelation?: string;

  @ApiProperty({ example: '+8801812345678' })
  // @IsPhoneNumber()
  @IsString()
  @IsOptional()
  emergencyContactPhone?: string;

  @ApiProperty({ enum: OrganizationType })
  @IsEnum(OrganizationType)
  roleType: OrganizationType;

  // Business Info
  @ApiProperty({ example: 'Pet Hotel Inc.' })
  @IsString()
  @IsOptional()
  businessName?: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  @IsOptional()
  businessRegistrationNumber?: string;

  @ApiProperty({ example: '123 Business St' })
  @IsString()
  @IsOptional()
  businessAddress?: string;

  // License Info
  @ApiProperty({ example: 'LIC-123456' })
  @IsString()
  @IsOptional()
  licenseNumber?: string;

  @ApiProperty({ example: '2024-01-01' })
  @IsString()
  @IsOptional()
  licenseIssueDate?: string;

  @ApiProperty({ example: '2026-01-01' })
  @IsString()
  @IsOptional()
  licenseExpiryDate?: string;
}
