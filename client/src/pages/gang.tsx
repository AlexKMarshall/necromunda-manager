import { useParams } from "react-router-dom";
import { useAddFighter, useReadGang } from "../hooks/gangs";
import { GangRoster } from "../components/gang-roster";
import { useMemo } from "react";
import { Gang as GangType } from "../schemas";
import { AddFighter } from "../components/add-fighter";
import { useReadFighterPrototypes } from "../hooks/fighter-prototypes";
interface RouteParams {
  id: string;
}

function formatGang({
  name,
  faction: { name: factionName },
  rating,
  reputation,
  wealth,
  territories,
  fighters,
  stash: { credits },
}: GangType) {
  return {
    name,
    house: factionName,
    rating,
    reputation,
    wealth,
    territories,
    fighters: fighters.map(
      ({
        name,
        fighterPrototype: { name: fighterPrototype },
        cost,
        experience: xp,
        advancements,
        recovery,
        capturedBy,
        lastingInjuries,
      }) => ({
        name,
        fighterPrototype,
        cost,
        xp,
        advancements,
        recovery: `${recovery}`,
        capturedBy: capturedBy ?? "",
        lastingInjuries: lastingInjuries ?? "",
      })
    ),
    stash: [`${credits} credits`],
  };
}
export function Gang() {
  const { id } = useParams<RouteParams>();
  const { isError, error, gang } = useReadGang(id);
  const formattedGang = useMemo(() => formatGang(gang), [gang]);
  const { isLoading, fighterPrototypes } = useReadFighterPrototypes();
  const factionFps = fighterPrototypes.filter(
    (fp) => fp.faction.id === gang.faction.id
  );

  const { addFighter } = useAddFighter(gang.id);

  if (isError) return <pre>{JSON.stringify(error)}</pre>;

  return (
    <div>
      <GangRoster {...formattedGang} />
      {isLoading ? (
        <span aria-label="loading">Spinner</span>
      ) : (
        <AddFighter fighterPrototypes={factionFps} onSubmit={addFighter} />
      )}
    </div>
  );
}
