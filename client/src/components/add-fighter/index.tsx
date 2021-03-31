/** @jsxImportSource @emotion/react */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { fighterPrototypeSchema } from "../../schemas/fighter-prototype.schema";
import { cluster, stack } from "../../styles";
import { StandardFormControl } from "../form";

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
  fighterPrototypeId: fighterPrototypeSchema.shape.id,
});

type AddFighterForm = z.infer<typeof addFighterFormSchema>;

export function AddFighter({ onSubmit, fighterPrototypes }: AddFighterProps) {
  const { register, handleSubmit, errors } = useForm<AddFighterForm>({
    defaultValues: { name: "", fighterPrototypeId: "" },
    resolver: zodResolver(addFighterFormSchema),
  });

  return (
    <form css={stack} onSubmit={handleSubmit(onSubmit)}>
      <h2>Add a Fighter</h2>
      <StandardFormControl
        name="name"
        label="Name:"
        renderControlElement={(props) => (
          <input type="text" ref={register} {...props} />
        )}
        error={errors.name}
      />
      <StandardFormControl
        name="fighterPrototypeId"
        label="FighterPrototype"
        renderControlElement={(props) => (
          <select ref={register} {...props}>
            {fighterPrototypes.map((fp) => (
              <option key={fp.id} value={fp.id}>
                {fp.name} - {fp.cost} credits
              </option>
            ))}
          </select>
        )}
        error={errors.fighterPrototypeId}
      />
      <div css={cluster}>
        <div>
          <button type="submit">OK</button>
          <button type="button">Cancel</button>
        </div>
      </div>
    </form>
  );
}
