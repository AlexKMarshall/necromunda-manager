import { useQuery, useMutation, useQueryClient } from "react-query";
import { QUERY_KEYS } from "../constants/query-keys";
import { useAuthClient } from "./client";

export function useReadFighterClasses() {
  const client = useAuthClient();
  const queryResult = useQuery("fighterClasses", () =>
    client("fighter-classes")
  );

  const fighterClasses = queryResult.data;

  return { ...queryResult, fighterClasses };
}

export function useCreateFighterClass() {
  const client = useAuthClient();
  const queryClient = useQueryClient();

  const createFighterClass = (fighterClass: any) =>
    client("fighter-classes", fighterClass);

  const mutationResult = useMutation(createFighterClass, {
    onSuccess: () => queryClient.invalidateQueries("fighterClasses"),
  });

  const postFighterClass = mutationResult.mutate;

  return { ...mutationResult, postFighterClass };
}
export function useDeleteFighterClass() {
  const client = useAuthClient();
  const queryClient = useQueryClient();

  const deleteFighterClassClient = (fighterClassId: string) =>
    client(`fighter-classes/${fighterClassId}`, null, { method: "DELETE" });

  const mutationResult = useMutation(deleteFighterClassClient, {
    onSuccess: () => queryClient.invalidateQueries(QUERY_KEYS.fighterClasses),
  });

  const deleteFighterClass = mutationResult.mutate;

  return { ...mutationResult, deleteFighterClass };
}
