import { useQuery, useMutation, useQueryClient } from "react-query";
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
