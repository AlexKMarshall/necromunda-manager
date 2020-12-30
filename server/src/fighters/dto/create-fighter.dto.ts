import { FighterPrototype } from 'src/fighter-prototypes/entities/fighter-prototype.entity';

export class CreateFighterDto {
  name: string;
  fighterPrototype: FighterPrototype;
}
