import { useForm } from "react-hook-form";
import {
  useCreateFighterClass,
  useReadFighterClasses,
} from "../hooks/fighter-classes";

export default function FighterClasses() {
  const { isLoading, isError, error, fighterClasses } = useReadFighterClasses();

  return (
    <div>
      <h2>Fighter Classes</h2>
      <CreateFighterClass />
      {isLoading ? (
        <div>"Loading..."</div>
      ) : isError ? (
        <pre>{JSON.stringify(error, null, 2)}</pre>
      ) : (
        <ul>
          {fighterClasses.map((fighterClass: any) => (
            <li key={fighterClass.id}>{fighterClass.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

interface FighterClassFormData {
  name: string;
}

function CreateFighterClass() {
  const { isLoading, postFighterClass } = useCreateFighterClass();
  const { register, handleSubmit, reset } = useForm<FighterClassFormData>();

  const onSubmit = async (formData: FighterClassFormData) => {
    await postFighterClass(formData);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="fighter-class-name">Fighter Class Name</label>
      <input
        type="text"
        id="fighter-class-name"
        name="name"
        ref={register({ required: true })}
      />
      <button disabled={isLoading}>{isLoading ? "Saving..." : "Submit"}</button>
    </form>
  );
}
