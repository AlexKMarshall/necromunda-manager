import * as z from "zod";
import { fighterPrototypeSchema } from "./fighter-prototype.schema";

export const fighterSchema = z.object({
  name: z.string().optional().nullable(),
  id: z.string(),
  fighterPrototype: fighterPrototypeSchema.pick({
    name: true,
    id: true,
    cost: true,
  }),
  cost: z.number(),
  gangId: z.string(),
  xp: z.number(),
});

export type Fighter = z.infer<typeof fighterSchema>;
