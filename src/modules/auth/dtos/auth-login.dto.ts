import { UserInterface } from 'src/modules/user/interfaces/user.interface';

export class AuthLoginDto extends Request {
  user: Pick<UserInterface, 'id' | 'username'>;
}
