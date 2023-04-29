import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class SignUpGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    if (await this.userService.ifUserExists({ email: req.body.email })) {
      throw new BadRequestException('The email already exists');
    }
    return true;
  }
}
