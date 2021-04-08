import {
  render,
  screen,
  waitForElementToBeRemoved,
  waitForLoadingToFinish,
} from "../../../test/test-utils";
import userEvent from "@testing-library/user-event";
import { FighterClassAdmin } from ".";
import * as fighterClassesDb from "../../../test/mocks/db/fighter-classes";
import { buildFighterClass } from "../../../test/mocks/generate";

test("can add a fighter class", async () => {
  render(<FighterClassAdmin />);

  await waitForLoadingToFinish();

  const { name } = buildFighterClass();

  userEvent.type(
    screen.getByRole("textbox", { name: /fighter class name/i }),
    name
  );
  userEvent.click(screen.getByRole("button", { name: /add fighter class/i }));

  await screen.findByLabelText(/loading/i);

  await waitForLoadingToFinish();

  expect(screen.getByText(name)).toBeInTheDocument();
});
test("can view fighter classes", async () => {
  const [fighterClassOne, fighterClassTwo] = await fighterClassesDb.insert(
    buildFighterClass(),
    buildFighterClass()
  );

  render(<FighterClassAdmin />);

  await waitForLoadingToFinish();

  expect(screen.getByText(fighterClassOne.name)).toBeInTheDocument();
  expect(screen.getByText(fighterClassTwo.name)).toBeInTheDocument();
});
test("can delete fighter classes", async () => {
  const [fighterClassOne, fighterClassTwo] = await fighterClassesDb.insert(
    buildFighterClass(),
    buildFighterClass()
  );

  render(<FighterClassAdmin />);

  await waitForLoadingToFinish();

  const deleteFighterClassTwoRegex = new RegExp(
    `delete fighter class ${fighterClassTwo.name}`,
    "i"
  );

  userEvent.click(
    screen.getByRole("button", { name: deleteFighterClassTwoRegex })
  );

  await waitForElementToBeRemoved(() => screen.getByText(fighterClassTwo.name));
  expect(screen.getByText(fighterClassOne.name)).toBeInTheDocument();
});
