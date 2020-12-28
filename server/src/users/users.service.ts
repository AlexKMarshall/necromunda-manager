import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.usersRepository.save(createUserDto);
      return user;
    } catch (error) {
      if (/already exists/i.test(error.detail)) {
        throw new HttpException(
          `Username ${createUserDto.username} already exists`,
          HttpStatus.CONFLICT,
        );
      }
      return Promise.reject(error);
    }
  }

  findOne(username: string): Promise<User> {
    return this.usersRepository
      .find({ username })
      .then((users) => (users.length > 0 ? users[0] : undefined));
  }
}
