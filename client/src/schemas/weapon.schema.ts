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
    traits: z.array(traitSchema.extend({ modifier: z.string().optional() })),
  }),
  weaponType: weaponTypesEnum,
});

export type Weapon = z.infer<typeof weaponSchema>;

// export const createWeaponDtoSchema = weaponSchema
//   .omit({ id: true })
//   .extend({
//     traits: z.array(
//       weaponSchema.shape.traits.element.pick({ id: true, modifier: true })
//     ),
//   });
export const createWeaponDtoSchema = weaponSchema.omit({ id: true }).extend({
  stats: weaponSchema.shape.stats.extend({
    traits: z.array(
      weaponSchema.shape.stats.shape.traits.element.pick({
        id: true,
        modifier: true,
      })
    ),
  }),
});
export type CreateWeaponDto = z.infer<typeof createWeaponDtoSchema>;
