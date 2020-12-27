import { Module } from '@nestjs/common';
import { FighterClassesService } from './fighter-classes.service';
import { FighterClassesController } from './fighter-classes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FighterClass } from './entities/fighter-class.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FighterClass])],
  controllers: [FighterClassesController],
  providers: [FighterClassesService],
})
export class FighterClassesModule {}
