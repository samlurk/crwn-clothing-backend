import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { CreateUserDto } from '../user/dtos/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async login({ id, username, email, role, avatar }: any) {
    const payload = { id, username, email, role, avatar };
    return {
      ACCESS_TOKEN: this.jwtService.sign(payload)
    };
  }

  async verifyGoogleCredentials(code: string) {
    const client = new OAuth2Client(
      this.configService.get<string>('googleId'),
      this.configService.get<string>('googleSecret'),
      'postmessage'
    );

    const {
      tokens: { id_token: ID_TOKEN }
    } = await client.getToken(code);

    if (typeof ID_TOKEN === 'undefined') throw new HttpException('auth/wrong-auth-code', HttpStatus.BAD_REQUEST);

    const ticket = await client.verifyIdToken({
      idToken: ID_TOKEN as string,
      audience: client._clientId
    });

    if (typeof ticket.getPayload() === 'undefined')
      throw new HttpException('auth/error-verifying-google-id-token', HttpStatus.BAD_REQUEST);

    const { email, given_name: GIVEN_NAME, family_name: FAMILY_NAME, picture } = ticket.getPayload() as TokenPayload;
    return {
      email: email as string,
      firstName: GIVEN_NAME as string,
      lastName: FAMILY_NAME as string,
      avatar: picture as string
    };
  }

  async loginWithGoogle(code: string) {
    const googleUserData = await this.verifyGoogleCredentials(code);
    const user = await this.userService.addGoogleUser(googleUserData);
    return await this.login(user);
  }

  async signUp(newUser: CreateUserDto) {
    const userResponse = await this.userService.addUser(newUser);
    return await this.login(userResponse);
  }
}
