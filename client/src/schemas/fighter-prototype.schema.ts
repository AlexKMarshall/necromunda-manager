import * as z from "zod";
import { factionSchema } from "./faction.schema";
import { fighterClassSchema } from "./fighter-class.schema";

export const fighterPrototypeSchema = z.object({
  name: z.string(),
  id: z.string(),
  faction: factionSchema,
  fighterClass: fighterClassSchema,
  cost: z.number(),
});

export type FighterPrototype = z.infer<typeof fighterPrototypeSchema>;

export const createFighterPrototypeDtoSchema = fighterPrototypeSchema.omit({
  id: true,
});
export type CreateFighterPrototypeDto = z.infer<
  typeof createFighterPrototypeDtoSchema
>;
