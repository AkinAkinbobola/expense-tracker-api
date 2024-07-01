import {
  BadGatewayException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dtos/register-user.dto';
import { SerializedUser } from '../serializers';
import { LoginUserDto } from './dtos/login-user.dto';
import { RefreshTokensDto } from './dtos/refresh-tokens.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('signup')
  async registerUser(@Body() registerUserDto: RegisterUserDto) {
    const user = await this.authService.registerUser(registerUserDto);
    if (!user) throw new BadGatewayException('Error creating user');
    return new SerializedUser(user);
  }

  @Post('login')
  async loginUser(@Body() credentials: LoginUserDto) {
    return this.authService.validateUser(credentials);
  }

  @Post('refresh')
  async refreshTokens(@Body() refreshTokensDto: RefreshTokensDto) {
    return this.authService.refreshToken(refreshTokensDto);
  }
}
