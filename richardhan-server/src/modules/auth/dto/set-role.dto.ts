import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/common/types/auth.types';

export class SetRoleDto {
  @ApiProperty({
    enum: Role,
    required: true,
    description: 'User role',
  })
  role: Role;
}
