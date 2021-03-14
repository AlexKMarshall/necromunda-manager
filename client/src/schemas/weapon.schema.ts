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
  stats: z.object({
    rng: z.object({
      s: z.number().optional(),
      l: z.number().optional(),
    }),
    acc: z.object({
      s: z.number().optional(),
      l: z.number().optional(),
    }),
    str: z.number(),
    ap: z.number().optional(),
    d: z.number(),
    am: z.number().optional(),
    traits: z.array(z.string()),
  }),
  weaponType: weaponTypesEnum,
});

export type Weapon = z.infer<typeof weaponSchema>;

export const createWeaponDtoSchema = weaponSchema.omit({ id: true });
export type CreateWeaponDto = z.infer<typeof createWeaponDtoSchema>;
