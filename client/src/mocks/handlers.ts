// src/mocks/handlers.js
import { rest } from "msw";
import { CreateFactionDto } from "../schemas/faction.schema";
import {
  factions,
  fighterClasses,
  fighterPrototypes,
  gang,
  gangDetail,
} from "./data";
import * as factionsDb from "./db/factions";

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
  rest.get("http://localhost:8000/fighter-classes", (req, res, ctx) => {
    return res(ctx.json(fighterClasses));
  }),
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
