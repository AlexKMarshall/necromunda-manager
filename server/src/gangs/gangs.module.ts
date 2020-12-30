import { Module } from '@nestjs/common';
import { GangsService } from './gangs.service';
import { GangsController } from './gangs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gang } from './entities/gang.entity';
import { AccountsModule } from 'src/accounts/accounts.module';
import { PostingsModule } from 'src/postings/postings.module';

@Module({
  imports: [TypeOrmModule.forFeature([Gang]), AccountsModule, PostingsModule],
  controllers: [GangsController],
  providers: [GangsService],
})
export class GangsModule {}
