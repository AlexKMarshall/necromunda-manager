import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FactionsModule } from './factions/factions.module';
import { Faction } from './factions/entities/faction.entity';
import { FighterPrototypesModule } from './fighter-prototypes/fighter-prototypes.module';
import { FighterClassesModule } from './fighter-classes/fighter-classes.module';
import { FighterClass } from './fighter-classes/entities/fighter-class.entity';
import { FighterPrototype } from './fighter-prototypes/entities/fighter-prototype.entity';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { GangsModule } from './gangs/gangs.module';
import { Gang } from './gangs/entities/gang.entity';
import { AccountTypesModule } from './account-types/account-types.module';
import { AccountType } from './account-types/entities/account-type.entity';
import { AccountsModule } from './accounts/accounts.module';
import { Account } from './accounts/entities/account.entity';
import { FightersModule } from './fighters/fighters.module';
import { Fighter } from './fighters/entities/fighter.entity';
import { PostingsModule } from './postings/postings.module';
import { Posting } from './postings/entities/posting.entity';
import { PurchaseModule } from './purchase/purchase.module';
import { ItemTypesModule } from './item-types/item-types.module';
import { ItemType } from './item-types/entities/item-type.entity';

@Module({
  imports: [
    FactionsModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('POSTGRES_HOST'),
          database: configService.get('POSTGRES_DATABASE'),
          entities: [
            Faction,
            FighterClass,
            FighterPrototype,
            Gang,
            AccountType,
            Account,
            Fighter,
            Posting,
            ItemType,
          ],
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
    FighterPrototypesModule,
    FighterClassesModule,
    AuthModule,
    ConfigModule,
    GangsModule,
    AccountTypesModule,
    AccountsModule,
    FightersModule,
    PostingsModule,
    PurchaseModule,
    ItemTypesModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
