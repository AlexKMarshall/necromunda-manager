import * as faker from "faker";
import { Faction } from "../schemas/faction.schema";
import { FighterClass } from "../schemas/fighter-class.schema";
import { FighterPrototype } from "../schemas/fighter-prototype.schema";
import { Fighter } from "../schemas/fighter.schema";
import { Gang, GangDetail } from "../schemas/gang.schema";

type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object
    ? RecursivePartial<T[P]>
    : T[P];
};

function buildFaction(overrides: RecursivePartial<Faction> = {}): Faction {
  return {
    id: faker.random.uuid(),
    name: faker.company.companyName(),
    ...overrides,
  };
}

function buildFighterClass(
  overrides: RecursivePartial<FighterClass> = {}
): FighterClass {
  return {
    id: faker.random.uuid(),
    name: faker.company.bsNoun(),
    ...overrides,
  };
}

function buildFighterPrototype(
  overrides: RecursivePartial<FighterPrototype> = {}
): FighterPrototype {
  const {
    faction: factionOverrides,
    fighterClass: fighterClassOverrides,
    ...rest
  } = overrides;
  return {
    id: faker.random.uuid(),
    name: faker.commerce.productName(),
    fighterClass: buildFighterClass(fighterClassOverrides),
    faction: buildFaction(factionOverrides),
    cost: faker.random.number(150),
    ...rest,
  };
}

function buildGang(overrides: RecursivePartial<Gang> = {}): Gang {
  const { faction: factionOverrides, ...rest } = overrides;
  return {
    name: faker.lorem.words(),
    id: faker.random.uuid(),
    faction: buildFaction(factionOverrides),
    userId: faker.random.uuid(),
    ...rest,
  };
}

function buildFighter(overrides: RecursivePartial<Fighter> = {}): Fighter {
  const { fighterPrototype: fpOverrides, ...rest } = overrides;
  return {
    name: faker.name.findName(),
    id: faker.random.uuid(),
    fighterPrototype: buildFighterPrototype(fpOverrides),
    cost: faker.random.number(200),
    xp: faker.random.number(20),
    ...rest,
  };
}

function buildGangDetail(
  overrides: RecursivePartial<GangDetail> = {}
): GangDetail {
  const {
    stash: stashOverrides,
    fighters: fightersOverrides,
    ...rest
  } = overrides;

  return {
    ...buildGang(rest),
    fighters: fightersOverrides
      ? fightersOverrides.map((f) => buildFighter(f))
      : new Array(faker.random.number(10)).fill(0).map((_) => buildFighter()),
    stash: stashOverrides ?? faker.random.number(200),
  };
}

export {
  buildFaction,
  buildFighterClass,
  buildFighterPrototype,
  buildGang,
  buildFighter,
  buildGangDetail,
};
