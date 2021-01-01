import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/accounts/entities/account.entity';
import { Repository } from 'typeorm';
import { Posting } from './entities/posting.entity';

@Injectable()
export class PostingsService {
  constructor(
    @InjectRepository(Posting) private postingsRepository: Repository<Posting>,
  ) {}

  createDoubleEntry(
    debitAccount: Account,
    creditAccount: Account,
    amount: number,
  ) {
    //TODO manage this in a database transaction
    const work = [
      this.postingsRepository.save({
        account: debitAccount,
        debitAmount: amount,
        creditAmount: 0,
      }),
      this.postingsRepository.save({
        account: creditAccount,
        debitAmount: 0,
        creditAmount: amount,
      }),
    ];

    return Promise.all(work);
  }

  findByGangId(gangId: string) {
    return this.postingsRepository
      .createQueryBuilder('posting')
      .leftJoinAndSelect('posting.account', 'account')
      .where('account.gangId = :gangId', { gangId })
      .getMany();
  }
}
