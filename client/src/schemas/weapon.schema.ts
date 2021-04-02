import * as z from "zod";
import { traitSchema } from "./trait.schema";

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
  stats: z.object({
    range: z.object({
      short: z.number().optional(),
      long: z.number().optional(),
    }),
    accuracy: z.object({
      short: z.number().optional(),
      long: z.number().optional(),
    }),
    strength: z.number(),
    armourPenetration: z.number().optional(),
    damage: z.number(),
    ammo: z.number().optional(),
    traits: z.array(traitSchema),
  }),
  weaponType: weaponTypesEnum,
});

export type Weapon = z.infer<typeof weaponSchema>;

export const createWeaponDtoSchema = weaponSchema.omit({ id: true });
export type CreateWeaponDto = z.infer<typeof createWeaponDtoSchema>;
