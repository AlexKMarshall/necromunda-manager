import * as z from "zod";
import { fighterPrototypeSchema } from "./fighter-prototype.schema";
import { fighterStatsSchema } from "./fighter-stats.schema";

export const fighterSchema = z.object({
  name: z.string(),
  fighterPrototype: fighterPrototypeSchema,
  cost: z.number(),
  experience: z.number(),
  advancements: z.number(),
  recovery: z.boolean(),
  capturedBy: z.string().optional(),
  lastingInjuries: z.string().optional(),
  fighterStats: fighterStatsSchema,
});

export type Fighter = z.infer<typeof fighterSchema>;
