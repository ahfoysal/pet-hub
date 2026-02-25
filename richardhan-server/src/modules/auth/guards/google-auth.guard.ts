import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    const role = req.query.role;

    req.query.callbackUrl = `${process.env.GOOGLE_CALLBACK_URL}?role=${role}`;

    return (await super.canActivate(context)) as boolean;
  }
}
