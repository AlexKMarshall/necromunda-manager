import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWeaponDto } from './dto/create-weapon.dto';
import { UpdateWeaponDto } from './dto/update-weapon.dto';
import { Weapon } from './entities/weapon.entity';

@Injectable()
export class WeaponsService {
  constructor(
    @InjectRepository(Weapon) private weaponsRepository: Repository<Weapon>,
  ) {}
  create(createWeaponDto: CreateWeaponDto) {
    return this.weaponsRepository.save(createWeaponDto);
  }

  findAll() {
    return this.weaponsRepository.find();
  }

  async findOne(id: string) {
    try {
      const weapon = await this.weaponsRepository.findOne(id);
      if (!weapon) {
        throw new HttpException('WeaponId not found', HttpStatus.NOT_FOUND);
      }
      return weapon;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  update(id: string, updateWeaponDto: UpdateWeaponDto) {
    return this.findOne(id).then((weapon) =>
      this.weaponsRepository.save({ ...weapon, ...updateWeaponDto }),
    );
  }

  remove(id: string) {
    return this.findOne(id).then((weapon) =>
      this.weaponsRepository.remove(weapon),
    );
  }
}
