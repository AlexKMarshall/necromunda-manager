import * as z from "zod";
import { factionSchema } from "./faction.schema";
import { fighterPrototypeSchema } from "./fighter-prototype.schema";

export const fighterSchema = z.object({
  name: z.string().optional().nullable(),
  id: z.string(),
  fighterPrototype: fighterPrototypeSchema.pick({
    name: true,
    id: true,
    cost: true,
  }),
  gangId: z.string(),
});

export type Fighter = z.infer<typeof fighterSchema>;
