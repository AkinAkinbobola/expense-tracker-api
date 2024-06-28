import { IsEmail, IsString } from 'class-validator';

export class AuthPayload {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
