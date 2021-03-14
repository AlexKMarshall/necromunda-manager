/** @jsxImportSource @emotion/react */
import React, { ReactNode } from "react";
import { css } from "@emotion/react";
import { VisuallyHidden } from "@chakra-ui/react";
import { FighterStats as FighterStatsType } from "../../schemas/fighter.schema";

const dlStyle = css`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(var(--s1), 1fr));
  text-align: center;

  & dt {
    font-weight: bold;
    color: var(--primary-red-dark);
    border-bottom: 1px solid var(--primary-red-dark);
    & span {
      font-size: var(--s-1);
    }
  }

  & dd {
    margin-inline-start: 0;
  }
`;

const psychologyStyle = css`
  background-color: var(--primary-red-transparant);
`;

type FighterStatsDisplay = Record<keyof FighterStatsType, string>;
interface FighterStatMeta {
  statKey: keyof FighterStatsDisplay;
  render: (statKey: keyof FighterStatsDisplay) => ReactNode;
  label: string;
  type: "regular" | "psychology";
}

const fighterStatsMetas: FighterStatMeta[] = [
  { statKey: "m", render: capitalize, label: "Movement", type: "regular" },
  { statKey: "ws", render: capitalize, label: "Weapon skill", type: "regular" },
  {
    statKey: "bs",
    render: capitalize,
    label: "Ballistic skill",
    type: "regular",
  },
  { statKey: "s", render: capitalize, label: "Strength", type: "regular" },
  { statKey: "t", render: capitalize, label: "Toughness", type: "regular" },
  { statKey: "w", render: capitalize, label: "Wounds", type: "regular" },
  { statKey: "i", render: capitalize, label: "Initiative", type: "regular" },
  { statKey: "a", render: capitalize, label: "Attacks", type: "regular" },
  {
    statKey: "ld",
    render: renderDropCap,
    label: "Leadership",
    type: "psychology",
  },
  {
    statKey: "cl",
    render: renderDropCap,
    label: "Cool",
    type: "psychology",
  },
  {
    statKey: "wil",
    render: renderDropCap,
    label: "Will",
    type: "psychology",
  },
  {
    statKey: "int",
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
  fighterStats: FighterStatsDisplay;
}

export function FighterStats({ fighterId, fighterStats }: FighterStatsProps) {
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
      {psychologyStats.slice(0, 1).map((stat) => (
        <div
          key={`${fighterId}-${stat.statKey}`}
          css={[
            psychologyStyle,
            { borderLeft: `2px solid var(--primary-red-dark)` },
          ]}
        >
          {renderStat(stat)}
        </div>
      ))}
      {psychologyStats.slice(1).map((stat) => (
        <div key={`${fighterId}-${stat.statKey}`} css={psychologyStyle}>
          {renderStat(stat)}
        </div>
      ))}
    </dl>
  );
}
