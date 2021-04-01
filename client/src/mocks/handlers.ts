// src/mocks/handlers.js
import { rest } from "msw";
import {
  CreateFactionDto,
  CreateFighterClassDto,
  CreateFighterPrototypeDto,
  CreateGangDto,
} from "../schemas";
import * as factionsDb from "./db/factions";
import * as fighterClassesDb from "./db/fighter-classes";
import * as fighterPrototypesDb from "./db/fighter-prototypes";
import * as gangsDb from "./db/gangs";

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
  rest.get(`${apiUrl}/fighter-prototypes`, async (req, res, ctx) => {
    const fighterPrototypes = await fighterPrototypesDb.readAll();
    return res(ctx.json(fighterPrototypes));
  }),
  rest.post<CreateFighterPrototypeDto>(
    `${apiUrl}/fighter-prototypes`,
    async (req, res, ctx) => {
      const fp = req.body;
      try {
        const fighterPrototype = await fighterPrototypesDb.create(fp);
        return res(ctx.status(201), ctx.json(fighterPrototype));
      } catch (e) {
        return res(ctx.status(e.status), ctx.json(e.message));
      }
    }
  ),
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
    try {
      const gang = await gangsDb.create(gangDto);
      return res(ctx.status(201), ctx.json(gang));
    } catch (e) {
      return res(ctx.status(e.status), ctx.json(e.message));
    }
  }),
];
