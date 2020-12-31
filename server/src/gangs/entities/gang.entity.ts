import { Faction } from 'src/factions/entities/faction.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Gang {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Faction)
  @JoinColumn()
  faction: Faction;

  @Column()
  userId: string;
}
