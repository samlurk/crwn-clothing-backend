import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { generateRandomUsername } from '../../helpers/username.helper';
import { UpdateUserDto } from './dtos/update-user.dto';
import { encrypt } from 'src/helpers/bcrypt.helper';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async getAllUsers(): Promise<User[] | undefined> {
    const users = await this.userRepository.find();
    if (users.length === 0 || typeof users[0] === undefined) return undefined;
    return users;
  }

  async getOneUserById(id: number): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (user === null) return null;
    return user;
  }

  async getOneUserByUsername(username: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (user === null) return null;
    return user;
  }

  async getOneUserByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user === null) return null;
    return user;
  }

  async addUser(user: CreateUserDto): Promise<void> {
    if (typeof user.password === 'string') {
      user.password = await encrypt(user.password);
    }
    await this.userRepository.save({ ...user, username: await this.generateUniqueRandomUsername() });
  }

  async ifUserExists(userData: object): Promise<boolean> {
    if (!(await this.userRepository.exist({ where: userData }))) return false;
    return true;
  }

  async updateUser(id: number, updateUser: UpdateUserDto) {
    await this.ifUserExists({ id });
    if (updateUser.username !== undefined) {
      if (await this.isUsernameTaken(updateUser.username)) return false;
    }
    await this.userRepository.update(id, updateUser);
    return true;
  }

  async deleteUser(id: number): Promise<boolean> {
    if (await this.userRepository.exist({ where: { id } })) {
      await this.userRepository.delete({ id });
      return true;
    }
    return false;
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
