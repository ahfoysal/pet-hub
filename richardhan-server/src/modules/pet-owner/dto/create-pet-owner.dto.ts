import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreatePetOwnerDto {
  @ApiProperty({
    type: String,
    example: 'John Doe',
    required: true,
  })
  name: string;

  @ApiProperty({
    type: [String],
    format: 'binary',
  })
  @Type(() => Object)
  images: string[];
}

// name        String
// image       String
