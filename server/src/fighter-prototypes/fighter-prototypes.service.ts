import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFighterPrototypeDto } from './dto/create-fighter-prototype.dto';
import { UpdateFighterPrototypeDto } from './dto/update-fighter-prototype.dto';
import { FighterPrototype } from './entities/fighter-prototype.entity';

@Injectable()
export class FighterPrototypesService {
  constructor(
    @InjectRepository(FighterPrototype)
    private fighterPrototypeRepository: Repository<FighterPrototype>,
  ) {}
  create(createFighterPrototypeDto: CreateFighterPrototypeDto) {
    return this.fighterPrototypeRepository.save(createFighterPrototypeDto);
  }

  findAll() {
    return this.fighterPrototypeRepository.find({
      relations: ['faction', 'fighterClass'],
    });
  }

  findOne(id: string) {
    return this.fighterPrototypeRepository.findOne(id, {
      relations: ['faction', 'fighterClass'],
    });
  }

  async update(
    id: string,
    updateFighterPrototypeDto: UpdateFighterPrototypeDto,
  ) {
    try {
      const fighterPrototype = await this.fighterPrototypeRepository.findOne(
        id,
        {
          relations: ['faction', 'fighterClass'],
        },
      );
      return this.fighterPrototypeRepository.save({
        ...fighterPrototype,
        ...updateFighterPrototypeDto,
      });
    } catch (reason) {
      return Promise.reject(reason);
    }
  }

  async remove(id: string) {
    try {
      const fighterPrototype = await this.fighterPrototypeRepository.findOne(
        id,
        {
          relations: ['faction', 'fighterClass'],
        },
      );
      return this.fighterPrototypeRepository.remove(fighterPrototype);
    } catch (reason) {
      return Promise.reject(reason);
    }
  }
}
