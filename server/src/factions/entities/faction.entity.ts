import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Faction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
}
