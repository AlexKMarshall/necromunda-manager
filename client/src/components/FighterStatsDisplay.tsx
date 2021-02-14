/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from "@emotion/react";
import { VisuallyHidden } from "@chakra-ui/react";
import { FighterStats } from "../schemas/fighter.schema";

const dlStyle = css`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(2rem, 1fr));
  text-align: center;

  & dt {
    border-bottom: 1px solid black;
  }
`;

// const primaryRed = "hsl(356.8141592920354, 44.313725490196084%, 50%)";
const primaryRedBg = "hsla(357, 50%, 50%, 60%)";
const primaryRedDark = "#502124";

const psychologyStyle = css`
  background-color: ${primaryRedBg};
`;

type FighterStatMeta = {
  statKey: keyof FighterStats;
  label: string;
  suffix?: string;
};

const regularStats: FighterStatMeta[] = [
  { statKey: "m", label: "Movement", suffix: '"' },
  { statKey: "ws", label: "Weapon skill", suffix: "+" },
  { statKey: "bs", label: "Ballistic skill", suffix: "+" },
  { statKey: "s", label: "Strength" },
  { statKey: "t", label: "Toughness" },
  { statKey: "w", label: "Wounds" },
  { statKey: "i", label: "Initiative" },
  { statKey: "a", label: "Attacks" },
];

const psychologyStats: FighterStatMeta[] = [
  { statKey: "ld", label: "Leadership", suffix: "+" },
  { statKey: "cl", label: "Cool", suffix: "+" },
  { statKey: "wil", label: "Will", suffix: "+" },
  { statKey: "int", label: "Intelligence", suffix: "+" },
];

interface FighterStatsProps {
  fighterId: string;
  fighterStats: FighterStats;
}

export default function FighterStatsDisplay({
  fighterId,
  fighterStats,
}: FighterStatsProps) {
  function renderStat({ statKey, label, suffix }: FighterStatMeta) {
    const id = `${fighterId}-${suffix}`;
    return (
      <React.Fragment>
        <dt aria-hidden>{statKey.toUpperCase()}</dt>
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
          css={[psychologyStyle, { borderLeft: `2px solid ${primaryRedDark}` }]}
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
