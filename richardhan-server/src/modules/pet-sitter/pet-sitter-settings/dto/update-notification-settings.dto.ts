import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateNotificationSettingsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  newBookings?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  checkInReminders?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  checkOutReminders?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  paymentUpdates?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  adminMessages?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  bookingCancellations?: boolean;
}
