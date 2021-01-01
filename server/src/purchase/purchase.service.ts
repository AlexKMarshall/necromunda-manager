import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ACCOUNT_NAMES } from 'src/accounts/accounts.constants';
import { AccountsService } from 'src/accounts/accounts.service';
import { FighterPrototype } from 'src/fighter-prototypes/entities/fighter-prototype.entity';
import { FighterPrototypesService } from 'src/fighter-prototypes/fighter-prototypes.service';
import { Fighter } from 'src/fighters/entities/fighter.entity';
import { FightersService } from 'src/fighters/fighters.service';
import { PostingsService } from 'src/postings/postings.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';

@Injectable()
export class PurchaseService {
  constructor(
    private fighterPrototypesService: FighterPrototypesService,
    private accountsService: AccountsService,
    private fightersService: FightersService,
    private postingsService: PostingsService,
  ) {}

  async executePurchase(basket: CreatePurchaseDto, gangId: string) {
    try {
      const fighterPrototypes = await this.getFighterPrototypes(
        basket.fighterPrototypeIds,
      );
      if (!(await this.isSufficientFunds(fighterPrototypes, gangId))) {
        throw new HttpException('Insufficient funds', HttpStatus.FORBIDDEN);
      }

      const fighters = await this.createFighters(fighterPrototypes, gangId);

      await this.makePurchaseFighterPostings(fighters, gangId);
      return { message: 'done' };
    } catch (error) {
      return Promise.reject(error);
    }
  }

  getFighterPrototypes(ids: string[]) {
    const work = ids.map((id) => this.fighterPrototypesService.findOne(id));
    return Promise.all(work);
  }

  async isSufficientFunds(fighterPrototypes: FighterPrototype[], gangId) {
    try {
      const basketCost = fighterPrototypes.reduce(
        (acc, cur) => acc + cur.cost,
        0,
      );
      const stash = await this.accountsService.getAccountBalance(
        gangId,
        ACCOUNT_NAMES.STASH,
      );
      return basketCost <= stash;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  createFighters(fighterPrototypes: FighterPrototype[], gangId: string) {
    const work = fighterPrototypes.map((fighterPrototype) =>
      this.fightersService.create({ fighterPrototype }, gangId),
    );

    return Promise.all(work);
  }

  async makePurchaseFighterPostings(fighters: Fighter[], gangId) {
    try {
      const [stash] = await this.accountsService.findByName(
        gangId,
        ACCOUNT_NAMES.STASH,
      );
      const work = fighters.map(async (fighter) => {
        try {
          const [fighterAccount] = await this.accountsService.findByName(
            gangId,
            fighter.id,
          );
          return this.postingsService.createDoubleEntry(
            fighterAccount,
            stash,
            fighter.fighterPrototype.cost,
          );
        } catch (error) {
          return Promise.reject(error);
        }
      });
      return Promise.all(work);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
