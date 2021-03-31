import faker from "faker";
import { HttpError } from "./utils";
import { Gang, CreateGangDto } from "../../schemas/gang.schema";
import * as factionsDb from "./factions";

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

async function create({ name, factionId }: CreateGangDto) {
  const gangs = await readAll();
  if (gangs.some((gang) => gang.name === name)) {
    throw new HttpError(`Gang name "${name} already exists`, 400);
  }
  const faction = await factionsDb.read(factionId);

  const id = faker.random.uuid();
  gangsStore[id] = { id, name, faction };
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

export { create, readAll, read };
