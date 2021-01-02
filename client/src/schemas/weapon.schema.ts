import * as z from "zod";

const weaponTypesEnum = z.enum([
  "basic weapon",
  "pistol",
  "special weapon",
  "heavy weapon",
  "close combat weapon",
]);

export const weaponTypes = weaponTypesEnum.options;

export type WeaponType = z.infer<typeof weaponTypesEnum>;

export const weaponSchema = z.object({
  name: z.string(),
  id: z.string(),
  cost: z.number(),
  weaponType: weaponTypesEnum,
});

export type Weapon = z.infer<typeof weaponSchema>;

export const createWeaponDtoSchema = weaponSchema.omit({ id: true });
export type CreateWeaponDto = z.infer<typeof createWeaponDtoSchema>;
