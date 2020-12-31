import * as z from "zod";

export const factionSchema = z.object({
  name: z.string(),
  id: z.string(),
});

export type Faction = z.infer<typeof factionSchema>;

export const createFactionDtoSchema = factionSchema.omit({ id: true });
export type CreateFactionDto = z.infer<typeof createFactionDtoSchema>;
