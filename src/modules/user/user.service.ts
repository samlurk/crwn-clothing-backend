import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { generateRandomUsername } from '../../helpers/username.helper';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async getAllUsers(): Promise<User[]> {
    const users = await this.userRepository.find();
    if (users.length === 1 && users[0] === undefined) throw new HttpException('User Not found', HttpStatus.NOT_FOUND);
    return users;
  }

  async getOneUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (user === null) throw new HttpException('User Not found', HttpStatus.NOT_FOUND);
    return user;
  }

  async getOneUserByUsername(username: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (user === null) throw new HttpException('User Not found', HttpStatus.NOT_FOUND);
    return user;
  }

  async addUser(user: CreateUserDto): Promise<void> {
    await this.userRepository.save({ ...user, username: await this.generateUniqueRandomUsername() });
  }

  async ifUserExists(userData: object) {
    if (!(await this.userRepository.exist({ where: userData })))
      throw new HttpException('User Not found', HttpStatus.NOT_FOUND);
  }

  async updateUser(id: number, updateUser: UpdateUserDto) {
    await this.ifUserExists({ id });
    if (updateUser.username !== undefined) {
      if (await this.isUsernameTaken(updateUser.username))
        throw new HttpException('The user name to be registered already exists', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    await this.userRepository.update(id, updateUser);
  }

  async deleteUser(id: number) {
    if (await this.userRepository.exist({ where: { id } })) {
      await this.userRepository.delete({ id });
      return;
    }
    throw new HttpException('User Not found', HttpStatus.NOT_FOUND);
  }

  async isUsernameTaken(username: string) {
    return await this.userRepository.exist({ where: { username } });
  }

  async generateUniqueRandomUsername() {
    let username = generateRandomUsername();
    while (await this.isUsernameTaken(username)) {
      username = generateRandomUsername();
    }
    return username;
  }
}
