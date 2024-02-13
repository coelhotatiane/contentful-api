import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from 'src/services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    return this.authService.signIn(username, password);
  }
}
