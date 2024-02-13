import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async signIn(username: string, password: string): Promise<{ token: string }> {
    if (!username || !password) {
      throw new UnauthorizedException();
    }
    const payload = { username };
    return {
      token: await this.jwtService.signAsync(payload),
    };
  }

  async verify(token: string): Promise<boolean> {
    try {
      await this.jwtService.verifyAsync(token);
      return true;
    } catch (error) {
      return false;
    }
  }
}
