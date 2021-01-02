import { useQuery, useMutation, useQueryClient } from "react-query";
import { QUERY_KEYS } from "../constants/query-keys";
import {
  CreateItemTypeDto,
  ItemType,
  itemTypeSchema,
} from "../schemas/item-type.schema";
import { createTempId, sortByField } from "../utils";
import { useAuthClient } from "./client";

export function useReadItemTypes() {
  const client = useAuthClient();

  const query = async () => {
    try {
      const data = await client("item-types");
      return itemTypeSchema.array().parse(data).sort(sortByField("name"));
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const queryResult = useQuery(QUERY_KEYS.itemTypes, query);

  const itemTypes = queryResult.data ?? [];

  return { ...queryResult, itemTypes };
}

export function useCreateItemType() {
  const client = useAuthClient();
  const queryClient = useQueryClient();

  const query = (itemType: CreateItemTypeDto) => client("item-types", itemType);

  const mutationResult = useMutation(query, {
    onMutate: async (itemType) => {
      await queryClient.cancelQueries(QUERY_KEYS.itemTypes);

      const previousItemTypes =
        queryClient.getQueryData<ItemType[]>(QUERY_KEYS.itemTypes) ?? [];

      queryClient.setQueryData<ItemType[]>(QUERY_KEYS.itemTypes, (old) => {
        const oldItemTypes = old ?? [];
        const newItemTypes = { id: createTempId(), name: itemType.name };
        return [...oldItemTypes, newItemTypes].sort(sortByField("name"));
      });
      return { previousItemTypes };
    },
    onError: (err, itemType, context) => {
      queryClient.setQueryData(
        QUERY_KEYS.itemTypes,
        // TODO can this be improved
        (context as any).previousItemTypes
      );
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEYS.itemTypes),
  });

  const createItemType = mutationResult.mutate;

  return { ...mutationResult, createItemType };
}

export function useDeleteItemType() {
  const client = useAuthClient();
  const queryClient = useQueryClient();

  const query = (itemTypeId: string) =>
    client(`item-types/${itemTypeId}`, null, { method: "DELETE" });

  const mutationResult = useMutation(query, {
    onMutate: async (itemTypeId) => {
      await queryClient.cancelQueries(QUERY_KEYS.itemTypes);

      const previousItemTypes =
        queryClient.getQueryData<ItemType[]>(QUERY_KEYS.itemTypes) ?? [];

      queryClient.setQueryData<ItemType[]>(QUERY_KEYS.itemTypes, (old) =>
        old ? old.filter((f) => f.id !== itemTypeId) : []
      );

      return { previousItemTypes };
    },
    onError: (err, itemTypeId, context) => {
      queryClient.setQueryData(
        QUERY_KEYS.itemTypes,
        // TODO can this be improved
        (context as any).previousItemTypes
      );
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEYS.itemTypes),
  });

  const deleteItemType = mutationResult.mutate;

  return { ...mutationResult, deleteItemType };
}
