import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ItemType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
}
