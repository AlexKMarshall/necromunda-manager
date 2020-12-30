import { useForm } from "react-hook-form";
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

interface FighterPrototypeFormData {
  name: string;
  cost: number;
  factionId: string;
  fighterClassId: string;
}

function CreateFighterPrototype() {
  const { isLoading, postFighterPrototype } = useCreateFighterPrototype();
  const {
    isLoading: isFighterClassLoading,
    fighterClasses,
  } = useReadFighterClasses();
  const { isLoading: isFactionLoading, factions } = useReadFactions();
  const { register, handleSubmit, reset } = useForm<FighterPrototypeFormData>();

  const onSubmit = async (formData: FighterPrototypeFormData) => {
    const { name, cost, fighterClassId, factionId } = formData;
    const createFighterPrototypeDTO = {
      name,
      cost,
      fighterClass: { id: fighterClassId },
      faction: { id: factionId },
    };
    await postFighterPrototype(createFighterPrototypeDTO);
    reset();
  };

  if (isFighterClassLoading || isFactionLoading) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="fighter-prototype-name">Fighter Class Name</label>
      <input
        type="text"
        id="fighter-prototype-name"
        name="name"
        ref={register({ required: true })}
      />
      <label htmlFor="fighter-class">Select Fighter class:</label>
      <select
        name="fighterClassId"
        id="fighter-class"
        ref={register({ required: true })}
      >
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
      <select name="factionId" id="faction" ref={register({ required: true })}>
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
      <input
        type="number"
        id="cost"
        name="cost"
        ref={register({ required: true })}
      />
      <button disabled={isLoading}>{isLoading ? "Saving..." : "Submit"}</button>
    </form>
  );
}
