import faker from "faker";
import { Faction, CreateFactionDto } from "../../schemas/faction.schema";

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
  console.error(e);
  persist();
}

class HttpError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function create({ name }: CreateFactionDto) {
  console.log("creating faction ", name);
  const factions = Object.values(factionsStore);
  if (factions.some((faction) => faction.name === name)) {
    throw new HttpError("Faction name already exists", 400);
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

export { create, readAll, read };
