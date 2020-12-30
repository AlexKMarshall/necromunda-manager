import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gang } from './entities/gang.entity';
import { CreateGangDto } from './dto/create-gang.dto';
import { UpdateGangDto } from './dto/update-gang.dto';
import { User } from 'src/users/entities/user.entity';
import { AccountsService } from 'src/accounts/accounts.service';
import { ACCOUNT_NAMES } from 'src/accounts/accounts.constants';
import { PostingsService } from 'src/postings/postings.service';

@Injectable()
export class GangsService {
  constructor(
    @InjectRepository(Gang) private gangsRepository: Repository<Gang>,
    private accountsService: AccountsService,
    private postingsService: PostingsService,
  ) {}

  async create(
    createGangDtoWithUser: CreateGangDto & { user: Omit<User, 'passwordHash'> },
  ) {
    try {
      const gang = await this.gangsRepository.save(createGangDtoWithUser);
      await this.accountsService.createDefaultAccounts(gang.id);
      await this.setInitialStash(gang.id);
      return gang;
    } catch (error) {
      return Promise.reject(error);
    }
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

  async setInitialStash(gangId: string) {
    const [stash] = await this.accountsService.findByName(
      gangId,
      ACCOUNT_NAMES.STASH,
    );
    const [initialEquity] = await this.accountsService.findByName(
      gangId,
      ACCOUNT_NAMES.INITIAL_EQUITY,
    );
    await this.postingsService.createDoubleEntry(
      stash,
      initialEquity,
      INITIAL_STASH_VALUE,
    );
  }
}

const INITIAL_STASH_VALUE = 1000;
