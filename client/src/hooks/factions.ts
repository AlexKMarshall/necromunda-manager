import { useQuery, useMutation, useQueryClient } from "react-query";
import { QUERY_KEYS } from "../constants/query-keys";
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

export function useDeleteFaction() {
  const client = useAuthClient();
  const queryClient = useQueryClient();

  const deleteFactionClient = (factionId: string) =>
    client(`factions/${factionId}`, undefined, { method: "DELETE" });

  const mutationResult = useMutation(deleteFactionClient, {
    onMutate: async (factionId) => {
      await queryClient.cancelQueries(QUERY_KEYS.factions);

      const previousFactions = queryClient.getQueryData(QUERY_KEYS.factions);

      queryClient.setQueryData(QUERY_KEYS.factions, (old) =>
        (old as any[]).filter((f) => f.id !== factionId)
      );

      return { previousFactions };
    },
    onError: (err, factionId, context) => {
      queryClient.setQueryData(
        QUERY_KEYS.factions,
        (context as any).previousFactions
      );
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEYS.factions),
  });

  const deleteFaction = mutationResult.mutate;

  return { ...mutationResult, deleteFaction };
}
