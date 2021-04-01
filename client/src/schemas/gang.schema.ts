import * as z from "zod";
import { factionSchema, loadingFaction } from "./faction.schema";
import { fighterSchema } from "./fighter.schema";

export const gangSchema = z.object({
  name: z.string(),
  id: z.string(),
  faction: factionSchema,
  userId: z.string().optional(),
  rating: z.number(),
  reputation: z.number(),
  wealth: z.number(),
  stash: z.object({
    credits: z.number(),
  }),
  fighters: z.array(fighterSchema),
  territories: z.array(z.string()),
});

export type Gang = z.infer<typeof gangSchema>;

export const createGangDtoSchema = gangSchema
  .pick({
    name: true,
  })
  .extend({ factionId: gangSchema.shape.faction.shape.id });

export type CreateGangDto = z.infer<typeof createGangDtoSchema>;

export const loadingGang: Gang = {
  id: "loading",
  name: "Loading...",
  faction: loadingFaction,
  rating: 0,
  reputation: 0,
  wealth: 0,
  stash: {
    credits: 0,
  },
  fighters: [],
  territories: [],
};
