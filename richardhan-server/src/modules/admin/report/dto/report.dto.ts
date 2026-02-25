import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReportType } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import { SuspendDurationEnum, TakenActionEnum } from '../../admin.constant';

export class AddReportDto {
  @ApiProperty({
    enum: ReportType,
    description: 'Type of report (POST, REEL, USER, etc.)',
    example: ReportType.POST,
  })
  @IsEnum(ReportType)
  reportType: ReportType;

  @ApiProperty({
    description: 'Reason for reporting the content or user',
    example: 'Hate speech / abusive content',
  })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiPropertyOptional({
    description: 'User ID being reported (required if reportType = USER)',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({
    description: 'Post ID being reported (required if reportType = POST)',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  postId?: string;

  @ApiPropertyOptional({
    description: 'Reel ID being reported (required if reportType = REEL)',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  reelId?: string;
}

export class UpdateReportDto {
  @ApiProperty({
    description: 'Reason for reporting the content or user',
    example: 'Hate speech / abusive content',
  })
  reason: string;
}

export class TakeActionDto {
  @ApiProperty({
    description:
      'Action to take on the report. Available actions: IGNORE, BAN, DELETE, HIDE, SUSPEND',
    enum: TakenActionEnum,
    example: TakenActionEnum.BAN,
  })
  @IsEnum(TakenActionEnum)
  actionType: TakenActionEnum;

  @ApiPropertyOptional({
    description: 'Suspension duration. REQUIRED when actionType is SUSPEND.',
    enum: SuspendDurationEnum,
    example: SuspendDurationEnum.ONE_WEEK,
  })
  @ValidateIf((dto) => dto.actionType === TakenActionEnum.SUSPEND)
  @IsEnum(SuspendDurationEnum)
  suspendDuration?: SuspendDurationEnum;

  @ApiPropertyOptional({
    description: 'Reason for the action. REQUIRED for BAN and SUSPEND.',
    example: 'Hate speech / abusive content',
  })
  @ValidateIf(
    (dto) =>
      dto.actionType === TakenActionEnum.BAN ||
      dto.actionType === TakenActionEnum.SUSPEND
  )
  @IsString()
  @IsNotEmpty()
  reason?: string;

  @ApiProperty({
    description:
      'Moderator note. REQUIRED for all actions (audit & moderation trace).',
    example: 'Violation confirmed after manual review',
  })
  @IsString()
  @IsNotEmpty()
  note: string;
}
