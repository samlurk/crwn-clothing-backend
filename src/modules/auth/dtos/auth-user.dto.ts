import { UserInterface } from 'src/modules/user/interfaces/user.interface';

export class AuthUserDto extends Request {
  user: Pick<UserInterface, 'id' | 'username'>;
}
