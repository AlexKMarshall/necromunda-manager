import { Account } from 'src/accounts/entities/account.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Posting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Account)
  account: Account;

  @Column()
  debitAmount: number;

  @Column()
  creditAmount: number;
}
