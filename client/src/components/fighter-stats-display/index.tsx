/** @jsxImportSource @emotion/react */
import React, { ReactNode } from "react";
import { css } from "@emotion/react";
import { VisuallyHidden } from "@chakra-ui/react";
import { FighterStats as FighterStatsType } from "../../schemas/";

const dlStyle = css`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(var(--s1), 1fr));
  text-align: center;

  & dt {
    font-weight: bold;
    border-bottom: 1px solid;
    & span {
      font-size: var(--s-1);
    }
  }

  & dd {
    margin-inline-start: 0;
  }
`;

const psychologyStyle = css`
  background-color: var(--gray-900);
  color: var(--gray-100);
`;

export type FighterStatsDisplayType = Record<keyof FighterStatsType, string>;
interface FighterStatMeta {
  statKey: keyof FighterStatsDisplayType;
  render: (statKey: keyof FighterStatsDisplayType) => ReactNode;
  label: string;
  type: "regular" | "psychology";
}

const fighterStatsMetas: FighterStatMeta[] = [
  {
    statKey: "movement",
    render: capitalize,
    label: "Movement",
    type: "regular",
  },
  {
    statKey: "weaponSkill",
    render: capitalize,
    label: "Weapon skill",
    type: "regular",
  },
  {
    statKey: "ballisticSkill",
    render: capitalize,
    label: "Ballistic skill",
    type: "regular",
  },
  {
    statKey: "strength",
    render: capitalize,
    label: "Strength",
    type: "regular",
  },
  {
    statKey: "toughness",
    render: capitalize,
    label: "Toughness",
    type: "regular",
  },
  { statKey: "wounds", render: capitalize, label: "Wounds", type: "regular" },
  {
    statKey: "initiative",
    render: capitalize,
    label: "Initiative",
    type: "regular",
  },
  { statKey: "attacks", render: capitalize, label: "Attacks", type: "regular" },
  {
    statKey: "leadership",
    render: renderDropCap,
    label: "Leadership",
    type: "psychology",
  },
  {
    statKey: "cool",
    render: renderDropCap,
    label: "Cool",
    type: "psychology",
  },
  {
    statKey: "will",
    render: renderDropCap,
    label: "Will",
    type: "psychology",
  },
  {
    statKey: "intelligence",
    render: renderDropCap,
    label: "Intelligence",
    type: "psychology",
  },
];

function capitalize(word: string) {
  return word.toUpperCase();
}

function renderDropCap(word: string) {
  const capitalizedWord = capitalize(word);
  return (
    <>
      {capitalizedWord.slice(0, 1)}
      <span className="text-sm">{capitalizedWord.slice(1)}</span>
    </>
  );
}

export interface FighterStatsProps {
  fighterId: string;
  fighterStats: FighterStatsDisplayType;
}

export function FighterStatsDisplay({
  fighterId,
  fighterStats,
}: FighterStatsProps) {
  const regularStats = fighterStatsMetas.filter(
    ({ type }) => type === "regular"
  );
  const psychologyStats = fighterStatsMetas.filter(
    ({ type }) => type === "psychology"
  );

  function renderStat({ statKey, render, label }: FighterStatMeta) {
    const id = `${fighterId}-${statKey}`;
    return (
      <React.Fragment>
        <dt aria-hidden>{render(statKey)}</dt>
        <VisuallyHidden>
          <dt id={id}>{label}</dt>
        </VisuallyHidden>
        <dd aria-labelledby={id}>{fighterStats[statKey]}</dd>
      </React.Fragment>
    );
  }

  return (
    <dl css={dlStyle}>
      {regularStats.map((stat) => (
        <div key={`${fighterId}-${stat.statKey}`}>{renderStat(stat)}</div>
      ))}
      {psychologyStats.map((stat) => (
        <div key={`${fighterId}-${stat.statKey}`} css={psychologyStyle}>
          {renderStat(stat)}
        </div>
      ))}
    </dl>
  );
}
