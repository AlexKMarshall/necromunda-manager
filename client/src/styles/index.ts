import { css } from "@emotion/react";

export const stack = css`
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

export const stackSmall = css`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  & > * {
    margin-top: 0;
    margin-bottom: 0;
  }
  & > * + * {
    margin-top: var(--s-1);
  }
`;

export const box = css`
  --padding: var(--s1);
  padding: var(--padding);
  border: var(--border-thin) solid;
`;

export const cluster = css`
  --cluster-gap: var(--s0);
  overflow: hidden;

  & > * {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    margin: calc(var(--cluster-gap) / 2 * -1);
  }

  & > * > * {
    margin: calc(var(--cluster-gap) / 2);
  }
`;
