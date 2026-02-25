import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SuspendDurationEnum } from '../admin.constant';

export class CreateAdminDto {
  @ApiProperty({
    description: 'The full name of the new admin',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  fullName: string;

  @ApiProperty({
    description: 'The email address of the new admin',
    example: 'admin@petzy.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class UpdateAdminParamDto {
  @ApiProperty({
    description: 'The ID of the admin to update',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  adminId: string;
}

export class UpdateAdminDto {
  @ApiProperty({
    description: 'The full name of the admin',
    example: 'John Doe',
    required: false,
  })
  @IsString()
  @MinLength(2)
  fullName?: string;

  @ApiProperty({
    description: 'The email address of the admin',
    example: 'admin@petzy.com',
    required: false,
  })
  @IsEmail()
  email?: string;
}

export class BanUserDto {
  @ApiProperty({
    description: 'The unique ID of the user to be banned',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Reason for banning the user',
    example: 'Violation of community guidelines',
  })
  @IsString()
  @IsNotEmpty()
  reason: string;
}

export class SuspendUserDto {
  @ApiProperty({
    description: 'The unique ID of the user to be suspended',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Reason for suspending the user',
    example: 'Violation of community guidelines',
  })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiProperty({
    description: 'Suspension duration. Required when suspending a user.',
    enum: SuspendDurationEnum,
    example: SuspendDurationEnum.ONE_WEEK,
    required: true,
  })
  @IsEnum(SuspendDurationEnum)
  @IsNotEmpty()
  suspendDuration: SuspendDurationEnum;
}
