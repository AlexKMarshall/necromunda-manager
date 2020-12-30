import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountTypeDto } from './dto/create-account-type.dto';
import { UpdateAccountTypeDto } from './dto/update-account-type.dto';
import { AccountType } from './entities/account-type.entity';

@Injectable()
export class AccountTypesService {
  constructor(
    @InjectRepository(AccountType)
    private accountTypesRepository: Repository<AccountType>,
  ) {}

  create(createAccountTypeDto: CreateAccountTypeDto) {
    return this.accountTypesRepository.save(createAccountTypeDto);
  }

  findAll() {
    return this.accountTypesRepository.find();
  }

  async findOne(id: string) {
    try {
      const accountType = await this.accountTypesRepository.findOne(id);
      if (!accountType) {
        throw new HttpException(
          'accountTypeId not found',
          HttpStatus.NOT_FOUND,
        );
      }
      return accountType;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async update(id: string, updateAccountTypeDto: UpdateAccountTypeDto) {
    try {
      const accountType = await this.findOne(id);
      return this.accountTypesRepository.save({
        ...accountType,
        ...updateAccountTypeDto,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async remove(id: string) {
    try {
      const accountType = await this.findOne(id);
      return this.accountTypesRepository.delete(accountType);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findByName(name: string) {
    return this.accountTypesRepository.find({ name });
  }
}
