import * as faker from 'faker';
import { CreateFactionDto } from '../../../src/factions/dto/create-faction.dto';
import { CreateFighterClassDto } from '../../../src/fighter-classes/dto/create-fighter-class.dto';
import { CreateFighterPrototypeDto } from '../../../src/fighter-prototypes/dto/create-fighter-prototype.dto';

export function buildCreateFactionDTO(
  overrides: Partial<CreateFactionDto> = {},
): CreateFactionDto {
  return {
    name: faker.company.companyName(),
    ...overrides,
  };
}

export function buildCreateFighterClassDTO(
  overrides: Partial<CreateFighterClassDto> = {},
): CreateFighterClassDto {
  return { name: faker.company.bsNoun(), ...overrides };
}

export function buildCreateFighterPrototypeDTO(
  overrides: Partial<CreateFighterPrototypeDto> = {},
): CreateFighterPrototypeDto {
  return {
    name: faker.company.bsBuzz(),
    cost: faker.random.number(100),
    fighterClass: buildCreateFighterClassDTO(),
    faction: buildCreateFactionDTO(),
    ...overrides,
  };
}
