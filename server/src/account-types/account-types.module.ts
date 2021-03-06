import { Module } from '@nestjs/common';
import { AccountTypesService } from './account-types.service';
import { AccountTypesController } from './account-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountType } from './entities/account-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AccountType])],
  controllers: [AccountTypesController],
  providers: [AccountTypesService],
  exports: [AccountTypesService],
})
export class AccountTypesModule {}
