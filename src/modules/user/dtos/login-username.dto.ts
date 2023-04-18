import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUsernameDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}