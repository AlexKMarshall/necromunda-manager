import {
  render,
  screen,
  waitForElementToBeRemoved,
  waitForLoadingToFinish,
} from "../../../test/test-utils";
import userEvent from "@testing-library/user-event";
import { FactionAdmin } from ".";
import * as factionsDb from "../../../test/mocks/db/factions";
import { buildFaction } from "../../../test/mocks/generate";

test("can add a faction", async () => {
  render(<FactionAdmin />);

  await waitForLoadingToFinish();

  const { name } = buildFaction();

  userEvent.type(screen.getByRole("textbox", { name: /faction name/i }), name);
  userEvent.click(screen.getByRole("button", { name: /add faction/i }));

  await screen.findByLabelText(/loading/i);

  await waitForLoadingToFinish();

  expect(screen.getByText(name)).toBeInTheDocument();
});
test("can view factions", async () => {
  const [factionOne, factionTwo] = await factionsDb.insert(
    buildFaction(),
    buildFaction()
  );

  render(<FactionAdmin />);

  await waitForLoadingToFinish();

  expect(screen.getByText(factionOne.name)).toBeInTheDocument();
  expect(screen.getByText(factionTwo.name)).toBeInTheDocument();
});
test("can delete a faction", async () => {
  const [factionOne, factionTwo] = [buildFaction(), buildFaction()];
  factionsDb.insert(factionOne, factionTwo);

  render(<FactionAdmin />);

  await waitForLoadingToFinish();

  const deleteFactionTwoRegex = new RegExp(
    `delete faction ${factionTwo.name}`,
    "i"
  );

  userEvent.click(screen.getByRole("button", { name: deleteFactionTwoRegex }));

  await waitForElementToBeRemoved(() => screen.getByText(factionTwo.name));
  expect(screen.getByText(factionOne.name)).toBeInTheDocument();
});
