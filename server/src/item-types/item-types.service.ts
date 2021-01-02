import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateItemTypeDto } from './dto/create-item-type.dto';
import { UpdateItemTypeDto } from './dto/update-item-type.dto';
import { ItemType } from './entities/item-type.entity';

@Injectable()
export class ItemTypesService {
  constructor(
    @InjectRepository(ItemType)
    private itemTypesRepository: Repository<ItemType>,
  ) {}
  create(createItemTypeDto: CreateItemTypeDto) {
    return this.itemTypesRepository.save(createItemTypeDto);
  }

  findAll() {
    return this.itemTypesRepository.find();
  }

  async findOne(id: string) {
    try {
      const itemType = await this.itemTypesRepository.findOne(id);
      if (!itemType) {
        throw new HttpException('itemTypeId not found', HttpStatus.NOT_FOUND);
      }
      return itemType;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async update(id: string, updateItemTypeDto: UpdateItemTypeDto) {
    return this.findOne(id).then((itemType) =>
      this.itemTypesRepository.save({ ...itemType, ...updateItemTypeDto }),
    );
  }

  remove(id: string) {
    return this.findOne(id).then((itemType) =>
      this.itemTypesRepository.delete(itemType),
    );
  }
}
