import { Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { FighterPrototypesModule } from '../fighter-prototypes/fighter-prototypes.module';
import { PurchaseController } from './purchase.controller';
import { AccountsModule } from 'src/accounts/accounts.module';
import { FightersModule } from 'src/fighters/fighters.module';
import { PostingsModule } from 'src/postings/postings.module';

@Module({
  imports: [
    FighterPrototypesModule,
    AccountsModule,
    FightersModule,
    PostingsModule,
  ],
  providers: [PurchaseService],
  controllers: [PurchaseController],
})
export class PurchaseModule {}
