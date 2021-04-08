import { useQuery, useMutation, useQueryClient } from "react-query";
import faker from "faker";
import { QUERY_KEYS } from "../constants/query-keys";
import { useAuthClient } from "./client";
import {
  CreateFighterClassDto,
  FighterClass,
  fighterClassSchema,
} from "../schemas/fighter-class.schema";
import { createTempId, sortByField } from "../utils";

export const defaultFighterClass: FighterClass = {
  id: faker.random.uuid(),
  name: "Loading...",
};

export function useReadFighterClasses() {
  const client = useAuthClient();

  const query = async () => {
    try {
      const data = await client("fighter-classes");
      return fighterClassSchema
        .array()
        .parse(data)
        .sort(sortByField("name"))
        .map((fc) => ({ ...fc, loading: false }));
    } catch (error) {
      return Promise.reject(error);
    }
  };
  const queryResult = useQuery(QUERY_KEYS.fighterClasses, query);

  const fighterClasses = queryResult.data ?? [];

  return { ...queryResult, fighterClasses };
}

export function useCreateFighterClass() {
  const client = useAuthClient();
  const queryClient = useQueryClient();

  const query = (fighterClass: CreateFighterClassDto) =>
    client("fighter-classes", fighterClass);

  const mutationResult = useMutation(query, {
    onMutate: async (fighterClass) => {
      await queryClient.cancelQueries(QUERY_KEYS.fighterClasses);

      const previousFighterClasses =
        queryClient.getQueryData<FighterClass[]>(QUERY_KEYS.fighterClasses) ??
        [];

      queryClient.setQueryData<FighterClass[]>(
        QUERY_KEYS.fighterClasses,
        (old) => {
          const oldFighterClasses = old ?? [];
          const newFighterClass = {
            ...fighterClass,
            id: createTempId(),
            loading: true,
          };
          return [...oldFighterClasses, newFighterClass].sort(
            sortByField("name")
          );
        }
      );
      return { previousFighterClasses };
    },
    onError: (err, fighterClass, context) => {
      queryClient.setQueryData(
        QUERY_KEYS.fighterClasses,
        // TODO can this be improved
        (context as any).previousFighterClasses
      );
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEYS.fighterClasses),
  });

  const postFighterClass = mutationResult.mutate;

  return { ...mutationResult, postFighterClass };
}
export function useDeleteFighterClass(id: FighterClass["id"]) {
  const client = useAuthClient();
  const queryClient = useQueryClient();

  const query = () =>
    client(`fighter-classes/${id}`, null, { method: "DELETE" });

  const mutationResult = useMutation(query, {
    onMutate: async () => {
      await queryClient.cancelQueries(QUERY_KEYS.fighterClasses);

      const previousFighterClasses =
        queryClient.getQueryData<FighterClass[]>(QUERY_KEYS.fighterClasses) ??
        [];

      queryClient.setQueryData<FighterClass[]>(
        QUERY_KEYS.fighterClasses,
        (old) => (old ? old.filter((fc) => fc.id !== id) : [])
      );

      return { previousFighterClasses };
    },
    onError: (err, fighterClassId, context) => {
      queryClient.setQueryData(
        QUERY_KEYS.fighterClasses,
        // TODO can this be improved
        (context as any).previousFighterClasses
      );
    },
    onSuccess: () => queryClient.invalidateQueries(QUERY_KEYS.fighterClasses),
  });

  const deleteFighterClass = mutationResult.mutate;

  return { ...mutationResult, deleteFighterClass };
}
