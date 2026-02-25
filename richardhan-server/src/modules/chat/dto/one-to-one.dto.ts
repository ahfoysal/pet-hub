import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendMessageDto {
  @IsString()
  @IsOptional()
  message?: string;

  @IsString()
  @IsNotEmpty()
  receiverId: string;

  @IsString()
  @IsOptional()
  media?: string;

  @IsString()
  @IsOptional()
  mediaType?: string;
}

export class LoadMessagesEventDto {
  @IsString()
  @IsNotEmpty()
  otherUserId: string;

  @IsString()
  @IsOptional()
  cursor?: string;

  @IsString()
  @IsOptional()
  limit?: number;
}
