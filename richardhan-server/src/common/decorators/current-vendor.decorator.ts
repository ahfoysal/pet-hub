import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentVendor = createParamDecorator(
  (data: keyof { id: string } | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const vendor = request.vendorProfile;

    return data ? vendor?.[data] : vendor;
  }
);
