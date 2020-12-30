import { AccountType } from 'src/account-types/entities/account-type.entity';

export class CreateAccountDto {
  name: string;
  accountType: AccountType;
}
