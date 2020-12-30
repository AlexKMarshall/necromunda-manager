import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFighterDto } from './dto/create-fighter.dto';
import { UpdateFighterDto } from './dto/update-fighter.dto';
import { Fighter } from './entities/fighter.entity';

@Injectable()
export class FightersService {
  constructor(
    @InjectRepository(Fighter) private fightersRepository: Repository<Fighter>,
  ) {}

  create(createFighterDto: CreateFighterDto, gangId: string) {
    return this.fightersRepository.save({ ...createFighterDto, gangId });
  }

  findByGangId(gangId: string) {
    return this.fightersRepository.find({ gangId });
  }

  async findOne(id: string) {
    try {
      const fighter = this.fightersRepository.findOne(id);
      if (!fighter)
        throw new HttpException('fighterId not found', HttpStatus.NOT_FOUND);
      return fighter;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async update(id: string, updateFighterDto: UpdateFighterDto) {
    try {
      const fighter = await this.findOne(id);
      return this.fightersRepository.save({ ...fighter, ...updateFighterDto });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async remove(id: string) {
    try {
      const fighter = await this.findOne(id);
      return this.fightersRepository.delete(fighter);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
