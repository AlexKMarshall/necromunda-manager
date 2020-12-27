import { PartialType } from '@nestjs/mapped-types';
import { CreateFighterPrototypeDto } from './create-fighter-prototype.dto';

export class UpdateFighterPrototypeDto extends PartialType(CreateFighterPrototypeDto) {}
