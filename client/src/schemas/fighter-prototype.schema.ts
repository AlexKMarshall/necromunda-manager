import * as z from "zod";
import { factionSchema } from "./faction.schema";
import { fighterClassSchema } from "./fighter-class.schema";
import { fighterStatsSchema } from "./fighter-stats.schema";

export const fighterPrototypeSchema = z.object({
  name: z.string(),
  id: z.string(),
  faction: factionSchema,
  fighterClass: fighterClassSchema,
  cost: z.number(),
  fighterStats: fighterStatsSchema,
});

export type FighterPrototype = z.infer<typeof fighterPrototypeSchema>;

export const createFighterPrototypeDtoSchema = fighterPrototypeSchema
  .omit({ id: true, faction: true, fighterClass: true })
  .extend({
    factionId: factionSchema.shape.id,
    fighterClassId: fighterClassSchema.shape.id,
  });
export type CreateFighterPrototypeDto = z.infer<
  typeof createFighterPrototypeDtoSchema
>;
