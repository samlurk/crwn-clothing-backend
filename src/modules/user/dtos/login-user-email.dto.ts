import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserEmailDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
