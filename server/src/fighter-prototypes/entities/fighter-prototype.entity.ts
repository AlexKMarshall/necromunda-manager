import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Faction } from '../../factions/entities/faction.entity';
import { FighterClass } from '../../fighter-classes/entities/fighter-class.entity';

@Entity()
export class FighterPrototype {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  cost: number;

  @ManyToOne(() => Faction)
  @JoinColumn()
  faction: Faction;

  @ManyToOne(() => FighterClass)
  @JoinColumn()
  fighterClass: FighterClass;
}
