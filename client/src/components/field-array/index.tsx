import { useFieldArray, useForm } from "react-hook-form";

export function FieldArray() {
  const { control, register, handleSubmit } = useForm({
    defaultValues: {
      stats: {
        test: [{ value: "" }],
      },
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "stats.test",
  });

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <ul>
        {fields.map((field, index) => (
          <li key={field.id}>
            <input
              name={`stats.test[${index}].value`}
              defaultValue={`${field.value}`}
              ref={register()}
            />
            <button type="button" onClick={() => remove(index)}>
              remove
            </button>
          </li>
        ))}
      </ul>
      <button type="button" onClick={() => append({ value: "" })}>
        append
      </button>
      <button type="submit">Submit</button>
    </form>
  );
}
