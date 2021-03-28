/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { FighterSummary } from "../../types/fighter";
import { FighterList } from "../fighter-list";

interface GangRosterProps {
  name: string;
  house: string;
  rating: number;
  reputation: number;
  wealth: number;
  territories: string[];
  stash: string[];
  fighters: FighterSummary[];
}

const withSidebarStyle = css`
  overflow: hidden;

  & > * {
    display: flex;
    flex-wrap: wrap;
    margin: calc(var(--s1) / 2 * -1);
  }

  & > * > * {
    margin: calc(var(--s1) / 2);
    flex-grow: 1;
  }

  & > * > :last-child {
    flex-basis: 0;
    flex-grow: 999;
    /* min-width: calc(50% - var(--s1)); */
  }
`;

export function GangRoster({
  name,
  house,
  rating,
  reputation,
  wealth,
  territories,
  stash,
  fighters,
}: GangRosterProps) {
  return (
    <div css={withSidebarStyle}>
      <div>
        <div>
          <h2>Gang Name</h2>
          <p>{name}</p>
          <h2>House</h2>
          <p>{house}</p>
          <dl>
            <dt>Gang Rating</dt>
            <dd>{rating}</dd>
            <dt>Reputation</dt>
            <dd>{reputation}</dd>
            <dt>Wealth</dt>
            <dd>{wealth}</dd>
          </dl>
          <h2>Territories Held</h2>
          <ul>
            {territories.map((territory) => (
              <li key={territory}>{territory}</li>
            ))}
          </ul>
          <h2>Stash</h2>
          <ul>
            {stash.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <FighterList fighters={fighters} />
        </div>
      </div>
    </div>
  );
}
