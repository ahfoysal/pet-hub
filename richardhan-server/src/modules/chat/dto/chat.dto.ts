import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
} from 'class-validator';

export class CreateCommunityChatDto {
  @ApiProperty({ description: 'Name of the community/group chat' })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Optional description of the community/group chat',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'You must provide at least one participant.' })
  @Transform(({ value }) => {
    if (!value) return [];

    if (typeof value === 'string') {
      // If the string is JSON (like '["id1","id2"]'), parse it
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // Not JSON, continue
      }

      // Split comma-separated string
      return value
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);
    }

    return value;
  })
  @ApiProperty({
    description:
      'Array of user IDs to add to the community/group chat. Can also send a single ID as a string.',
    type: [String],
    example: ['userId1', 'userId2'],
  })
  participantIds?: string[];

  @ApiPropertyOptional({
    description: 'Image file for the community/group chat',
    type: 'string',
    format: 'binary', // This tells Swagger it's a file upload
  })
  file?: any; // Keep as optional, will be handled by @UploadedFile
}

export class UpdateGroupDetailsDto {
  @ApiPropertyOptional({
    description: 'New name of the group',
    type: String,
    required: false,
    example: 'New name',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'New description of the group',
    type: String,
    required: false,
    example: 'New description',
  })
  @IsString()
  @IsOptional()
  description?: string;
}

export class AddPeopleToGroupDto {
  @ApiProperty({
    description:
      'Array of user IDs to add to the group. Can also send a single ID as a string.',
    type: [String],
    example: ['userId1', 'userId2'],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'You must provide at least one participant.' })
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (!value) return [];
    // If value is a JSON string, parse it
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return [value]; // single string
      }
    }
    return value;
  })
  participantIds: string[];
}

export class RemovePeopleFromGroupDto {
  @ApiProperty({
    description: 'User ID to remove from the group',
    example: 'userId',
  })
  @IsString()
  @IsNotEmpty()
  participantId: string;
}

export class ChangeGroupOwnerDto {
  @ApiProperty({
    description: 'The ID of the participant to be made the new group owner',
    example: 'e14b79b8-8451-4fb0-8ef3-155a7b668c7e',
  })
  @IsString()
  @IsNotEmpty()
  participantId: string;
}
