import { Controller, Request, Post, UseGuards, Get, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginRequest } from './interfaces/auth-login.interface';
import { SignInAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SignUpGuard } from './guards/sign-up.guard';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { LoginUsernameDto } from './dtos/login-username.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(SignInAuthGuard)
  @Post('login')
  async login(@Request() { user }: AuthLoginRequest, @Body() _: LoginUsernameDto) {
    return await this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: AuthLoginRequest) {
    return req.user;
  }

  @Post('login-google')
  async loginGoogle(@Body('code') code: string) {
    return await this.authService.verifyGoogleIdToken(code);
  }

  @UseGuards(SignUpGuard)
  @Post('signup')
  async signUp(@Body() newUser: CreateUserDto) {
    return await this.authService.signUp(newUser);
  }
}
