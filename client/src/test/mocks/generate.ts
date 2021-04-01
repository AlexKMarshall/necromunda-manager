import faker from "faker";
import {
  Faction,
  FighterClass,
  FighterPrototype,
  FighterStats,
} from "../../schemas";
import * as factionsDb from "./db/factions";
import * as fighterClassesDb from "./db/fighter-classes";

function buildFaction(overrides?: Partial<Faction>): Faction {
  return {
    id: faker.random.uuid(),
    name: faker.company.companyName(),
    ...overrides,
  };
}

function buildFighterClass(overrides?: Partial<FighterClass>): FighterClass {
  return {
    id: faker.random.uuid(),
    name: faker.company.bsNoun(),
    ...overrides,
  };
}

async function buildFighterPrototype({
  faction,
  fighterClass,
  fighterStats,
  ...overrides
}: Partial<FighterPrototype> = {}): Promise<FighterPrototype> {
  return {
    id: faker.random.uuid(),
    name: faker.name.jobTitle(),
    cost: faker.random.number(150),
    faction: faction ?? (await factionsDb.insert(buildFaction()))[0],
    fighterClass:
      fighterClass ?? (await fighterClassesDb.insert(buildFighterClass()))[0],
    fighterStats: fighterStats ?? buildFighterStats(),
  };
}

function buildFighterStats(overrides?: Partial<FighterStats>): FighterStats {
  return {
    movement: faker.random.number(7),
    weaponSkill: faker.random.number(7),
    ballisticSkill: faker.random.number(7),
    strength: faker.random.number(7),
    toughness: faker.random.number(7),
    wounds: faker.random.number(7),
    initiative: faker.random.number(7),
    attacks: faker.random.number(7),
    leadership: faker.random.number(11),
    cool: faker.random.number(11),
    will: faker.random.number(11),
    intelligence: faker.random.number(11),
  };
}

export {
  buildFaction,
  buildFighterClass,
  buildFighterPrototype,
  buildFighterStats,
};
