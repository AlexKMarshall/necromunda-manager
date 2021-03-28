/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const dlStyle = css`
  display: grid;
  grid-template-columns: 1fr 4fr;
  row-gap: var(--s-2);

  & dt {
    font-weight: bold;
  }
`;

export interface SkillsWargearProps {
  skills: string;
  wargear: string;
}

export function SkillsWargear({ skills, wargear }: SkillsWargearProps) {
  return (
    <dl css={dlStyle}>
      <dt>SKILLS:</dt>
      <dd>{skills}</dd>
      <dt>WARGEAR:</dt>
      <dd>{wargear}</dd>
    </dl>
  );
}
