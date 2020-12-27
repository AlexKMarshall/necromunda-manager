import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Faction } from '../../factions/entities/faction.entity';
import { FighterClass } from '../../fighter-classes/entities/fighter-class.entity';

@Entity()
export class FighterPrototype {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToOne(() => Faction)
  @JoinColumn()
  faction: Faction;

  @OneToOne(() => FighterClass)
  @JoinColumn()
  fighterClass: FighterClass;
}
