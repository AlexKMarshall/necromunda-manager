import faker from "faker";
import { HttpError } from "./utils";
import {
  FighterPrototype,
  CreateFighterPrototypeDto,
} from "../../schemas/fighter-prototype.schema";
import * as factionsDb from "./factions";
import * as fighterClassesDb from "./fighter-classes";

const fighterPrototypesKey = "__necromunda_fighter_prototypes__";

let fighterPrototypesStore: { [key: string]: FighterPrototype } = {};

function persist() {
  window.localStorage.setItem(
    fighterPrototypesKey,
    JSON.stringify(fighterPrototypesStore)
  );
}
function load() {
  const currentStoredValue = window.localStorage.getItem(fighterPrototypesKey);
  if (currentStoredValue !== null) {
    Object.assign(fighterPrototypesStore, JSON.parse(currentStoredValue));
  }
}

// initialize
try {
  load();
} catch (e) {
  persist();
}

async function create({
  name,
  cost,
  factionId,
  fighterClassId,
  fighterStats,
}: CreateFighterPrototypeDto) {
  const faction = await factionsDb.read(factionId);
  const fighterClass = await fighterClassesDb.read(fighterClassId);

  const fighterPrototypes = await readAll();
  if (
    fighterPrototypes.some((fighterPrototype) => fighterPrototype.name === name)
  ) {
    throw new HttpError(`Fighter Prototype name "${name}" already exists`, 400);
  }

  const id = faker.random.uuid();
  fighterPrototypesStore[id] = {
    id,
    name,
    faction,
    fighterClass,
    cost,
    fighterStats,
  };
  persist();
  return read(id);
}

async function readAll() {
  return Object.values(fighterPrototypesStore);
}

async function read(id: FighterPrototype["id"]) {
  validateFaction(id);
  return fighterPrototypesStore[id];
}

function validateFaction(id: FighterPrototype["id"]) {
  load();
  if (!fighterPrototypesStore[id]) {
    throw new HttpError(`No Fighter Prototype with the id "${id}"`, 404);
  }
}

export { create, readAll, read };
