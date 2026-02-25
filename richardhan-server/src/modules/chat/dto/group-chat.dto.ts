import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateGroupChatEventDto {
  @IsString()
  @IsNotEmpty()
  communityId: string;
}

export class RemovePeopleFromGroupEventDto {
  @IsString()
  @IsNotEmpty()
  participantId: string;

  @IsString()
  @IsNotEmpty()
  communityId: string;
}

export class AddPeopleToGroupEventDto {
  @IsString()
  @IsNotEmpty()
  participantId: string;

  @IsString()
  @IsNotEmpty()
  communityId: string;
}

export class SendGroupMessageEventDto {
  @IsString()
  @IsNotEmpty()
  communityId: string;

  @IsString()
  @IsOptional()
  message?: string;

  @IsString()
  @IsOptional()
  media?: string;

  @IsString()
  @IsOptional()
  mediaType?: string;
}

export class LOAD_MESSAGES_FROM_GROUP_EVENT {
  @IsString()
  @IsNotEmpty()
  communityId: string;

  @IsOptional()
  @IsString()
  cursor?: string; // messageId

  @IsOptional()
  @IsNumber()
  limit?: number; // default handled server-side
}
