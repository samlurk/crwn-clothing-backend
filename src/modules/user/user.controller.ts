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
  Put,
  UseGuards
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRole } from './enums/user-role.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('admin/user')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @HttpCode(200)
  async getAllUsers() {
    try {
      return await this.userService.getAllUsers();
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else throw new HttpException('INTERNAL SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('admin/user/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @HttpCode(200)
  async getOneUser(@Param('id', new ParseIntPipe()) userId: number) {
    try {
      return await this.userService.getOneUserById(userId);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else throw new HttpException('INTERNAL SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('admin/user')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @HttpCode(201)
  async createUser(@Body() newUser: CreateUserDto) {
    try {
      return await this.userService.addUser(newUser);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else throw new HttpException('INTERNAL SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('admin/user/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @HttpCode(204)
  async updateUser(@Param('id', new ParseIntPipe()) userId: number, @Body() updateUser: UpdateUserDto) {
    try {
      return await this.userService.updateUser(userId, updateUser);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else throw new HttpException('INTERNAL SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('admin/user/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @HttpCode(204)
  async deleteUser(@Param('id', new ParseIntPipe()) id: number) {
    try {
      return await this.userService.deleteUser(id);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else throw new HttpException('INTERNAL SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
