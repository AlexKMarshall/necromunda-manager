import * as z from "zod";

export const fighterClassSchema = z.object({
  name: z.string(),
  id: z.string(),
});

export type FighterClass = z.infer<typeof fighterClassSchema>;

export const createFighterClassDtoSchema = fighterClassSchema.omit({
  id: true,
});
export type CreateFighterClassDto = z.infer<typeof createFighterClassDtoSchema>;

export const loadingFighterClass: FighterClass = {
  id: "loading",
  name: "Loading...",
};
