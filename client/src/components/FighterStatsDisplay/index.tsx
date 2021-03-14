/** @jsxImportSource @emotion/react */
import React from "react";
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

type FighterStatMeta = {
  statKey: keyof FighterStatsType;
  render: React.ReactNode;
  label: string;
  suffix?: string;
};

const regularStats: FighterStatMeta[] = [
  { statKey: "m", render: "M", label: "Movement", suffix: '"' },
  { statKey: "ws", render: "WS", label: "Weapon skill", suffix: "+" },
  { statKey: "bs", render: "BS", label: "Ballistic skill", suffix: "+" },
  { statKey: "s", render: "S", label: "Strength" },
  { statKey: "t", render: "T", label: "Toughness" },
  { statKey: "w", render: "W", label: "Wounds" },
  { statKey: "i", render: "I", label: "Initiative" },
  { statKey: "a", render: "A", label: "Attacks" },
];

const psychologyStats: FighterStatMeta[] = [
  {
    statKey: "ld",
    render: (
      <>
        L<span className="text-sm">D</span>
      </>
    ),
    label: "Leadership",
    suffix: "+",
  },
  {
    statKey: "cl",
    render: (
      <>
        C<span className="text-sm">L</span>
      </>
    ),
    label: "Cool",
    suffix: "+",
  },
  {
    statKey: "wil",
    render: (
      <>
        W<span className="text-sm">IL</span>
      </>
    ),
    label: "Will",
    suffix: "+",
  },
  {
    statKey: "int",
    render: (
      <>
        I<span className="text-sm">NT</span>
      </>
    ),
    label: "Intelligence",
    suffix: "+",
  },
];

export interface FighterStatsProps {
  fighterId: string;
  fighterStats: FighterStatsType;
}

export function FighterStats({ fighterId, fighterStats }: FighterStatsProps) {
  function renderStat({ statKey, render, label, suffix }: FighterStatMeta) {
    const id = `${fighterId}-${statKey}`;
    return (
      <React.Fragment>
        <dt aria-hidden>{render}</dt>
        <VisuallyHidden>
          <dt id={id}>{label}</dt>
        </VisuallyHidden>
        <dd aria-labelledby={id}>{`${fighterStats[statKey]}${
          suffix ?? ""
        }`}</dd>
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
