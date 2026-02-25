import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, Min } from 'class-validator';

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
}
