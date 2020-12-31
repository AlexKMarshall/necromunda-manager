import { useQuery, useMutation, useQueryClient } from "react-query";
import { QUERY_KEYS } from "../constants/query-keys";
import { useAuthClient } from "./client";

export function useReadFighterPrototypes() {
  const client = useAuthClient();
  const queryResult = useQuery("fighterPrototypes", () =>
    client("fighter-prototypes")
  );

  const fighterPrototypes = queryResult.data;

  return { ...queryResult, fighterPrototypes };
}

export function useCreateFighterPrototype() {
  const client = useAuthClient();
  const queryClient = useQueryClient();

  const createFighterPrototype = (fighterPrototype: any) =>
    client("fighter-prototypes", fighterPrototype);

  const mutationResult = useMutation(createFighterPrototype, {
    onSuccess: () => queryClient.invalidateQueries("fighterPrototypes"),
  });

  const postFighterPrototype = mutationResult.mutate;

  return { ...mutationResult, postFighterPrototype };
}

export function useDeleteFighterPrototype() {
  const client = useAuthClient();
  const queryClient = useQueryClient();

  const deleteFighterPrototypeClient = (fighterPrototypeId: string) =>
    client(`fighter-prototypes/${fighterPrototypeId}`, null, {
      method: "DELETE",
    });

  const mutationResult = useMutation(deleteFighterPrototypeClient, {
    onSuccess: () => queryClient.invalidateQueries(QUERY_KEYS.fighterPrototype),
  });

  const deleteFighterPrototype = mutationResult.mutate;

  return { ...mutationResult, deleteFighterPrototype };
}
