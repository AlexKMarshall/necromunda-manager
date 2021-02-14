import { render, screen } from "@testing-library/react";
import faker from "faker";
import { FighterStats } from "../../schemas/fighter.schema";
import FighterStatsDisplay from "./";

function buildFighterStats(
  overrides: Partial<FighterStats> = {}
): FighterStats {
  return {
    m: faker.random.number(6),
    ws: faker.random.number(6),
    bs: faker.random.number(6),
    s: faker.random.number(6),
    t: faker.random.number(6),
    w: faker.random.number(6),
    i: faker.random.number(6),
    a: faker.random.number(6),
    ld: faker.random.number(11),
    cl: faker.random.number(11),
    wil: faker.random.number(11),
    int: faker.random.number(11),
    ...overrides,
  };
}

test("it should display the statistics", () => {
  const fighterStats = buildFighterStats();
  const fighterId = faker.random.uuid();

  render(
    <FighterStatsDisplay fighterStats={fighterStats} fighterId={fighterId} />
  );

  expect(
    screen.getByRole("definition", { name: /movement/i })
  ).toHaveTextContent(`${fighterStats.m}"`);
  expect(
    screen.getByRole("definition", { name: /weapon skill/i })
  ).toHaveTextContent(`${fighterStats.ws}+`);
  expect(
    screen.getByRole("definition", { name: /ballistic skill/i })
  ).toHaveTextContent(`${fighterStats.bs}+`);
  expect(
    screen.getByRole("definition", { name: /strength/i })
  ).toHaveTextContent(`${fighterStats.s}`);
  expect(
    screen.getByRole("definition", { name: /toughness/i })
  ).toHaveTextContent(`${fighterStats.t}`);
  expect(screen.getByRole("definition", { name: /wounds/i })).toHaveTextContent(
    `${fighterStats.w}`
  );
  expect(
    screen.getByRole("definition", { name: /initiative/i })
  ).toHaveTextContent(`${fighterStats.i}`);
  expect(
    screen.getByRole("definition", { name: /attacks/i })
  ).toHaveTextContent(`${fighterStats.a}`);
  expect(
    screen.getByRole("definition", { name: /leadership/i })
  ).toHaveTextContent(`${fighterStats.ld}+`);
  expect(screen.getByRole("definition", { name: /cool/i })).toHaveTextContent(
    `${fighterStats.cl}+`
  );
  expect(screen.getByRole("definition", { name: /will/i })).toHaveTextContent(
    `${fighterStats.wil}+`
  );
  expect(
    screen.getByRole("definition", { name: /intelligence/i })
  ).toHaveTextContent(`${fighterStats.int}+`);
});
