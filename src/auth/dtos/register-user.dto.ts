import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/, {
    message: 'Invalid Password',
  })
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}
