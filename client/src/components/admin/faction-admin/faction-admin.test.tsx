import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { FactionAdmin } from ".";
import faker from "faker";
import * as factionsDb from "../../../test/mocks/db/factions";
import { Faction } from "../../../schemas";

function buildFaction(overrides?: Partial<Faction>): Faction {
  return {
    id: faker.random.uuid(),
    name: faker.company.companyName(),
    ...overrides,
  };
}

afterEach(async () => {
  await factionsDb.reset();
});

test("can add a faction", async () => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children?: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  render(<FactionAdmin />, { wrapper });

  await waitForElementToBeRemoved(() => [
    ...screen.queryAllByLabelText(/loading/i),
    ...screen.queryAllByText(/loading/i),
  ]);

  const { name } = buildFaction();

  userEvent.type(screen.getByRole("textbox", { name: /faction name/i }), name);
  userEvent.click(screen.getByRole("button", { name: /add faction/i }));

  await screen.findByLabelText(/loading/i);

  await waitForElementToBeRemoved(() => [
    ...screen.queryAllByLabelText(/loading/i),
    ...screen.queryAllByText(/loading/i),
  ]);

  expect(screen.getByText(name)).toBeInTheDocument();
});
test("can view factions", async () => {
  const [factionOne, factionTwo] = [buildFaction(), buildFaction()];
  factionsDb.insert(factionOne, factionTwo);

  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children?: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  render(<FactionAdmin />, { wrapper });

  await waitForElementToBeRemoved(() => [
    ...screen.queryAllByLabelText(/loading/i),
    ...screen.queryAllByText(/loading/i),
  ]);

  expect(screen.getByText(factionOne.name)).toBeInTheDocument();
  expect(screen.getByText(factionTwo.name)).toBeInTheDocument();
});
test("can delete a faction", async () => {
  const [factionOne, factionTwo] = [buildFaction(), buildFaction()];
  factionsDb.insert(factionOne, factionTwo);

  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children?: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  render(<FactionAdmin />, { wrapper });

  await waitForElementToBeRemoved(() => [
    ...screen.queryAllByLabelText(/loading/i),
    ...screen.queryAllByText(/loading/i),
  ]);

  const deleteFactionTwoRegex = new RegExp(
    `delete faction ${factionTwo.name}`,
    "i"
  );

  userEvent.click(screen.getByRole("button", { name: deleteFactionTwoRegex }));

  await waitForElementToBeRemoved(() => screen.getByText(factionTwo.name));
  expect(screen.getByText(factionOne.name)).toBeInTheDocument();
});
