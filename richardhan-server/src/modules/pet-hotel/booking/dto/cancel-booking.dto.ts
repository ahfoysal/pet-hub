import { ApiProperty } from '@nestjs/swagger';
import { CancelledByEnum } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class CancelBookingDto {
  @ApiProperty({
    enum: [CancelledByEnum.HOTEL_OWNER, CancelledByEnum.PET_OWNER],
    description: 'Who is cancelling: PET_OWNER (guest) or HOTEL_OWNER (hotel)',
  })
  @IsEnum(CancelledByEnum, {
    message: 'cancelledBy must be PET_OWNER or HOTEL_OWNER',
  })
  cancelledBy: CancelledByEnum;
}
