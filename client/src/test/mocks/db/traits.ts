import faker from "faker";
import { HttpError } from "./utils";
import { Trait, CreateTraitDto } from "../../../schemas";

const traitsKey = "__necromunda_traits__";

let traitsStore: { [key: string]: Trait } = {};

function persist() {
  window.localStorage.setItem(traitsKey, JSON.stringify(traitsStore));
}
function load() {
  const currentStoredValue = window.localStorage.getItem(traitsKey);
  if (currentStoredValue !== null) {
    Object.assign(traitsStore, JSON.parse(currentStoredValue));
  }
}

// initialize
try {
  load();
} catch (e) {
  persist();
}
async function insert(...traits: Trait[]) {
  traits.forEach((trait) => {
    traitsStore[trait.id] = trait;
  });
  persist();
  return traits;
}

async function create({ name, ...rest }: CreateTraitDto) {
  const traits = await readAll();
  if (traits.some((trait) => trait.name === name)) {
    throw new HttpError(`Weapon name "${name} already exists`, 400);
  }

  const id = faker.random.uuid();
  traitsStore[id] = { id, name, ...rest };
  persist();
  return read(id);
}

async function readAll() {
  load();
  return Object.values(traitsStore);
}

async function read(id: Trait["id"]) {
  validateWeapon(id);
  return traitsStore[id];
}

function validateWeapon(id: Trait["id"]) {
  load();
  if (!traitsStore[id]) {
    throw new HttpError(`No Trait with the id "${id}"`, 404);
  }
}

async function remove(id: Trait["id"]) {
  const trait = read(id);
  delete traitsStore[id];
  persist();
  return trait;
}

async function reset() {
  traitsStore = {};
  persist();
}

export { insert, create, readAll, read, remove, reset };
