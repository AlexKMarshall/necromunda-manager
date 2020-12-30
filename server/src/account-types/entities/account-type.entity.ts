import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AccountType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
}
