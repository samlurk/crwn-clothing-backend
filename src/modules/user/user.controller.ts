import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  // @Get(':id')
  // async getOneUser(@Param() userId: number) {
  //   return await this.userService.getOneUser(userId);
  // }

  @Post()
  async createUser(@Body() newUser: CreateUserDto) {
    await this.userService.addUser(newUser);
    return 'User created';
  }
}
