import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFactionDto } from './dto/create-faction.dto';
import { UpdateFactionDto } from './dto/update-faction.dto';
import { Faction } from './entities/faction.entity';

@Injectable()
export class FactionsService {
  constructor(
    @InjectRepository(Faction) private factionsRepository: Repository<Faction>,
  ) {}
  create(createFactionDto: CreateFactionDto): Promise<Faction> {
    return this.factionsRepository.save(createFactionDto);
  }

  findAll(): Promise<Faction[]> {
    return this.factionsRepository.find();
  }

  findOne(id: string): Promise<Faction> {
    return this.factionsRepository.findOne(id);
  }

  async update(
    id: string,
    updateFactionDto: UpdateFactionDto,
  ): Promise<Faction> {
    const faction = await this.factionsRepository.findOne(id);
    return this.factionsRepository.save({ ...faction, ...updateFactionDto });
  }

  async remove(id: string): Promise<Faction> {
    const faction = await this.factionsRepository.findOne(id);
    return this.factionsRepository.remove(faction);
  }
}
