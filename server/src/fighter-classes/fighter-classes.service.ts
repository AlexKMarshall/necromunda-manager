import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFighterClassDto } from './dto/create-fighter-class.dto';
import { UpdateFighterClassDto } from './dto/update-fighter-class.dto';
import { FighterClass } from './entities/fighter-class.entity';

@Injectable()
export class FighterClassesService {
  constructor(
    @InjectRepository(FighterClass)
    private fighterClassesRepository: Repository<FighterClass>,
  ) {}
  create(createFighterClassDto: CreateFighterClassDto) {
    return this.fighterClassesRepository.save(createFighterClassDto);
  }

  findAll() {
    return this.fighterClassesRepository.find();
  }

  findOne(id: string) {
    return this.fighterClassesRepository.findOne(id);
  }

  async update(id: string, updateFighterClassDto: UpdateFighterClassDto) {
    try {
      const fighterClass = await this.fighterClassesRepository.findOne(id);
      return this.fighterClassesRepository.save({
        ...fighterClass,
        ...updateFighterClassDto,
      });
    } catch (reason) {
      return Promise.reject(reason);
    }
  }

  async remove(id: string) {
    try {
      const fighterClass = await this.fighterClassesRepository.findOne(id);
      return this.fighterClassesRepository.remove(fighterClass);
    } catch (reason) {
      return Promise.reject(reason);
    }
  }
}
