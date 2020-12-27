import { Module } from '@nestjs/common';
import { FactionsService } from './factions.service';
import { FactionsController } from './factions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Faction } from './entities/faction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Faction])],
  controllers: [FactionsController],
  providers: [FactionsService],
  exports: [FactionsService],
})
export class FactionsModule {}
