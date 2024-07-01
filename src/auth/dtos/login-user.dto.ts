import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @IsEmail()
  @ApiProperty({ example: 'email@example.com' })
  email: string;

  @ApiProperty({ example: 'Abcdef1@' })
  @IsString()
  password: string;
}
