// src/mocks/handlers.js
import { rest } from "msw";
import { CreateFactionDto } from "../schemas/faction.schema";
import { CreateFighterClassDto } from "../schemas/fighter-class.schema";
import { fighterPrototypes, gang, gangDetail } from "./data";
import * as factionsDb from "./db/factions";
import * as fighterClassesDb from "./db/fighter-classes";

const apiUrl = "http://localhost:8000";

export const handlers = [
  rest.get(`${apiUrl}/factions`, async (req, res, ctx) => {
    const factions = await factionsDb.readAll();
    return res(ctx.json(factions));
  }),
  rest.post<CreateFactionDto>(`${apiUrl}/factions`, async (req, res, ctx) => {
    const { name } = req.body;
    try {
      const faction = await factionsDb.create({ name });
      return res(ctx.status(201), ctx.json(faction));
    } catch (e) {
      return res(ctx.status(e.status), ctx.json(e.message));
    }
  }),
  rest.get(`${apiUrl}/fighter-classes`, async (req, res, ctx) => {
    const fighterClasses = await fighterClassesDb.readAll();
    return res(ctx.json(fighterClasses));
  }),
  rest.post<CreateFighterClassDto>(
    `${apiUrl}/fighter-classes`,
    async (req, res, ctx) => {
      const { name } = req.body;
      try {
        const fighterClass = await fighterClassesDb.create({ name });
        return res(ctx.status(201), ctx.json(fighterClass));
      } catch (e) {
        return res(ctx.status(e.status), ctx.json(e.message));
      }
    }
  ),
  rest.get("http://localhost:8000/fighter-prototypes", (req, res, ctx) => {
    return res(ctx.json(fighterPrototypes));
  }),
  rest.get("http://localhost:8000/gangs", (req, res, ctx) => {
    return res(ctx.json([gang]));
  }),
  rest.get(`http://localhost:8000/gangs/:id`, (req, res, ctx) => {
    return res(ctx.json(gangDetail));
  }),
];
