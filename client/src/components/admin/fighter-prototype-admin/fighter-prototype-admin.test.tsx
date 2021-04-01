import {
  render,
  screen,
  waitForElementToBeRemoved,
  waitForLoadingToFinish,
} from "../../../test/test-utils";
import userEvent from "@testing-library/user-event";
import { FighterPrototypeAdmin } from ".";
import * as fighterPrototypesDb from "../../../test/mocks/db/fighter-prototypes";
import { buildFighterPrototype } from "../../../test/mocks/generate";

test("can add a fighter prototype", async () => {
  const fighterPrototype = await buildFighterPrototype();

  render(<FighterPrototypeAdmin />);

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

  render(<FighterPrototypeAdmin />);

  await waitForLoadingToFinish();

  expect(screen.getByText(fpOne.name)).toBeInTheDocument();
  expect(screen.getByText(fpTwo.name)).toBeInTheDocument();
});

test("can delete fighter prototypes", async () => {
  const [fpOne, fpTwo] = await fighterPrototypesDb.insert(
    await buildFighterPrototype(),
    await buildFighterPrototype()
  );

  render(<FighterPrototypeAdmin />);

  await waitForLoadingToFinish();

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
