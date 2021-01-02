import { Module } from '@nestjs/common';
import { ItemTypesService } from './item-types.service';
import { ItemTypesController } from './item-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemType } from './entities/item-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ItemType])],
  controllers: [ItemTypesController],
  providers: [ItemTypesService],
})
export class ItemTypesModule {}
