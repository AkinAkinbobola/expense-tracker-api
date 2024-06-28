import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  registerUser() {
    return this.authService.registerUser();
  }

  @Post('login')
  loginUser() {
    return this.authService.loginUser();
  }
}
