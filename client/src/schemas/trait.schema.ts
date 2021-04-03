import * as z from "zod";

export const traitSchema = z.object({
  name: z.string(),
  id: z.string(),
});

export type Trait = z.infer<typeof traitSchema>;

export const createTraitDtoSchema = traitSchema.omit({ id: true });
export type CreateTraitDto = z.infer<typeof createTraitDtoSchema>;

export const loadingTrait: Trait = {
  id: "loading",
  name: "loading...",
};
