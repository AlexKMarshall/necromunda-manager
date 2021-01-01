import { AccountType } from 'src/account-types/entities/account-type.entity';
import { Account } from '../entities/account.entity';

export class CreateAccountDto {
  name: string;
  accountType: AccountType;
  parentAccount?: Account;
}
