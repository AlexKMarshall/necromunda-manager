import { useParams } from "react-router-dom";
import { useReadGangDetail } from "../hooks/gangs";
import { FighterStats as FighterStatsType } from "../schemas/fighter.schema";
import { FighterStats } from "./fighter-stats-display";

type GangDetailParams = {
  gangId: string;
};

export default function GangDetail() {
  const { gangId } = useParams<GangDetailParams>();
  const { isLoading, isError, error, gangDetail } = useReadGangDetail(gangId);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>{JSON.stringify(error)}</div>;
  if (!gangDetail) return <div>Oh no, this shouldn't happen</div>;

  return (
    <div>
      <h2>Gang - {gangDetail.name}</h2>
      <p>Stash - {gangDetail.stash}</p>
      <h3>Fighters</h3>
      <ul>
        {gangDetail.fighters.map((fighter) => (
          <li key={fighter.id}>
            {fighter.name} - {fighter.fighterPrototype.name}
          </li>
        ))}
      </ul>
      <FighterStats fighterId="abc123" fighterStats={sampleFighterStats} />
    </div>
  );
}

const sampleFighterStats: FighterStatsType = {
  m: 5,
  ws: 2,
  bs: 3,
  s: 3,
  t: 3,
  w: 3,
  i: 2,
  a: 3,
  ld: 5,
  cl: 6,
  wil: 6,
  int: 7,
};
