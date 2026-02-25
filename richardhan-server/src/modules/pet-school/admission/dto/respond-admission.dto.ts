import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

const APPROVED = 'APPROVED';
const REJECTED = 'REJECTED';

export class RespondAdmissionDto {
  @ApiProperty({
    type: String,
    enum: [APPROVED, REJECTED],
    description: 'Accept (APPROVED) or reject (REJECTED) the admission request',
  })
  @IsIn([APPROVED, REJECTED], {
    message: 'Status must be APPROVED or REJECTED',
  })
  status: 'APPROVED' | 'REJECTED';
}
