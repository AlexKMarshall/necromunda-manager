import { useParams } from "react-router-dom";
import { useReadGang } from "../hooks/gangs";
import { GangRoster } from "../components/gang-roster";
import { useMemo } from "react";
import { Gang as GangType } from "../schemas";
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
    fighters: [],
    stash: [`${credits} credits`],
  };
}
export function Gang() {
  const { id } = useParams<RouteParams>();
  const { isError, error, gang } = useReadGang(id);

  const formattedGang = useMemo(() => formatGang(gang), [gang]);

  if (isError) return <pre>{JSON.stringify(error)}</pre>;

  return (
    <div>
      <GangRoster {...formattedGang} />;
    </div>
  );
}
