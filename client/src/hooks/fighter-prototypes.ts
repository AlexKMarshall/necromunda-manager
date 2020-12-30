import { useQuery, useMutation, useQueryClient } from "react-query";
import { useClient } from "./client";

export function useReadFighterPrototypes() {
  const client = useClient();
  const queryResult = useQuery("fighterPrototypes", () =>
    client("fighter-prototypes")
  );

  const fighterPrototypes = queryResult.data;

  return { ...queryResult, fighterPrototypes };
}

export function useCreateFighterPrototype() {
  const client = useClient();
  const queryClient = useQueryClient();

  const createFighterPrototype = (fighterPrototype: any) =>
    client("fighter-prototypes", fighterPrototype);

  const mutationResult = useMutation(createFighterPrototype, {
    onSuccess: () => queryClient.invalidateQueries("fighterPrototypes"),
  });

  const postFighterPrototype = mutationResult.mutate;

  return { ...mutationResult, postFighterPrototype };
}
