import {
  BadGatewayException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dtos/register-user.dto';
import { SerializedUser } from '../serializers';
import { AuthPayload } from './dtos/auth-payload';

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
  loginUser(@Body() credentials: AuthPayload) {
    return this.authService.validateUser(credentials);
  }
}
