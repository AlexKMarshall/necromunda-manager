import { FighterPrototype } from 'src/fighter-prototypes/entities/fighter-prototype.entity';
import { Gang } from 'src/gangs/entities/gang.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Fighter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => FighterPrototype)
  fighterPrototype: FighterPrototype;

  @ManyToOne(() => Gang)
  gang: Gang;

  @Column()
  gangId: string;
}
