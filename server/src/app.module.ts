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
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { AppController } from './app.controller';

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
          entities: [Faction, FighterClass, FighterPrototype, User],
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
    FighterPrototypesModule,
    FighterClassesModule,
    AuthModule,
    UsersModule,
    ConfigModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
