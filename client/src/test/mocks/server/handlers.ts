// src/mocks/handlers.js
import { rest } from "msw";
import {
  CreateFactionDto,
  CreateFighterClassDto,
  CreateFighterDto,
  CreateFighterPrototypeDto,
  CreateGangDto,
  CreateTraitDto,
  CreateWeaponDto,
} from "../../../schemas";
import * as factionsDb from "../db/factions";
import * as fighterClassesDb from "../db/fighter-classes";
import * as fighterPrototypesDb from "../db/fighter-prototypes";
import * as gangsDb from "../db/gangs";
import * as traitsDb from "../db/traits";
import * as weaponsDb from "../db/weapons";

const apiUrl = "http://localhost:8000";

const variableRequestTime = 400;
const minRequestTime = 400;
let sleep: (t?: number) => any;
if (process.env.CI) {
  sleep = () => Promise.resolve();
} else if (process.env.NODE_ENV === "test") {
  sleep = () => Promise.resolve();
} else {
  sleep = (t = Math.random() * variableRequestTime + minRequestTime) =>
    new Promise((resolve) => setTimeout(resolve, t));
}

export const handlers = [
  rest.get(`${apiUrl}/factions`, async (req, res, ctx) => {
    const factions = await factionsDb.readAll();
    return res(ctx.json(factions));
  }),
  rest.post<CreateFactionDto>(`${apiUrl}/factions`, async (req, res, ctx) => {
    const { name } = req.body;
    const faction = await factionsDb.create({ name });
    return res(ctx.status(201), ctx.json(faction));
  }),
  rest.delete(`${apiUrl}/factions/:id`, async (req, res, ctx) => {
    const { id } = req.params;
    const faction = await factionsDb.remove(id);
    return res(ctx.status(200), ctx.json(faction));
  }),
  rest.get(`${apiUrl}/fighter-classes`, async (req, res, ctx) => {
    const fighterClasses = await fighterClassesDb.readAll();
    return res(ctx.json(fighterClasses));
  }),
  rest.post<CreateFighterClassDto>(
    `${apiUrl}/fighter-classes`,
    async (req, res, ctx) => {
      const { name } = req.body;
      const fighterClass = await fighterClassesDb.create({ name });
      return res(ctx.status(201), ctx.json(fighterClass));
    }
  ),
  rest.delete(`${apiUrl}/fighter-classes/:id`, async (req, res, ctx) => {
    const { id } = req.params;
    const fighterClass = await fighterClassesDb.remove(id);
    return res(ctx.status(200), ctx.json(fighterClass));
  }),
  rest.get(`${apiUrl}/fighter-prototypes`, async (req, res, ctx) => {
    const fighterPrototypes = await fighterPrototypesDb.readAll();
    return res(ctx.json(fighterPrototypes));
  }),
  rest.post<CreateFighterPrototypeDto>(
    `${apiUrl}/fighter-prototypes`,
    async (req, res, ctx) => {
      const fp = req.body;
      const fighterPrototype = await fighterPrototypesDb.create(fp);
      return res(ctx.status(201), ctx.json(fighterPrototype));
    }
  ),
  rest.delete(`${apiUrl}/fighter-prototypes/:id`, async (req, res, ctx) => {
    const { id } = req.params;
    const fp = await fighterPrototypesDb.remove(id);
    return res(ctx.status(200), ctx.json(fp));
  }),
  rest.get(`${apiUrl}/gangs`, async (req, res, ctx) => {
    const gangs = await gangsDb.readAll();
    return res(ctx.json(gangs));
  }),
  rest.get(`${apiUrl}/gangs/:id`, async (req, res, ctx) => {
    const { id } = req.params;
    const gangs = await gangsDb.read(id);
    return res(ctx.json(gangs));
  }),
  rest.post<CreateGangDto>(`${apiUrl}/gangs`, async (req, res, ctx) => {
    const gangDto = req.body;
    const gang = await gangsDb.create(gangDto);
    return res(ctx.status(201), ctx.json(gang));
  }),
  rest.post<CreateFighterDto>(
    `${apiUrl}/gangs/:gangId/fighters`,
    async (req, res, ctx) => {
      const { gangId } = req.params;
      const createFighterDto = req.body;
      const fighter = await gangsDb.addFighter({
        gangId,
        createFighterDto,
      });
      return res(ctx.status(201), ctx.json(fighter));
    }
  ),
  rest.get(`${apiUrl}/traits`, async (req, res, ctx) => {
    const traits = await traitsDb.readAll();
    return res(ctx.json(traits));
  }),
  rest.post<CreateTraitDto>(`${apiUrl}/traits`, async (req, res, ctx) => {
    const traitDto = req.body;
    const trait = await traitsDb.create(traitDto);
    return res(ctx.status(201), ctx.json(trait));
  }),
  rest.delete(`${apiUrl}/traits/:id`, async (req, res, ctx) => {
    const { id } = req.params;
    const trait = await traitsDb.remove(id);
    return res(ctx.status(200), ctx.json(trait));
  }),
  rest.get(`${apiUrl}/weapons`, async (req, res, ctx) => {
    const weapons = await weaponsDb.readAll();
    return res(ctx.json(weapons));
  }),
  rest.post<CreateWeaponDto>(`${apiUrl}/weapons`, async (req, res, ctx) => {
    const weaponDto = req.body;
    const weapon = await weaponsDb.create(weaponDto);
    return res(ctx.status(201), ctx.json(weapon));
  }),
  rest.delete(`${apiUrl}/weapons/:id`, async (req, res, ctx) => {
    const { id } = req.params;
    const weapon = await weaponsDb.remove(id);
    return res(ctx.status(200), ctx.json(weapon));
  }),
].map((handler) => {
  const originalResolver = handler.resolver;
  // TODO is there a way to get rid of any?
  handler.resolver = async function resolver(...args: any[]) {
    const [req, res, ctx] = args;
    try {
      const result = await originalResolver(req, res, ctx);
      return result;
    } catch (error) {
      const status = error.status || 500;
      return res(
        ctx.status(status),
        ctx.json({ status, message: error.message || "Unknown Error" })
      );
    } finally {
      await sleep();
    }
  };
  return handler;
});
