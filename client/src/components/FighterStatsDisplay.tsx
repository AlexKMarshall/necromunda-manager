/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
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
  "aria-label": string;
  suffix?: string;
};

interface FighterStatsProps {
  fighterId: string;
  fighterStats: FighterStats;
}

const regularStats: FighterStatMeta[] = [
  { statKey: "m", "aria-label": "Movement", suffix: '"' },
  { statKey: "ws", "aria-label": "Weapon skill", suffix: "+" },
  { statKey: "bs", "aria-label": "Ballistic skill", suffix: "+" },
  { statKey: "s", "aria-label": "Strength" },
  { statKey: "t", "aria-label": "Toughness" },
  { statKey: "w", "aria-label": "Wounds" },
  { statKey: "i", "aria-label": "Initiative" },
  { statKey: "a", "aria-label": "Attacks" },
];

const psychologyStats: FighterStatMeta[] = [
  { statKey: "ld", "aria-label": "Leadership", suffix: "+" },
  { statKey: "cl", "aria-label": "Cool", suffix: "+" },
  { statKey: "wil", "aria-label": "Will", suffix: "+" },
  { statKey: "int", "aria-label": "Intelligence", suffix: "+" },
];

export default function FighterStatsDisplay({
  fighterId,
  fighterStats,
}: FighterStatsProps) {
  return (
    <dl css={dlStyle}>
      {regularStats.map(({ statKey, suffix }) => (
        <div key={`${fighterId}-${statKey}`}>
          <dt>{statKey.toUpperCase()}</dt>
          <dd>{`${fighterStats[statKey]}${suffix ?? ""}`}</dd>
        </div>
      ))}
      {psychologyStats.slice(0, 1).map(({ statKey, suffix }) => (
        <div
          key={`${fighterId}-${statKey}`}
          css={[psychologyStyle, { borderLeft: `2px solid ${primaryRedDark}` }]}
        >
          <dt>{statKey.toUpperCase()}</dt>
          <dd>{`${fighterStats[statKey]}${suffix ?? ""}`}</dd>
        </div>
      ))}
      {psychologyStats.slice(1).map(({ statKey, suffix }) => (
        <div key={`${fighterId}-${statKey}`} css={psychologyStyle}>
          <dt>{statKey.toUpperCase()}</dt>
          <dd>{`${fighterStats[statKey]}${suffix ?? ""}`}</dd>
        </div>
      ))}
    </dl>
  );
}
