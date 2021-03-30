import faker from "faker";
import { HttpError } from "./utils";
import {
  FighterClass,
  CreateFighterClassDto,
} from "../../schemas/fighter-class.schema";

const fighterClassesKey = "__necromunda_fighter_classes__";

let fighterClassesStore: { [key: string]: FighterClass } = {};

function persist() {
  window.localStorage.setItem(
    fighterClassesKey,
    JSON.stringify(fighterClassesStore)
  );
}
function load() {
  const currentStoredValue = window.localStorage.getItem(fighterClassesKey);
  if (currentStoredValue !== null) {
    Object.assign(fighterClassesStore, JSON.parse(currentStoredValue));
  }
}

// initialize
try {
  load();
} catch (e) {
  persist();
}

async function create({ name }: CreateFighterClassDto) {
  const fighterClasses = await readAll();
  if (fighterClasses.some((fighterClass) => fighterClass.name === name)) {
    throw new HttpError(`Fighter Class name "${name}" already exists`, 400);
  }

  const id = faker.random.uuid();
  fighterClassesStore[id] = { id, name };
  persist();
  return read(id);
}

async function readAll() {
  return Object.values(fighterClassesStore);
}

async function read(id: FighterClass["id"]) {
  validateFaction(id);
  return fighterClassesStore[id];
}

function validateFaction(id: FighterClass["id"]) {
  load();
  if (!fighterClassesStore[id]) {
    throw new HttpError(`No Fighter Class with the id "${id}"`, 404);
  }
}

export { create, readAll, read };
