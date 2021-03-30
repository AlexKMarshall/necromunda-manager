import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  UseMutationOptions,
} from "react-query";
import faker from "faker";
import { QUERY_KEYS } from "../constants/query-keys";
import {
  Faction,
  factionSchema,
  CreateFactionDto,
} from "../schemas/faction.schema";
import { createTempId, sortByField } from "../utils";
import { useAuthClient } from "./client";

const endpoint = "factions";

export const defaultFaction: Faction = {
  id: faker.random.uuid(),
  name: "Loading...",
};

export function useReadFactions() {
  const client = useAuthClient();

  const query = async () => {
    try {
      const data = await client(endpoint);
      return factionSchema.array().parse(data).sort(sortByField("name"));
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const queryResult = useQuery(QUERY_KEYS.factions, query);

  const factions = queryResult.data ?? [];

  return { ...queryResult, factions };
}

function defaultMutationConfig<TData, TError, TVariables, TContext>(
  queryClient: QueryClient
): UseMutationOptions<TData, TError, TVariables, TContext> {
  return {
    onError: (err, variables, recover) => {
      if (typeof recover === "function") {
        recover();
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(QUERY_KEYS.factions);
    },
  };
}

export function useCreateFaction() {
  const client = useAuthClient();
  const queryClient = useQueryClient();

  const query = (faction: CreateFactionDto) => client(endpoint, faction);

  const mutationResult = useMutation(query, {
    onMutate: async (faction) => {
      await queryClient.cancelQueries(QUERY_KEYS.factions);

      const previousFactions =
        queryClient.getQueryData<Faction[]>(QUERY_KEYS.factions) ?? [];

      queryClient.setQueryData<Faction[]>(QUERY_KEYS.factions, (old) => {
        const oldFactions = old ?? [];
        const newFaction = { id: createTempId(), name: faction.name };
        return [...oldFactions, newFaction].sort(sortByField("name"));
      });

      return () =>
        queryClient.setQueryData(QUERY_KEYS.factions, previousFactions);
    },
    ...defaultMutationConfig(queryClient),
  });

  const postFaction = mutationResult.mutateAsync;

  return { ...mutationResult, postFaction };
}

export function useDeleteFaction() {
  const client = useAuthClient();
  const queryClient = useQueryClient();

  const query = (factionId: string) =>
    client(`${endpoint}/${factionId}`, undefined, { method: "DELETE" });

  const mutationResult = useMutation(query, {
    onMutate: async (factionId) => {
      await queryClient.cancelQueries(QUERY_KEYS.factions);

      const previousFactions = queryClient.getQueryData(QUERY_KEYS.factions);

      queryClient.setQueryData<Faction[]>(QUERY_KEYS.factions, (old) =>
        old ? old.filter((f) => f.id !== factionId) : []
      );

      return () => {
        queryClient.setQueryData(QUERY_KEYS.factions, previousFactions);
      };
    },
    ...defaultMutationConfig(queryClient),
  });

  const deleteFaction = mutationResult.mutateAsync;

  return { ...mutationResult, deleteFaction };
}
