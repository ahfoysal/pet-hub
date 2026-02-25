import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentHotel = createParamDecorator(
  (data: keyof { id: string } | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const hotel = request.hotelProfile;

    return data ? hotel?.[data] : hotel;
  }
);
