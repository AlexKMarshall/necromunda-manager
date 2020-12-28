import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gang } from './entities/gang.entity';
import { CreateGangDto } from './dto/create-gang.dto';
import { UpdateGangDto } from './dto/update-gang.dto';
import { User } from 'src/users/entities/user.entity';
import e from 'express';

@Injectable()
export class GangsService {
  constructor(
    @InjectRepository(Gang) private gangsRepository: Repository<Gang>,
  ) {}
  create(
    createGangDtoWithUser: CreateGangDto & { user: Omit<User, 'passwordHash'> },
  ) {
    return this.gangsRepository.save(createGangDtoWithUser);
  }

  findByUserId(userId: string) {
    return this.gangsRepository.find({
      where: { user: { id: userId } },
      relations: ['faction'],
    });
  }

  async findOne(id: string, userId: string) {
    try {
      const gang = await this.gangsRepository.findOne(id, {
        relations: ['faction'],
      });
      if (!gang) {
        throw new HttpException('gang not found', HttpStatus.NOT_FOUND);
      }
      if (userId !== gang.userId) {
        throw new HttpException(
          `You don't have permission to view this gang`,
          HttpStatus.FORBIDDEN,
        );
      }
      return gang;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async update(id: string, updateGangDto: UpdateGangDto, userId: string) {
    try {
      const gang = await this.findOne(id, userId);
      return this.gangsRepository.save({ ...gang, ...updateGangDto });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async remove(id: string, userId: string) {
    try {
      const gang = await this.findOne(id, userId);
      return this.gangsRepository.delete(gang);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
