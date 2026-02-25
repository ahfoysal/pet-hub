import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsNumber,
  Min,
  IsInt,
  IsBoolean,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ProviderCategoryLevelDto {
  @ApiPropertyOptional()
  @IsOptional()
  id?: string;

  @ApiPropertyOptional({ example: 'Bronze' })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  bookingThreshold?: number;

  @ApiPropertyOptional({ example: 'Basic benefits' })
  @IsOptional()
  benefits?: string;
}

export class PlatformSettingsDto {
  @ApiPropertyOptional({
    description:
      'Platform fee as a percentage of the total amount (e.g., 5 means 5%)',
    example: 5.0,
  })
  @IsOptional()
  @IsNumber({}, { message: 'platformFee must be a number' })
  @Min(0, { message: 'platformFee cannot be negative' })
  platformFee?: number;

  @ApiPropertyOptional({
    description: 'Commission rate as a percentage (e.g., 10.5 means 10.5%)',
    example: 10.5,
  })
  @IsOptional()
  @IsNumber({}, { message: 'commissionRate must be a number' })
  @Min(0, { message: 'commissionRate cannot be negative' })
  commissionRate?: number;

  @ApiPropertyOptional({ example: 24 })
  @IsOptional()
  @IsInt()
  @Min(0)
  freeCancellationWindow?: number;

  @ApiPropertyOptional({ example: 100.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  refundPercentage?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isKycAutomatic?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isEmailNotificationEnabled?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isTwoFactorEnabled?: boolean;

  @ApiPropertyOptional({ type: [ProviderCategoryLevelDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProviderCategoryLevelDto)
  providerCategoryLevels?: ProviderCategoryLevelDto[];
}
