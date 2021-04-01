import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import faker from "faker";
import userEvent from "@testing-library/user-event";
import { FighterPrototypeAdmin } from ".";
import * as factionsDb from "../../../test/mocks/db/factions";
import * as fighterClassesDb from "../../../test/mocks/db/fighter-classes";
import * as fighterPrototypesDb from "../../../test/mocks/db/fighter-prototypes";
import {
  Faction,
  FighterClass,
  FighterPrototype,
  FighterStats,
} from "../../../schemas";

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

test("can add a fighter prototype", async () => {
  const fighterPrototype = await buildFighterPrototype();
  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children?: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  render(<FighterPrototypeAdmin />, { wrapper });

  userEvent.type(
    screen.getByRole("textbox", { name: /fighter prototype name/i }),
    fighterPrototype.name
  );
  userEvent.type(
    screen.getByRole("spinbutton", { name: /cost/i }),
    fighterPrototype.cost.toString()
  );
  userEvent.type(
    screen.getByRole("combobox", { name: /faction/i }),
    fighterPrototype.faction.name
  );
  userEvent.type(
    screen.getByRole("combobox", { name: /fighter class/i }),
    fighterPrototype.fighterClass.name
  );
  userEvent.type(
    screen.getByRole("spinbutton", { name: /movement/i }),
    fighterPrototype.fighterStats.movement.toString()
  );
  userEvent.type(
    screen.getByRole("spinbutton", { name: /weapon skill/i }),
    fighterPrototype.fighterStats.weaponSkill.toString()
  );
  userEvent.type(
    screen.getByRole("spinbutton", { name: /ballistic skill/i }),
    fighterPrototype.fighterStats.ballisticSkill.toString()
  );
  userEvent.type(
    screen.getByRole("spinbutton", { name: /strength/i }),
    fighterPrototype.fighterStats.strength.toString()
  );
  userEvent.type(
    screen.getByRole("spinbutton", { name: /toughness/i }),
    fighterPrototype.fighterStats.toughness.toString()
  );
  userEvent.type(
    screen.getByRole("spinbutton", { name: /wounds/i }),
    fighterPrototype.fighterStats.wounds.toString()
  );
  userEvent.type(
    screen.getByRole("spinbutton", { name: /initiative/i }),
    fighterPrototype.fighterStats.initiative.toString()
  );
  userEvent.type(
    screen.getByRole("spinbutton", { name: /attacks/i }),
    fighterPrototype.fighterStats.attacks.toString()
  );
  userEvent.type(
    screen.getByRole("spinbutton", { name: /leadership/i }),
    fighterPrototype.fighterStats.leadership.toString()
  );
  userEvent.type(
    screen.getByRole("spinbutton", { name: /cool/i }),
    fighterPrototype.fighterStats.cool.toString()
  );
  userEvent.type(
    screen.getByRole("spinbutton", { name: /will/i }),
    fighterPrototype.fighterStats.will.toString()
  );
  userEvent.type(
    screen.getByRole("spinbutton", { name: /intelligence/i }),
    fighterPrototype.fighterStats.intelligence.toString()
  );
});
test("can view fighterPrototypes", async () => {
  const [fpOne, fpTwo] = await fighterPrototypesDb.insert(
    await buildFighterPrototype(),
    await buildFighterPrototype()
  );

  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children?: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  render(<FighterPrototypeAdmin />, { wrapper });

  await waitForElementToBeRemoved(() => [
    ...screen.queryAllByLabelText(/loading/i),
    ...screen.queryAllByText(/loading/i),
  ]);

  expect(screen.getByText(fpOne.name)).toBeInTheDocument();
  expect(screen.getByText(fpTwo.name)).toBeInTheDocument();
});

test("can delete fighter prototypes", async () => {
  const [fpOne, fpTwo] = await fighterPrototypesDb.insert(
    await buildFighterPrototype(),
    await buildFighterPrototype()
  );

  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children?: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  render(<FighterPrototypeAdmin />, { wrapper });

  await waitForElementToBeRemoved(() => [
    ...screen.queryAllByLabelText(/loading/i),
    ...screen.queryAllByText(/loading/i),
  ]);

  expect(screen.getByText(fpOne.name)).toBeInTheDocument();
  expect(screen.getByText(fpTwo.name)).toBeInTheDocument();

  const deleteFpTwoRegex = new RegExp(
    `delete fighter prototype ${fpTwo.name}`,
    "i"
  );

  userEvent.click(screen.getByRole("button", { name: deleteFpTwoRegex }));

  await waitForElementToBeRemoved(() => screen.getByText(fpTwo.name));
  expect(screen.getByText(fpOne.name)).toBeInTheDocument();
});
