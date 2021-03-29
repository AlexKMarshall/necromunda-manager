/** @jsxImportSource @emotion/react */
import { useForm } from "react-hook-form";
import { cluster, stack, stackSmall } from "../../styles";

interface AddFighterProps {
  fighterPrototypes: {
    id: string;
    name: string;
    cost: number;
  }[];
}

interface AddFighterForm {
  name: string;
  fighterPrototype: string;
}

export function AddFighter({ fighterPrototypes }: AddFighterProps) {
  const { register, handleSubmit } = useForm<AddFighterForm>({
    defaultValues: { name: "", fighterPrototype: "" },
  });

  function onSubmit(data: AddFighterForm) {
    console.log(data);
  }
  return (
    <form css={stack} onSubmit={handleSubmit(onSubmit)}>
      <h2>Add a Fighter</h2>
      <div css={stackSmall}>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" ref={register} />
      </div>
      <div css={stackSmall}>
        <label htmlFor="fighterPrototype">Type:</label>
        <select id="fighterPrototype" name="fighterPrototype" ref={register}>
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
