import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { verified } from 'src/helpers/bcrypt.helper';
import { UserInterface } from '../user/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.getOneUserByUsername(username);
    if (user === null) return null;
    if (!(await verified(password, user.password))) return false;
    return user;
  }

  async login({ id, username }: Pick<UserInterface, 'id' | 'username'>) {
    const payload = { id, username };
    return {
      ACCESS_TOKEN: this.jwtService.sign(payload)
    };
  }

  async googleLogin(googleUser: Pick<UserInterface, 'firstName' | 'lastName' | 'email'>) {
    let user = await this.userService.getOneUserByEmail(googleUser.email);
    if (user === null) {
      await this.userService.addUser(googleUser);
      user = await this.userService.getOneUserByEmail(googleUser.email);
    }
    return {
      ACCESS_TOKEN: this.jwtService.sign({ id: user?.id, username: user?.username })
    };
  }
}
