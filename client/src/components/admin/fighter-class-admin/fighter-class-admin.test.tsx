import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import faker from "faker";
import userEvent from "@testing-library/user-event";
import { FighterClassAdmin } from ".";
import { FighterClass } from "../../../schemas";
import * as fighterClassesDb from "../../../test/mocks/db/fighter-classes";

function buildFighterClass(overrides?: Partial<FighterClass>): FighterClass {
  return {
    id: faker.random.uuid(),
    name: faker.company.bsNoun(),
    ...overrides,
  };
}

test("can add a fighter class", async () => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children?: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  render(<FighterClassAdmin />, { wrapper });

  await waitForElementToBeRemoved(() => [
    ...screen.queryAllByLabelText(/loading/i),
    ...screen.queryAllByText(/loading/i),
  ]);

  const { name } = buildFighterClass();

  userEvent.type(
    screen.getByRole("textbox", { name: /fighter class name/i }),
    name
  );
  userEvent.click(screen.getByRole("button", { name: /add fighter class/i }));

  await screen.findByLabelText(/loading/i);

  await waitForElementToBeRemoved(() => [
    ...screen.queryAllByLabelText(/loading/i),
    ...screen.queryAllByText(/loading/i),
  ]);

  expect(screen.getByText(name)).toBeInTheDocument();
});
test("can view fighter classes", async () => {
  const [fighterClassOne, fighterClassTwo] = await fighterClassesDb.insert(
    buildFighterClass(),
    buildFighterClass()
  );

  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children?: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  render(<FighterClassAdmin />, { wrapper });

  await waitForElementToBeRemoved(() => [
    ...screen.queryAllByLabelText(/loading/i),
    ...screen.queryAllByText(/loading/i),
  ]);

  expect(screen.getByText(fighterClassOne.name)).toBeInTheDocument();
  expect(screen.getByText(fighterClassTwo.name)).toBeInTheDocument();
});
test("can delete fighter classes", async () => {
  const [fighterClassOne, fighterClassTwo] = await fighterClassesDb.insert(
    buildFighterClass(),
    buildFighterClass()
  );

  const queryClient = new QueryClient();
  const wrapper = ({ children }: { children?: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  render(<FighterClassAdmin />, { wrapper });

  await waitForElementToBeRemoved(() => [
    ...screen.queryAllByLabelText(/loading/i),
    ...screen.queryAllByText(/loading/i),
  ]);

  const deleteFactionTwoRegex = new RegExp(
    `delete fighter class ${fighterClassTwo.name}`,
    "i"
  );

  userEvent.click(screen.getByRole("button", { name: deleteFactionTwoRegex }));

  await waitForElementToBeRemoved(() => screen.getByText(fighterClassTwo.name));
  expect(screen.getByText(fighterClassOne.name)).toBeInTheDocument();
});
