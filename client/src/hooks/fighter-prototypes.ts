import { useQuery, useMutation, useQueryClient } from "react-query";
import { QUERY_KEYS } from "../constants/query-keys";
import {
  CreateFighterPrototypeDto,
  FighterPrototype,
  fighterPrototypeSchema,
} from "../schemas/fighter-prototype.schema";
import { useAuthClient } from "./client";
import { createTempId, sortByField } from "../utils";
import { defaultFaction, useReadFactions } from "./factions";
import { defaultFighterClass, useReadFighterClasses } from "./fighter-classes";

export function useReadFighterPrototypes() {
  const client = useAuthClient();

  const query = async () => {
    try {
      const data = await client("fighter-prototypes");
      return fighterPrototypeSchema
        .array()
        .parse(data)
        .sort(sortByField("name"));
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const queryResult = useQuery(QUERY_KEYS.fighterPrototypes, query);

  const fighterPrototypes = queryResult.data ?? [];

  return { ...queryResult, fighterPrototypes };
}

export function useCreateFighterPrototype() {
  const client = useAuthClient();
  const queryClient = useQueryClient();
  const { factions } = useReadFactions();
  const { fighterClasses } = useReadFighterClasses();

  const query = (fighterPrototype: CreateFighterPrototypeDto) =>
    client("fighter-prototypes", fighterPrototype);

  const mutationResult = useMutation(query, {
    onMutate: async ({ name, cost, factionId, fighterClassId }) => {
      await queryClient.cancelQueries(QUERY_KEYS.fighterPrototypes);

      const previousFighterPrototypes =
        queryClient.getQueryData<FighterPrototype[]>(
          QUERY_KEYS.fighterPrototypes
        ) ?? [];

      const faction =
        factions.find((faction) => faction.id === factionId) ?? defaultFaction;
      const fighterClass =
        fighterClasses.find((fc) => fc.id === fighterClassId) ??
        defaultFighterClass;

      queryClient.setQueryData<FighterPrototype[]>(
        QUERY_KEYS.fighterPrototypes,
        (old) => {
          const oldFighterPrototypes = old ?? [];
          const newFighterPrototype = {
            name,
            cost,
            faction,
            fighterClass,
            id: createTempId(),
          };
          return [...oldFighterPrototypes, newFighterPrototype].sort(
            sortByField("name")
          );
        }
      );
      return { previousFighterPrototypes };
    },
    onError: (err, fighterPrototype, context) => {
      queryClient.setQueryData(
        QUERY_KEYS.fighterPrototypes,
        // TODO can this be improved
        (context as any).previousFighterPrototypes
      );
    },
    onSettled: () =>
      queryClient.invalidateQueries(QUERY_KEYS.fighterPrototypes),
  });

  const postFighterPrototype = mutationResult.mutate;

  return { ...mutationResult, postFighterPrototype };
}

export function useDeleteFighterPrototype() {
  const client = useAuthClient();
  const queryClient = useQueryClient();

  const query = (fighterPrototypeId: string) =>
    client(`fighter-prototypes/${fighterPrototypeId}`, null, {
      method: "DELETE",
    });

  const mutationResult = useMutation(query, {
    onMutate: async (fighterPrototypeId) => {
      await queryClient.cancelQueries(QUERY_KEYS.fighterPrototypes);

      const previousFighterPrototypes =
        queryClient.getQueryData<FighterPrototype[]>(
          QUERY_KEYS.fighterPrototypes
        ) ?? [];

      queryClient.setQueryData<FighterPrototype[]>(
        QUERY_KEYS.fighterPrototypes,
        (old) => (old ? old.filter((fc) => fc.id !== fighterPrototypeId) : [])
      );

      return { previousFighterPrototypes };
    },
    onError: (err, fighterPrototypeId, context) => {
      queryClient.setQueryData(
        QUERY_KEYS.fighterPrototypes,
        // TODO can this be improved
        (context as any).previousFighterPrototypes
      );
    },
    onSuccess: () =>
      queryClient.invalidateQueries(QUERY_KEYS.fighterPrototypes),
  });

  const deleteFighterPrototype = mutationResult.mutate;

  return { ...mutationResult, deleteFighterPrototype };
}
