import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

  async ifUserExists(userData: object): Promise<boolean> {
    return await this.userRepository.exist({ where: userData });
  }

  async getAllUsers(): Promise<User[]> {
    const userResponse = await this.userRepository.find();
    if (userResponse.length === 0 || typeof userResponse[0] === undefined)
      throw new HttpException('user/no-user-found', HttpStatus.NOT_FOUND);
    return userResponse;
  }

  async getOneUserById(id: number): Promise<User> {
    const userResponse = await this.userRepository.findOne({ where: { id } });
    if (userResponse === null) throw new HttpException('user/user-not-found', HttpStatus.NOT_FOUND);
    return userResponse;
  }

  async getOneUserByUsername(username: string): Promise<User> {
    const userResponse = await this.userRepository.findOne({ where: { username } });
    if (userResponse === null) throw new HttpException('user/user-not-found', HttpStatus.NOT_FOUND);
    return userResponse;
  }

  async getOneUserByEmail(email: string): Promise<User> {
    const userResponse = await this.userRepository.findOne({ where: { email } });
    if (userResponse === null) throw new HttpException('user/user-not-found', HttpStatus.NOT_FOUND);
    return userResponse;
  }

  async addUser(newUser: CreateUserDto) {
    if (typeof newUser.password === 'string') {
      newUser.password = await encrypt(newUser.password);
    }
    if (await this.ifUserExists({ email: newUser.email })) {
      throw new HttpException('user/email-already-exists', HttpStatus.BAD_REQUEST);
    }
    return await this.userRepository
      .createQueryBuilder('users')
      .insert()
      .into(User)
      .values({ ...newUser, username: await this.generateUniqueRandomUsername() })
      .execute();
  }

  async addGoogleUser(newUser: Pick<User, 'firstName' | 'lastName' | 'email' | 'avatar'>): Promise<User> {
    const ifUserDataExists = await this.userRepository.findOne({ where: { email: newUser.email } });
    if (ifUserDataExists === null) {
      const user = await this.userRepository
        .createQueryBuilder('users')
        .insert()
        .into(User)
        .values({ ...newUser, username: await this.generateUniqueRandomUsername() })
        .execute();
      return await this.getOneUserById(user.generatedMaps[0].id);
    } else {
      return ifUserDataExists;
    }
  }

  async findOneByEmailOrUsername(usernameOrEmail: string): Promise<User> {
    const userResponse = await this.userRepository
      .createQueryBuilder('users')
      .where('users.email = :usernameOrEmail OR users.username = :usernameOrEmail', { usernameOrEmail })
      .getOne();
    if (userResponse === null) throw new HttpException('user/username-or-email-not-found', HttpStatus.NOT_FOUND);
    return userResponse;
  }

  async updateUser(id: number, updateUser: UpdateUserDto) {
    if (!(await this.ifUserExists({ id }))) {
      throw new HttpException('user/user-not-found', HttpStatus.NOT_FOUND);
    }
    if (updateUser.email !== undefined) {
      if (await this.ifUserExists({ email: updateUser.email }))
        throw new HttpException('user/email-already-exists', HttpStatus.BAD_REQUEST);
    }
    if (updateUser.username !== undefined) {
      if (await this.ifUserExists({ username: updateUser.username }))
        throw new HttpException('user/username-already-exists', HttpStatus.BAD_REQUEST);
    }
    if (updateUser.phone !== undefined) {
      if (await this.ifUserExists({ phone: updateUser.phone }))
        throw new HttpException('user/phone-already-exists', HttpStatus.BAD_REQUEST);
    }
    return await this.userRepository
      .createQueryBuilder('users')
      .update(User)
      .set(updateUser)
      .where('id = :id', { id })
      .execute();
  }

  async deleteUser(id: number) {
    if (!(await this.userRepository.exist({ where: { id } }))) {
      throw new HttpException('user/user-not-found', HttpStatus.NOT_FOUND);
    }
    return await this.userRepository
      .createQueryBuilder('users')
      .delete()
      .from(User)
      .where('id = :id', { id })
      .execute();
  }

  async generateUniqueRandomUsername() {
    let username = generateRandomUsername();
    while (await this.ifUserExists({ username })) {
      username = generateRandomUsername();
    }
    return username;
  }
}
