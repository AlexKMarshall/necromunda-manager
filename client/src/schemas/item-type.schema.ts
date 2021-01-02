import * as z from "zod";

export const itemTypeSchema = z.object({
  name: z.string(),
  id: z.string(),
});

export type ItemType = z.infer<typeof itemTypeSchema>;

export const createItemTypeDtoSchema = itemTypeSchema.omit({ id: true });
export type CreateItemTypeDto = z.infer<typeof createItemTypeDtoSchema>;
