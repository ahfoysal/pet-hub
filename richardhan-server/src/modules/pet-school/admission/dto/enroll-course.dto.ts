import { ApiProperty } from '@nestjs/swagger';

export class EnrollCourseDto {
  @ApiProperty({
    type: String,
    example: '3520562e-75ea-4896-bd29-5c9bf8cf8c75',
  })
  courseId: string;

  @ApiProperty({
    type: String,
    example: '8fc57a0c-1f92-4172-9e20-ff4fc2b2455f',
  })
  scheduleId: string;

  @ApiProperty({
    type: String,
    example: '8fc57a0c-1f92-4172-9e20-ff4fc2b2455f',
  })
  petProfileId: string;
}
