import { WeaponType } from '../entities/weapon.entity';

export class CreateWeaponDto {
  name: string;
  cost: number;
  weaponType: WeaponType;
}
