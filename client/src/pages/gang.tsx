import { useParams } from "react-router-dom";
import { useReadGang } from "../hooks/gangs";

interface RouteParams {
  id: string;
}
export function Gang() {
  const { id } = useParams<RouteParams>();
  const { isError, error, gang } = useReadGang(id);

  if (isError) return <pre>{JSON.stringify(error)}</pre>;

  return <div>{JSON.stringify(gang)}</div>;
}
