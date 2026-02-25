import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({
    description: 'Room ID',
    example: '2cf2a7eb-c660-4e27-8387-c8e10cde492d',
  })
  @IsUUID()
  roomId: string;

  @ApiProperty({
    description: 'Check-in date (YYYY-MM-DD)',
    example: '2026-01-22',
  })
  @IsDateString()
  checkIn: string;

  @ApiProperty({
    description: 'Check-out date (YYYY-MM-DD). Exclusive.',
    example: '2026-01-26',
  })
  @IsDateString()
  checkOut: string;

  @ApiPropertyOptional({
    description: 'IDs of pets staying (must belong to the user)',
    example: ['pet-uuid-1', 'pet-uuid-2'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  petIds?: string[];

  @ApiPropertyOptional({
    description: 'Discount code or note',
  })
  @IsOptional()
  @IsString()
  discount?: string;
}
