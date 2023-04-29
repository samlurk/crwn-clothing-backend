import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class SignInStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (user === null) throw new HttpException("The username doesn't exists", HttpStatus.NOT_FOUND);
    if (user === false) throw new HttpException('Incorrect password', HttpStatus.UNAUTHORIZED);
    return user;
  }
}
