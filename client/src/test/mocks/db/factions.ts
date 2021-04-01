import faker from "faker";
import { HttpError } from "./utils";
import { Faction, CreateFactionDto } from "../../../schemas";

const factionsKey = "__necromunda_factions__";

let factionsStore: { [key: string]: Faction } = {};

function persist() {
  window.localStorage.setItem(factionsKey, JSON.stringify(factionsStore));
}
function load() {
  const currentStoredValue = window.localStorage.getItem(factionsKey);
  if (currentStoredValue !== null) {
    Object.assign(factionsStore, JSON.parse(currentStoredValue));
  }
}

// initialize
try {
  load();
} catch (e) {
  persist();
}
async function insert(...factions: Faction[]) {
  factions.forEach((faction) => {
    factionsStore[faction.id] = faction;
  });
  persist();
  return factions;
}

async function create({ name }: CreateFactionDto) {
  const factions = await readAll();
  if (factions.some((faction) => faction.name === name)) {
    throw new HttpError(`Faction name "${name} already exists`, 400);
  }

  const id = faker.random.uuid();
  factionsStore[id] = { id, name };
  persist();
  return read(id);
}

async function readAll() {
  return Object.values(factionsStore);
}

async function read(id: Faction["id"]) {
  validateFaction(id);
  return factionsStore[id];
}

function validateFaction(id: Faction["id"]) {
  load();
  if (!factionsStore[id]) {
    throw new HttpError(`No Faction with the id "${id}"`, 404);
  }
}

async function remove(id: Faction["id"]) {
  const faction = read(id);
  delete factionsStore[id];
  persist();
  return faction;
}

async function reset() {
  factionsStore = {};
  persist();
}

export { insert, create, readAll, read, remove, reset };
