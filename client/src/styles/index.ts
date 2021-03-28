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

export const box = css`
  --padding: var(--s1);
  padding: var(--padding);
  border: var(--border-thin) solid;
`;
