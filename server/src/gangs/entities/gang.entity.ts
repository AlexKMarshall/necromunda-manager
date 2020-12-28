import { Faction } from 'src/factions/entities/faction.entity';
import { User } from 'src/users/entities/user.entity';
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

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  userId: string;
}
