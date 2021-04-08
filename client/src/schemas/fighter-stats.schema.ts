import * as z from "zod";

export const fighterStatsSchema = z.object({
  movement: z.number(),
  weaponSkill: z.number(),
  ballisticSkill: z.number(),
  strength: z.number(),
  toughness: z.number(),
  wounds: z.number(),
  initiative: z.number(),
  attacks: z.number(),
  leadership: z.number(),
  cool: z.number(),
  will: z.number(),
  intelligence: z.number(),
});

export type FighterStats = z.infer<typeof fighterStatsSchema>;

export const loadingFighterStats: FighterStats = {
  movement: 0,
  weaponSkill: 0,
  ballisticSkill: 0,
  strength: 0,
  toughness: 0,
  wounds: 0,
  initiative: 0,
  attacks: 0,
  leadership: 0,
  cool: 0,
  will: 0,
  intelligence: 0,
};
