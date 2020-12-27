import { Module } from '@nestjs/common';
import { FighterPrototypesService } from './fighter-prototypes.service';
import { FighterPrototypesController } from './fighter-prototypes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FighterPrototype } from './entities/fighter-prototype.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FighterPrototype])],
  controllers: [FighterPrototypesController],
  providers: [FighterPrototypesService],
})
export class FighterPrototypesModule {}
