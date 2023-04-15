import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  @Get(':id')
  async getOneUser(@Param('id', new ParseIntPipe()) userId: number) {
    return await this.userService.getOneUserById(userId);
  }

  @Post()
  async createUser(@Body() newUser: CreateUserDto) {
    await this.userService.addUser(newUser);
  }

  @Put(':id')
  async updateUser(@Param('id', new ParseIntPipe()) userId: number, @Body() updateUser: UpdateUserDto) {
    await this.userService.updateUser(userId, updateUser);
  }

  @Delete(':id')
  async deleteUser(@Param('id', new ParseIntPipe()) id: number) {
    await this.userService.deleteUser(id);
  }
}
