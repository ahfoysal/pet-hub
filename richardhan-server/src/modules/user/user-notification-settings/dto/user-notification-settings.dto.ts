import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateUserNotificationSettingsDto {
  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Enable or disable email notifications',
    default: true,
  })
  email?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Enable or disable push notifications',
    default: true,
  })
  pushNotification?: boolean;
}
