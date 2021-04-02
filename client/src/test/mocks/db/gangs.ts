import faker from "faker";
import { HttpError } from "./utils";
import { Gang, CreateGangDto, CreateFighterDto } from "../../../schemas";
import * as factionsDb from "./factions";
import * as fighterPrototypesDb from "./fighter-prototypes";

const gangsKey = "__necromunda_gangs__";

let gangsStore: { [key: string]: Gang } = {};

function persist() {
  window.localStorage.setItem(gangsKey, JSON.stringify(gangsStore));
}
function load() {
  const currentStoredValue = window.localStorage.getItem(gangsKey);
  if (currentStoredValue !== null) {
    Object.assign(gangsStore, JSON.parse(currentStoredValue));
  }
}

// initialize
try {
  load();
} catch (e) {
  persist();
}

const initialCredits = 1000;
const initialGang = {
  stash: { credits: initialCredits },
  rating: 0,
  reputation: 1,
  wealth: initialCredits,
  fighters: [],
  territories: [],
};

async function create({ name, factionId }: CreateGangDto) {
  const gangs = await readAll();
  if (gangs.some((gang) => gang.name === name)) {
    throw new HttpError(`Gang name "${name} already exists`, 400);
  }
  const faction = await factionsDb.read(factionId);

  const id = faker.random.uuid();
  gangsStore[id] = { ...initialGang, id, name, faction };
  persist();
  return read(id);
}

async function readAll() {
  return Object.values(gangsStore);
}

async function read(id: Gang["id"]) {
  validateGang(id);
  return gangsStore[id];
}

function validateGang(id: Gang["id"]) {
  load();
  if (!gangsStore[id]) {
    throw new HttpError(`No Gang with the id "${id}"`, 404);
  }
}

async function reset() {
  gangsStore = {};
  persist();
}

const initialFighter = {
  experience: 0,
  advancements: 0,
  recovery: false,
  lastingInjuries: "",
  capturedBy: "",
};

async function addFighter({
  gangId,
  createFighterDto: { name, fighterPrototypeId },
}: {
  gangId: Gang["id"];
  createFighterDto: CreateFighterDto;
}) {
  const gang = await read(gangId);

  const fighterPrototype = await fighterPrototypesDb.read(fighterPrototypeId);

  const id = faker.random.uuid();
  const fighter = {
    ...initialFighter,
    id,
    name,
    fighterPrototype,
    cost: fighterPrototype.cost,
    fighterStats: { ...fighterPrototype.fighterStats },
  };

  gang.fighters.push(fighter);
  gang.stash.credits -= fighter.cost;
  gang.rating += fighter.cost;
  persist();
  return fighter;
}

export { create, readAll, read, reset, addFighter };
