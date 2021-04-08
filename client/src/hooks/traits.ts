import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  UseMutationOptions,
} from "react-query";
import { QUERY_KEYS } from "../constants/query-keys";
import { Trait, traitSchema, CreateTraitDto } from "../schemas";
import { createTempId, sortByField } from "../utils";
import { useAuthClient } from "./client";

const endpoint = "traits";

export function useReadTraits() {
  const client = useAuthClient();

  const query = async () => {
    try {
      const data = await client(endpoint);
      return traitSchema
        .array()
        .parse(data)
        .sort(sortByField("name"))
        .map((f) => ({ ...f, loading: false }));
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const queryResult = useQuery(QUERY_KEYS.traits, query);

  const traits = queryResult.data ?? [];

  return { ...queryResult, traits };
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
      queryClient.invalidateQueries(QUERY_KEYS.traits);
    },
  };
}

export function useCreateTrait() {
  const client = useAuthClient();
  const queryClient = useQueryClient();

  const query = (trait: CreateTraitDto) => client(endpoint, trait);

  const mutationResult = useMutation(query, {
    onMutate: async (trait) => {
      await queryClient.cancelQueries(QUERY_KEYS.traits);

      const previousTraits =
        queryClient.getQueryData<Trait[]>(QUERY_KEYS.traits) ?? [];

      queryClient.setQueryData<Trait[]>(QUERY_KEYS.traits, (old) => {
        const oldTraits = old ?? [];
        const newTrait = {
          id: createTempId(),
          ...trait,
          loading: true,
        };
        return [...oldTraits, newTrait].sort(sortByField("name"));
      });

      return () => queryClient.setQueryData(QUERY_KEYS.traits, previousTraits);
    },
    ...defaultMutationConfig(queryClient),
  });

  const postTrait = mutationResult.mutateAsync;

  return { ...mutationResult, postTrait };
}

export function useDeleteTrait(id: Trait["id"]) {
  const client = useAuthClient();
  const queryClient = useQueryClient();

  const query = () =>
    client(`${endpoint}/${id}`, undefined, { method: "DELETE" });

  const mutationResult = useMutation(query, {
    onMutate: async () => {
      await queryClient.cancelQueries(QUERY_KEYS.traits);

      const previousTraits = queryClient.getQueryData(QUERY_KEYS.traits);

      queryClient.setQueryData<Trait[]>(QUERY_KEYS.traits, (old) =>
        old ? old.filter((f) => f.id !== id) : []
      );

      return () => {
        queryClient.setQueryData(QUERY_KEYS.traits, previousTraits);
      };
    },
    ...defaultMutationConfig(queryClient),
  });

  const deleteTrait = mutationResult.mutateAsync;

  return { ...mutationResult, deleteTrait };
}
