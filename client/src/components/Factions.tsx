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

function CreateFaction() {
  const { isLoading, postFaction } = useCreateFaction();

  const handleSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      name: { value: string };
    };
    const name = target.name.value;
    postFaction({ name });
    target.name.value = "";
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="faction-name">Faction Name</label>
      <input type="text" id="faction-name" name="name" />
      <button disabled={isLoading}>{isLoading ? "Saving..." : "Submit"}</button>
    </form>
  );
}
