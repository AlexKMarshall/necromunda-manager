import { Module } from '@nestjs/common';
import { GangsService } from './gangs.service';
import { GangsController } from './gangs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gang } from './entities/gang.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Gang])],
  controllers: [GangsController],
  providers: [GangsService],
})
export class GangsModule {}
