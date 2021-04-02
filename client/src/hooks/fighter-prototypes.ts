import { useQuery, useMutation, useQueryClient } from "react-query";
import { QUERY_KEYS } from "../constants/query-keys";
import {
  CreateFighterPrototypeDto,
  FighterPrototype,
  fighterPrototypeSchema,
} from "../schemas/fighter-prototype.schema";
import { useAuthClient } from "./client";
import { createTempId, sortByField } from "../utils";
import { useReadFactions } from "./factions";
import { defaultFighterClass, useReadFighterClasses } from "./fighter-classes";
import { loadingFaction } from "../schemas";

export function useReadFighterPrototypes() {
  const client = useAuthClient();

  const query = async () => {
    try {
      const data = await client("fighter-prototypes");
      return fighterPrototypeSchema
        .array()
        .parse(data)
        .sort(sortByField("name"))
        .map((fp) => ({ ...fp, loading: false }));
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
    onMutate: async ({
      name,
      cost,
      factionId,
      fighterClassId,
      fighterStats,
    }) => {
      await queryClient.cancelQueries(QUERY_KEYS.fighterPrototypes);

      const previousFighterPrototypes =
        queryClient.getQueryData<FighterPrototype[]>(
          QUERY_KEYS.fighterPrototypes
        ) ?? [];

      const faction =
        factions.find((faction) => faction.id === factionId) ?? loadingFaction;
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
            fighterStats,
            id: createTempId(),
            loading: true,
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

export function useDeleteFighterPrototype(id: FighterPrototype["id"]) {
  const client = useAuthClient();
  const queryClient = useQueryClient();

  const query = () =>
    client(`fighter-prototypes/${id}`, null, {
      method: "DELETE",
    });

  const mutationResult = useMutation(query, {
    onMutate: async () => {
      await queryClient.cancelQueries(QUERY_KEYS.fighterPrototypes);

      const previousFighterPrototypes =
        queryClient.getQueryData<FighterPrototype[]>(
          QUERY_KEYS.fighterPrototypes
        ) ?? [];

      queryClient.setQueryData<FighterPrototype[]>(
        QUERY_KEYS.fighterPrototypes,
        (old) => (old ? old.filter((fp) => fp.id !== id) : [])
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
