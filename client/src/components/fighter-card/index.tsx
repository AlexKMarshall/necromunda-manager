/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import {
  FighterStatsDisplay,
  FighterStatsDisplayType,
} from "../fighter-stats-display";
import { SkillsWargear } from "../skills-wargear";
import { WeaponsChart, WeaponsChartProps } from "../weapons-chart";
import { stack, box } from "../../styles";

const cardStyles = css`
  max-width: fit-content;
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
  weapons: WeaponsChartProps["weapons"];
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
    <section css={[cardStyles, box, stack]}>
      <header css={headerStyles}>
        <h2>{name}</h2>
        <div css={[box, creditsStyles]}>
          <div>{credits ?? "*"}</div>
          <div>CREDITS</div>
        </div>
      </header>
      <FighterStatsDisplay fighterId={id} fighterStats={stats} />
      <div css={scrollXContainer}>
        <WeaponsChart weapons={weapons} />
      </div>
      <SkillsWargear skills={skills} wargear={wargear} />
    </section>
  );
}
