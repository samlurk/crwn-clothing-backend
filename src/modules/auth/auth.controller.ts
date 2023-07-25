import { Controller, Post, UseGuards, Body, HttpStatus, HttpException, Req, Get, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(SignInAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Req() req: Request) {
    try {
      const authResponse = await this.authService.login(req.user);
      return authResponse;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else throw new HttpException('INTERNAL SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('login-google')
  @HttpCode(201)
  async loginGoogle(@Body('code') code: string) {
    try {
      const authResponse = await this.authService.loginWithGoogle(code);
      return authResponse;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else throw new HttpException('INTERNAL SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards()
  @Post('signup')
  @HttpCode(201)
  async signUp(@Body() newUser: CreateUserDto) {
    try {
      const authResponse = await this.authService.signUp(newUser);
      return authResponse;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else throw new HttpException('INTERNAL SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('verify-session')
  async verifyToken(@Req() req: Request) {
    const token = req.headers.authorization?.substring(7);
    return { token };
  }
}
