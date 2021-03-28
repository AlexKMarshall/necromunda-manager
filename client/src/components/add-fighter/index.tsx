/** @jsxImportSource @emotion/react */
import { FormEvent } from "react";
import { cluster, stack, stackSmall } from "../../styles";

interface AddFighterProps {
  fighterPrototypes: {
    id: string;
    name: string;
    cost: number;
  }[];
}

export function AddFighter({ fighterPrototypes }: AddFighterProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }
  return (
    <form css={stack} onSubmit={handleSubmit}>
      <h2>Add a Fighter</h2>
      <div css={stackSmall}>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" />
      </div>
      <div css={stackSmall}>
        <label htmlFor="fighterPrototype">Type:</label>
        <select id="fighterPrototype">
          {fighterPrototypes.map((fp) => (
            <option key={fp.id} value={fp.name}>
              {fp.name} - {fp.cost} credits
            </option>
          ))}
        </select>
      </div>
      <div css={cluster}>
        <div>
          <button type="submit">OK</button>
          <button type="button">Cancel</button>
        </div>
      </div>
    </form>
  );
}
