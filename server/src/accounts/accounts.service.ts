import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountTypesService } from 'src/account-types/account-types.service';
import { Repository } from 'typeorm';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';
import { ACCOUNTS } from './accounts.constants';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account) private accountsRepository: Repository<Account>,
    private accountTypesService: AccountTypesService,
  ) {}

  create(createAccountDto: CreateAccountDto, gangId: string) {
    return this.accountsRepository.save({ ...createAccountDto, gangId });
  }

  findByGangId(gangId: string) {
    return this.accountsRepository.find({ gangId });
  }

  async findOne(id: string) {
    try {
      const account = await this.accountsRepository.findOne(id);
      if (!account) {
        throw new HttpException('accountId not found', HttpStatus.NOT_FOUND);
      }
      return account;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async update(id: string, updateAccountDto: UpdateAccountDto) {
    try {
      const account = await this.findOne(id);
      return this.accountsRepository.save({ ...account, ...updateAccountDto });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async remove(id: string) {
    try {
      const account = await this.findOne(id);
      return this.accountsRepository.delete(account);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async createDefaultAccounts(gangId: string) {
    const work = ACCOUNTS.map(async (account) => {
      const [accountType] = await this.accountTypesService.findByName(
        account.accountType.name,
      );
      return this.create({ ...account, accountType }, gangId);
    });

    return Promise.all(work);
  }

  findByName(gangId: string, name: string) {
    return this.accountsRepository.find({
      where: {
        gangId,
        name,
      },
      relations: ['accountType'],
    });
  }

  getAccountBalance(gangId: string, accountName: string) {
    return this.accountsRepository
      .createQueryBuilder('account')
      .select(
        'SUM(posting.debitAmount - posting.creditAmount)',
        'accountBalance',
      )
      .leftJoin('account.postings', 'posting')
      .where('account.gangId = :gangId ', { gangId })
      .andWhere('account.name = :accountName', { accountName })
      .getRawOne()
      .then(({ accountBalance }) => Number(accountBalance));
  }
}
