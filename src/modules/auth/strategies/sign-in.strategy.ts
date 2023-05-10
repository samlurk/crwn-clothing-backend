import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { verified } from 'src/helpers/bcrypt.helper';

@Injectable()
export class SignInStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const userResponse = await this.userService.findOneByEmailOrUsername(username);
    if (typeof userResponse === 'string') throw new HttpException(userResponse, HttpStatus.NOT_FOUND);
    if (!(await verified(password, userResponse.password)))
      throw new HttpException('user/wrong-password', HttpStatus.NOT_FOUND);
    return userResponse;
  }
}
