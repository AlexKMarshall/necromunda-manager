import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class FighterClass {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
}
