import { UserInterface } from 'src/modules/user/interfaces/user.interface';

export class AuthLoginRequest extends Request {
  user: Pick<UserInterface, 'id' | 'username'>;
}

export class AuthGoogleLoginRequest extends Request {
  user: {
    email: string;
    firstName: string;
    lastName: string;
  };
}
