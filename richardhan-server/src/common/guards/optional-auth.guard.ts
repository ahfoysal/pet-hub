import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { REQUEST_USER_KEY } from '../constants/constants';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class OptionalAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) return true; // ✅ no token, allow access

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.id },
        select: { status: true },
      });

      if (user && (user.status === 'SUSPENDED' || user.status === 'BLOCKED')) {
        // optional: block suspended/blocked users
        return false;
      }

      // Attach user info to request if token is valid
      request[REQUEST_USER_KEY] = payload;
      return true;
    } catch {
      // token invalid/expired → still allow
      return true;
    }
  }

  private extractToken(request: any): string | null {
    const authHeader = request.headers['authorization'];
    if (!authHeader) return null;
    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) return null;
    return token;
  }
}
