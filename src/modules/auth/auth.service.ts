import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { verified } from 'src/helpers/bcrypt.helper';
import { UserInterface } from '../user/interfaces/user.interface';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { User } from '../user/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.findOneByEmailOrUsername(username);
    if (user === null) return null;
    if (!(await verified(password, user.password))) return false;
    return user;
  }

  async login(user: any) {
    return {
      ACCESS_TOKEN: this.jwtService.sign({ id: user.id, username: user.username, email: user.email })
    };
  }

  async googleLogin(googleUser: Pick<UserInterface, 'firstName' | 'lastName' | 'email'>) {
    let user = await this.userService.getOneUserByEmail(googleUser.email);
    // TODO: refactor this code, this conditional should be a guard
    if (user === null) {
      await this.userService.addUser(googleUser);
      user = await this.userService.getOneUserByEmail(googleUser.email);
    }
    return {
      ACCESS_TOKEN: this.jwtService.sign({ id: user?.id, username: user?.username })
    };
  }

  // TODO: refactor this method, it should be a guard
  async verifyGoogleIdToken(code: string) {
    const client = new OAuth2Client(
      this.configService.get<string>('GOOGLE_ID'),
      this.configService.get<string>('GOOGLE_SECRET'),
      'postmessage'
    );
    const {
      tokens: { id_token: ID_TOKEN }
    } = await client.getToken(code);
    if (typeof ID_TOKEN === 'undefined') return undefined;
    const ticket = await client.verifyIdToken({
      idToken: ID_TOKEN as string,
      audience: client._clientId
    });
    if (typeof ticket.getPayload() === 'undefined') return undefined;
    const { email, given_name: GIVEN_NAME, family_name: FAMILY_NAME } = ticket.getPayload() as TokenPayload;
    console.log(email, GIVEN_NAME, FAMILY_NAME);
    return await this.googleLogin({
      email: email as string,
      firstName: GIVEN_NAME as string,
      lastName: FAMILY_NAME as string
    });
  }

  async signUp(newUser: CreateUserDto) {
    await this.userService.addUser(newUser);
    const { id, username } = (await this.userService.getOneUserByEmail(newUser.email)) as User;
    return {
      ACCESS_TOKEN: this.jwtService.sign({ id, username })
    };
  }
}
