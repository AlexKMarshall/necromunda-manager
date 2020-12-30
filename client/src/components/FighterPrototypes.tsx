import { useReadFactions } from "../hooks/factions";
import { useReadFighterClasses } from "../hooks/fighter-classes";
import {
  useCreateFighterPrototype,
  useReadFighterPrototypes,
} from "../hooks/fighter-prototypes";

export default function FighterPrototypes() {
  const {
    isLoading,
    isError,
    error,
    fighterPrototypes,
  } = useReadFighterPrototypes();

  return (
    <div>
      <h2>Fighter Prototypes</h2>
      <CreateFighterPrototype />
      {isLoading ? (
        <div>"Loading..."</div>
      ) : isError ? (
        <pre>{JSON.stringify(error, null, 2)}</pre>
      ) : (
        <ul>
          {fighterPrototypes.map((fighterPrototype: any) => (
            <li key={fighterPrototype.id}>
              {fighterPrototype.name} - {fighterPrototype.faction.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CreateFighterPrototype() {
  const { isLoading, postFighterPrototype } = useCreateFighterPrototype();
  const {
    isLoading: isFighterClassLoading,
    fighterClasses,
  } = useReadFighterClasses();
  const { isLoading: isFactionLoading, factions } = useReadFactions();

  const handleSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      name: { value: string };
      faction: { value: string };
      "fighter-class": { value: string };
      cost: { value: string };
    };
    const name = target.name.value;
    const factionId = target.faction.value;
    const fighterClassId = target["fighter-class"].value;
    const cost = target.cost.value;
    postFighterPrototype({
      name,
      fighterClass: { id: fighterClassId },
      faction: { id: factionId },
      cost,
    });
    target.name.value = "";
  };

  if (isFighterClassLoading || isFactionLoading) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="fighter-prototype-name">Fighter Class Name</label>
      <input type="text" id="fighter-prototype-name" name="name" />
      <label htmlFor="fighter-class">Select Fighter class:</label>
      <select name="fighter-class" id="fighter-class" required={true}>
        <option key="" value="" disabled={true}>
          Please select
        </option>
        {fighterClasses.map((fighterClass: any) => (
          <option key={fighterClass.id} value={fighterClass.id}>
            {fighterClass.name}
          </option>
        ))}
      </select>
      <label htmlFor="faction">Select Fighter class:</label>
      <select name="faction" id="faction" required={true}>
        <option key="" value="" disabled={true}>
          Please select
        </option>
        {factions.map((faction: any) => (
          <option key={faction.id} value={faction.id}>
            {faction.name}
          </option>
        ))}
      </select>
      <label htmlFor="cost">Cost:</label>
      <input type="number" id="cost" name="cost" />
      <button disabled={isLoading}>{isLoading ? "Saving..." : "Submit"}</button>
    </form>
  );
}
