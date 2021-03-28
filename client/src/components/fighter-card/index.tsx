/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import {
  FighterStatsDisplay,
  FighterStatsDisplayType,
} from "../fighter-stats-display";
import { SkillsWargear } from "../skills-wargear";
import { WeaponsList, WeaponsListProps } from "../weapons-list";

const cardStyles = css`
  border-radius: var(--s2);
`;

const headerStyles = css`
  display: flex;
  flex-direction: row;
  align-items: center;

  & h2 {
    text-align: center;
    flex-grow: 1;
  }
`;

const creditsStyles = css`
  --padding: var(--s-1);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  aspect-ratio: 1 / 1;
  font-weight: bold;

  & * {
    text-align: center;
  }
`;

const scrollXContainer = css`
  width: 100%;
  overflow-x: auto;
`;

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
    <section css={cardStyles} className="box">
      <header css={headerStyles}>
        <h2>{name}</h2>
        <div css={creditsStyles} className="box circle">
          <div>{credits ?? "*"}</div>
          <div>CREDITS</div>
        </div>
      </header>
      <FighterStatsDisplay fighterId={id} fighterStats={stats} />
      <div css={scrollXContainer}>
        <WeaponsList weapons={weapons} />
      </div>
      <SkillsWargear skills={skills} wargear={wargear} />
    </section>
  );
}
