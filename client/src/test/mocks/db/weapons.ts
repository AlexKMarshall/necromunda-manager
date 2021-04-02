import faker from "faker";
import { HttpError } from "./utils";
import { Weapon, CreateWeaponDto } from "../../../schemas";

const weaponsKey = "__necromunda_weapons__";

let weaponsStore: { [key: string]: Weapon } = {};

function persist() {
  window.localStorage.setItem(weaponsKey, JSON.stringify(weaponsStore));
}
function load() {
  const currentStoredValue = window.localStorage.getItem(weaponsKey);
  if (currentStoredValue !== null) {
    Object.assign(weaponsStore, JSON.parse(currentStoredValue));
  }
}

// initialize
try {
  load();
} catch (e) {
  persist();
}
async function insert(...weapons: Weapon[]) {
  weapons.forEach((weapon) => {
    weaponsStore[weapon.id] = weapon;
  });
  persist();
  return weapons;
}

const initialWeapon = {
  stats: {
    traits: [],
  },
};

async function create({ name, ...rest }: CreateWeaponDto) {
  const weapons = await readAll();
  if (weapons.some((weapon) => weapon.name === name)) {
    throw new HttpError(`Weapon name "${name} already exists`, 400);
  }

  const id = faker.random.uuid();
  weaponsStore[id] = { ...initialWeapon, id, name, ...rest };
  persist();
  return read(id);
}

async function readAll() {
  load();
  return Object.values(weaponsStore);
}

async function read(id: Weapon["id"]) {
  validateWeapon(id);
  return weaponsStore[id];
}

function validateWeapon(id: Weapon["id"]) {
  load();
  if (!weaponsStore[id]) {
    throw new HttpError(`No Weapon with the id "${id}"`, 404);
  }
}

async function remove(id: Weapon["id"]) {
  const weapon = read(id);
  delete weaponsStore[id];
  persist();
  return weapon;
}

async function reset() {
  weaponsStore = {};
  persist();
}

export { insert, create, readAll, read, remove, reset };
