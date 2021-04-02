import * as z from "zod";
import {
  fighterPrototypeSchema,
  loadingFighterPrototype,
} from "./fighter-prototype.schema";
import {
  fighterStatsSchema,
  loadingFighterStats,
} from "./fighter-stats.schema";
import { weaponSchema } from "./weapon.schema";

export const fighterSchema = z.object({
  id: z.string(),
  name: z.string(),
  fighterPrototype: fighterPrototypeSchema,
  cost: z.number(),
  experience: z.number(),
  advancements: z.number(),
  recovery: z.boolean(),
  capturedBy: z.string().optional(),
  lastingInjuries: z.string().optional(),
  fighterStats: fighterStatsSchema,
  weapons: z.array(weaponSchema),
  skills: z.array(z.string()),
});

export type Fighter = z.infer<typeof fighterSchema>;

export const loadingFighter: Fighter = {
  id: "loading",
  name: "Loading...",
  fighterPrototype: loadingFighterPrototype,
  cost: 0,
  experience: 0,
  advancements: 0,
  recovery: false,
  fighterStats: loadingFighterStats,
  weapons: [],
  skills: [],
};

export const createFighterDtoSchema = fighterSchema
  .pick({
    name: true,
  })
  .extend({
    fighterPrototypeId: fighterPrototypeSchema.shape.id,
  });

export type CreateFighterDto = z.infer<typeof createFighterDtoSchema>;
