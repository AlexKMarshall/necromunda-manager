import { CreateFactionDto } from '../../factions/dto/create-faction.dto';
import { CreateFighterClassDto } from '../../fighter-classes/dto/create-fighter-class.dto';

export class CreateFighterPrototypeDto {
  name: string;
  cost: number;
  fighterClass: CreateFighterClassDto;
  faction: CreateFactionDto;
}
