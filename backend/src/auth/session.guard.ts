import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { AuthService } from './auth.service.js';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const sessionToken = request.cookies?.nova_session;
    const user = sessionToken
      ? await this.authService.getUserFromSession(sessionToken)
      : null;

    if (!user) {
      throw new UnauthorizedException('Authentication required');
    }

    (request as FastifyRequest & { user: typeof user }).user = user;
    return true;
  }
}
