import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FactionsModule } from './factions/factions.module';
import { Faction } from './factions/entities/faction.entity';
import { FighterPrototypesModule } from './fighter-prototypes/fighter-prototypes.module';
import { FighterClassesModule } from './fighter-classes/fighter-classes.module';
import { FighterClass } from './fighter-classes/entities/fighter-class.entity';
import { FighterPrototype } from './fighter-prototypes/entities/fighter-prototype.entity';

@Module({
  imports: [
    FactionsModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot()],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('POSTGRES_HOST'),
          database: configService.get('POSTGRES_DATABASE'),
          entities: [Faction, FighterClass, FighterPrototype],
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
    FighterPrototypesModule,
    FighterClassesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
