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

const headerStyle = css`
  font-size: var(--s1);
`;

const dlStyle = css`
  display: flex;
  flex-wrap: wrap;
  gap: var(--s1);
  & dt {
    font-weight: 700;
  }
`;

const stackStyle = css`
  --space: var(--s1);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  & > * {
    margin-top: 0;
    margin-bottom: 0;
  }
  & > * + * {
    margin-top: var(--space);
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
        <div css={stackStyle}>
          <section>
            <h2 css={headerStyle}>Gang Name</h2>
            <p>{name}</p>
          </section>
          <section>
            <h2 css={headerStyle}>House</h2>
            <p>{house}</p>
          </section>

          <dl css={dlStyle}>
            <div>
              <dt>Gang Rating</dt>
              <dd>{rating}</dd>
            </div>
            <div>
              <dt>Reputation</dt>
              <dd>{reputation}</dd>
            </div>
            <div>
              <dt>Wealth</dt>
              <dd>{wealth}</dd>
            </div>
          </dl>

          <section>
            <h2 css={headerStyle}>Territories Held</h2>
            <ul>
              {territories.map((territory) => (
                <li key={territory}>{territory}</li>
              ))}
            </ul>
          </section>
          <section>
            <h2 css={headerStyle}>Stash</h2>
            <ul>
              {stash.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>
        <div>
          <FighterList fighters={fighters} />
        </div>
      </div>
    </div>
  );
}
