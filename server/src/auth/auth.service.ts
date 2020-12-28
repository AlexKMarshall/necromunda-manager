import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOne(username);
    if (!user) return null;

    const { passwordHash, ...result } = user;

    const isPwdMatch = await bcrypt.compare(password, passwordHash);

    if (isPwdMatch) {
      return result;
    }
    return null;
  }

  async login(user: Omit<User, 'passwordHash'>) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerUserDto: RegisterUserDto) {
    const { username, password } = registerUserDto;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({
      username,
      passwordHash,
    });
    const payload = { username: user.username, sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }
}
