import { useForm } from "react-hook-form";
import { useCreateFaction, useReadFactions } from "../hooks/factions";

export default function Factions() {
  const { isLoading, isError, error, factions } = useReadFactions();

  return (
    <div>
      <h2>Factions</h2>
      <CreateFaction />
      {isLoading ? (
        <div>"Loading..."</div>
      ) : isError ? (
        <pre>{JSON.stringify(error, null, 2)}</pre>
      ) : (
        <ul>
          {factions.map((faction: any) => (
            <li key={faction.id}>{faction.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

interface FactionFormData {
  name: string;
}

function CreateFaction() {
  const { isLoading, postFaction } = useCreateFaction();
  const { register, handleSubmit, reset } = useForm<FactionFormData>();

  const onSubmit = async (formData: FactionFormData) => {
    await postFaction(formData);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="faction-name">Faction Name</label>
      <input
        type="text"
        id="faction-name"
        name="name"
        ref={register({ required: true })}
      />
      <button disabled={isLoading}>{isLoading ? "Saving..." : "Submit"}</button>
    </form>
  );
}
