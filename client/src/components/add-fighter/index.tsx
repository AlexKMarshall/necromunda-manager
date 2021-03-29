/** @jsxImportSource @emotion/react */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cluster, stack, stackSmall } from "../../styles";

interface AddFighterProps {
  onSubmit: (data: AddFighterForm) => void;
  fighterPrototypes: {
    id: string;
    name: string;
    cost: number;
  }[];
}

const addFighterFormSchema = z.object({
  name: z.string().nonempty({ message: "Required" }),
  fighterPrototype: z.string().nonempty({ message: "Required" }),
});

type AddFighterForm = z.infer<typeof addFighterFormSchema>;

export function AddFighter({ onSubmit, fighterPrototypes }: AddFighterProps) {
  const { register, handleSubmit, errors } = useForm<AddFighterForm>({
    defaultValues: { name: "", fighterPrototype: "" },
    resolver: zodResolver(addFighterFormSchema),
  });

  return (
    <form css={stack} onSubmit={handleSubmit(onSubmit)}>
      <h2>Add a Fighter</h2>
      <div css={stackSmall}>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" ref={register} />
        {errors.name ? <span role="alert">{errors.name.message}</span> : null}
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
        {errors.fighterPrototype ? (
          <span role="alert">{errors.fighterPrototype.message}</span>
        ) : null}
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
