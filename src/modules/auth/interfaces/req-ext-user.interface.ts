import { Request } from 'express';
import { SessionInterface } from './session.interface';

export class ReqExtUserInterface extends Request {
  user?: SessionInterface;
}
