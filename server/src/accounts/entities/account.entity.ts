import { AccountType } from 'src/account-types/entities/account-type.entity';
import { Gang } from 'src/gangs/entities/gang.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
}
