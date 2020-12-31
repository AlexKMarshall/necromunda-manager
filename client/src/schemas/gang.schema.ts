import * as z from "zod";
import { factionSchema } from "./faction.schema";

export const gangSchema = z.object({
  name: z.string(),
  id: z.string(),
  faction: factionSchema,
  userId: z.string(),
});

export type Gang = z.infer<typeof gangSchema>;

export const createGangDtoSchema = gangSchema.omit({
  id: true,
  userId: true,
});
export type CreateGangDto = z.infer<typeof createGangDtoSchema>;
