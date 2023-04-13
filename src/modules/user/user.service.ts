import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  // async getOneUser(userId: number): Promise<User | null> {
  //   return await this.userRepository.findOne({ where: { id: userId } });
  // }

  async addUser(user: CreateUserDto): Promise<void> {
    await this.userRepository.save(user);
  }
}
