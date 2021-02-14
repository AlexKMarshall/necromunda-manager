// src/mocks/handlers.js
import { rest } from "msw";
import {
  factions,
  fighterClasses,
  fighterPrototypes,
  gang,
  gangDetail,
} from "./data";

export const handlers = [
  rest.get("http://localhost:8000/factions", (req, res, ctx) => {
    return res(ctx.json(factions));
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
