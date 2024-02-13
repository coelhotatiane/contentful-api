import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from 'src/services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private static BEARER_PREFIX: string = 'Bearer ';

  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (authHeader && authHeader.startsWith(AuthGuard.BEARER_PREFIX)) {
      const token = authHeader.replace(AuthGuard.BEARER_PREFIX, '');
      return this.authService.verify(token);
    } else {
      return false;
    }
  }
}
