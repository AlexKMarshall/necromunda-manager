import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

const WEAPON_TYPES = [
  'basic weapon',
  'pistol',
  'special weapon',
  'heavy weapon',
  'close combat weapon',
] as const;

type WeaponTypeTuple = typeof WEAPON_TYPES;
export type WeaponType = WeaponTypeTuple[number];

@Entity()
export class Weapon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  cost: number;

  @Column({ type: 'enum', enum: WEAPON_TYPES })
  weaponType: WeaponType;
}
