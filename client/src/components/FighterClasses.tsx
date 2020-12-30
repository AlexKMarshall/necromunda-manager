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

function CreateFighterClass() {
  const { isLoading, postFighterClass } = useCreateFighterClass();

  const handleSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      name: { value: string };
    };
    const name = target.name.value;
    postFighterClass({ name });
    target.name.value = "";
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="fighter-class-name">Fighter Class Name</label>
      <input type="text" id="fighter-class-name" name="name" />
      <button disabled={isLoading}>{isLoading ? "Saving..." : "Submit"}</button>
    </form>
  );
}
