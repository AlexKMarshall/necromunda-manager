import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ACCOUNT_NAMES } from 'src/accounts/accounts.constants';
import { AccountsService } from 'src/accounts/accounts.service';
import { Repository } from 'typeorm';
import { CreateFighterDto } from './dto/create-fighter.dto';
import { UpdateFighterDto } from './dto/update-fighter.dto';
import { Fighter } from './entities/fighter.entity';

@Injectable()
export class FightersService {
  constructor(
    @InjectRepository(Fighter) private fightersRepository: Repository<Fighter>,
    private accountsService: AccountsService,
  ) {}

  async create(createFighterDto: CreateFighterDto, gangId: string) {
    try {
      const fighter = await this.fightersRepository.save({
        ...createFighterDto,
        gangId,
        xp: 0,
      });
      const [fighterParentAccount] = await this.accountsService.findByName(
        gangId,
        ACCOUNT_NAMES.FIGHTERS,
      );

      await this.accountsService.create(
        {
          accountType: fighterParentAccount.accountType,
          name: fighter.id,
          parentAccount: fighterParentAccount,
        },
        gangId,
      );
      return fighter;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findByGangId(gangId: string) {
    try {
      const fighters = await this.fightersRepository.find({
        where: { gangId },
        relations: ['fighterPrototype'],
      });

      const pCosts = fighters.map((f) =>
        this.accountsService.getAccountBalance(gangId, f.id),
      );
      const costs = await Promise.all(pCosts);

      return fighters.map((fighter, index) => ({
        ...fighter,
        cost: costs[index],
      }));
    } catch (error) {
      return Promise.reject(error);
    }
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
