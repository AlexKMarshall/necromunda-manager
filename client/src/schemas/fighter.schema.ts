import * as z from "zod";
import { fighterPrototypeSchema } from "./fighter-prototype.schema";

export const fighterSchema = z.object({
  name: z.string().optional().nullable(),
  id: z.string(),
  fighterPrototype: fighterPrototypeSchema,
  cost: z.number(),
  xp: z.number(),
});

export type Fighter = z.infer<typeof fighterSchema>;

const fighterStatsSchema = z.object({
  m: z.number(),
  ws: z.number(),
  bs: z.number(),
  s: z.number(),
  t: z.number(),
  w: z.number(),
  i: z.number(),
  a: z.number(),
  ld: z.number(),
  cl: z.number(),
  wil: z.number(),
  int: z.number(),
});

export type FighterStats = z.infer<typeof fighterStatsSchema>;
