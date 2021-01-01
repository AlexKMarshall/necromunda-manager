import { AccountType } from 'src/account-types/entities/account-type.entity';
import { Gang } from 'src/gangs/entities/gang.entity';
import { Posting } from 'src/postings/entities/posting.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Gang, { onDelete: 'CASCADE' })
  gang: Gang;

  @Column()
  gangId: string;

  @ManyToOne(() => AccountType)
  accountType: AccountType;

  @OneToMany(() => Posting, (posting) => posting.account)
  postings: Posting[];

  @ManyToOne(() => Account, (account) => account.subAccounts)
  parentAccount: Account;

  @OneToMany(() => Account, (account) => account.parentAccount)
  subAccounts: Account[];
}
