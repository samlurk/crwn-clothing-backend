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

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @HttpCode(200)
  async getAllUsers() {
    try {
      const userResponse = await this.userService.getAllUsers();
      return userResponse;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else throw new HttpException('INTERNAL SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @HttpCode(200)
  async getOneUser(@Param('id', new ParseIntPipe()) userId: number) {
    try {
      const userResponse = await this.userService.getOneUserById(userId);
      return userResponse;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else throw new HttpException('INTERNAL SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @HttpCode(204)
  async createUser(@Body() newUser: CreateUserDto) {
    try {
      await this.userService.addUser(newUser);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else throw new HttpException('INTERNAL SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @HttpCode(204)
  async updateUser(@Param('id', new ParseIntPipe()) userId: number, @Body() updateUser: UpdateUserDto) {
    try {
      await this.userService.updateUser(userId, updateUser);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else throw new HttpException('INTERNAL SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @HttpCode(204)
  async deleteUser(@Param('id', new ParseIntPipe()) id: number) {
    try {
      await this.userService.deleteUser(id);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      else throw new HttpException('INTERNAL SERVER ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
