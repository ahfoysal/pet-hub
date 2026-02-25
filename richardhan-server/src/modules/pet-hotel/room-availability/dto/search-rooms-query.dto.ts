import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsUUID } from 'class-validator';

export class SearchRoomsQueryDto {
  @ApiProperty({
    description: 'Check-in date (YYYY-MM-DD)',
    example: '2026-02-20',
  })
  @IsDateString()
  checkIn: string;

  @ApiProperty({
    description: 'Check-out date (YYYY-MM-DD). Exclusive: last night is day before this.',
    example: '2026-02-25',
  })
  @IsDateString()
  checkOut: string;

  @ApiPropertyOptional({
    description: 'Filter by hotel profile ID',
    example: 'a3f1c9e4-2d9c-4b0a-9b6f-123456789abc',
  })
  @IsOptional()
  @IsUUID()
  hotelId?: string;
}
