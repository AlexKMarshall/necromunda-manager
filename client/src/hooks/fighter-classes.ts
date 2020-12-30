import { useQuery, useMutation, useQueryClient } from "react-query";
import { useClient } from "./client";

export function useReadFighterClasses() {
  const client = useClient();
  const queryResult = useQuery("fighterClasses", () =>
    client("fighter-classes")
  );

  const fighterClasses = queryResult.data;

  return { ...queryResult, fighterClasses };
}

export function useCreateFighterClass() {
  const client = useClient();
  const queryClient = useQueryClient();

  const createFighterClass = (fighterClass: any) =>
    client("fighter-classes", fighterClass);

  const mutationResult = useMutation(createFighterClass, {
    onSuccess: () => queryClient.invalidateQueries("fighterClasses"),
  });

  const postFighterClass = mutationResult.mutate;

  return { ...mutationResult, postFighterClass };
}
