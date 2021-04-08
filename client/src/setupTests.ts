// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import { server } from "./test/mocks/server/test-server";
import * as factionsDB from "./test/mocks/db/factions";
import * as fighterClassesDb from "./test/mocks/db/fighter-classes";
import * as fighterPrototypesDb from "./test/mocks/db/fighter-prototypes";
import * as gangsDb from "./test/mocks/db/gangs";

process.env.DEBUG_PRINT_LIMIT = "15000";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterAll(() => server.close());
afterEach(async () => {
  server.resetHandlers();
  await Promise.all([
    factionsDB.reset(),
    fighterClassesDb.reset(),
    fighterPrototypesDb.reset(),
    gangsDb.reset(),
  ]);
});
