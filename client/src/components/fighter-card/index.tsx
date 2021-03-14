import {
  FighterStatsDisplay,
  FighterStatsDisplayType,
} from "../FighterStatsDisplay";
import { SkillsWargear } from "../skills-wargear";
import { WeaponsList, WeaponsListProps } from "../weapons-list";

export interface FighterCardProps {
  id: string;
  name: string;
  credits?: number;
  stats: FighterStatsDisplayType;
  weapons: WeaponsListProps["weapons"];
  skills: string;
  wargear: string;
}

export function FighterCard({
  id,
  name,
  credits,
  stats,
  weapons,
  skills,
  wargear,
}: FighterCardProps) {
  return (
    <section>
      <header>
        <h2>{name}</h2>
        <div>
          <div>{credits ?? "*"}</div>
          <div>CREDITS</div>
        </div>
      </header>
      <FighterStatsDisplay fighterId={id} fighterStats={stats} />
      <WeaponsList weapons={weapons} />
      <SkillsWargear skills={skills} wargear={wargear} />
    </section>
  );
}
