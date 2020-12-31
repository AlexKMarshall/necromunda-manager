import { useQuery, useMutation, useQueryClient } from "react-query";
import { useAuthClient } from "./client";

export function useReadFactions() {
  const client = useAuthClient();
  const queryResult = useQuery("factions", () => client("factions"));

  const factions = queryResult.data;

  return { ...queryResult, factions };
}

export function useCreateFaction() {
  const client = useAuthClient();
  const queryClient = useQueryClient();

  const createFaction = (faction: any) => client("factions", faction);

  const mutationResult = useMutation(createFaction, {
    onSuccess: () => queryClient.invalidateQueries("factions"),
  });

  const postFaction = mutationResult.mutate;

  return { ...mutationResult, postFaction };
}
