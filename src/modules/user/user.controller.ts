import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(200)
  async getAllUsers() {
    const user = await this.userService.getAllUsers();
    if (user === undefined) throw new HttpException('No user registered', HttpStatus.NOT_FOUND);
    return user;
  }

  @Get(':id')
  @HttpCode(200)
  async getOneUser(@Param('id', new ParseIntPipe()) userId: number) {
    const user = await this.userService.getOneUserById(userId);
    if (user === null) throw new HttpException('User Not found', HttpStatus.NOT_FOUND);
    return user;
  }

  @Post()
  @HttpCode(204)
  async createUser(@Body() newUser: CreateUserDto) {
    await this.userService.addUser(newUser);
  }

  @Put(':id')
  @HttpCode(204)
  async updateUser(@Param('id', new ParseIntPipe()) userId: number, @Body() updateUser: UpdateUserDto) {
    const user = await this.userService.updateUser(userId, updateUser);
    if (!user)
      throw new HttpException('The user name to be registered already exists', HttpStatus.INTERNAL_SERVER_ERROR);
    return user;
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteUser(@Param('id', new ParseIntPipe()) id: number) {
    const user = await this.userService.deleteUser(id);
    if (!user) throw new HttpException('User Not found', HttpStatus.NOT_FOUND);
  }
}
