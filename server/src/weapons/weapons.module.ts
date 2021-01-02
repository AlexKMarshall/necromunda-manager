import { Module } from '@nestjs/common';
import { WeaponsService } from './weapons.service';
import { WeaponsController } from './weapons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Weapon } from './entities/weapon.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Weapon])],
  controllers: [WeaponsController],
  providers: [WeaponsService],
})
export class WeaponsModule {}
