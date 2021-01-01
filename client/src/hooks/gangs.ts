import { useQuery, useMutation, useQueryClient } from "react-query";
import { QUERY_KEYS } from "../constants/query-keys";
import {
  CreateGangDto,
  gangSchema,
  Gang,
  gangDetailSchema,
} from "../schemas/gang.schema";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuthClient } from "./client";
import { createTempId } from "../utils";

export function useReadGangs() {
  const client = useAuthClient();

  const query = async () => {
    try {
      const data = await client("gangs");
      return gangSchema.array().parse(data);
    } catch (error) {
      return Promise.reject(error);
    }
  };
  const queryResult = useQuery(QUERY_KEYS.gangs, query);

  const gangs = queryResult.data ?? [];

  return { ...queryResult, gangs };
}

export function useReadGangDetail(gangId: string) {
  const client = useAuthClient();

  const query = async () => {
    try {
      const data = await client(`gangs/${gangId}`);
      console.log("received gang");
      console.log(data);
      return gangDetailSchema.parse(data);
    } catch (error) {
      return Promise.reject(error);
    }
  };
  const queryResult = useQuery([QUERY_KEYS.gangs, gangId], query);

  const gangDetail = queryResult.data;

  return { ...queryResult, gangDetail };
}

export function useCreateGang() {
  const { user } = useAuth0();
  const client = useAuthClient();
  const queryClient = useQueryClient();

  const query = (gang: CreateGangDto) => client("gangs", gang);

  const mutationResult = useMutation(query, {
    onMutate: async (gang) => {
      await queryClient.cancelQueries(QUERY_KEYS.gangs);

      const previousGangs =
        queryClient.getQueryData<Gang[]>(QUERY_KEYS.gangs) ?? [];

      queryClient.setQueryData<Gang[]>(QUERY_KEYS.gangs, (old) => {
        const oldGangs = old ?? [];
        const newGang = {
          ...gang,
          id: createTempId(),
          userId: user?.sub,
        };
        return [...oldGangs, newGang];
      });
      return { previousGangs };
    },
    onError: (err, gang, context) => {
      queryClient.setQueryData(
        QUERY_KEYS.gangs,
        // TODO can this be improved
        (context as any).previousGangs
      );
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEYS.gangs),
  });

  const postGang = mutationResult.mutate;

  return { ...mutationResult, postGang };
}

export function useDeleteGang() {
  const client = useAuthClient();
  const queryClient = useQueryClient();

  const query = (gangId: string) =>
    client(`gangs/${gangId}`, null, { method: "DELETE" });

  const mutationResult = useMutation(query, {
    onMutate: async (gangId) => {
      await queryClient.cancelQueries(QUERY_KEYS.gangs);

      const previousGangs =
        queryClient.getQueryData<Gang[]>(QUERY_KEYS.gangs) ?? [];

      queryClient.setQueryData<Gang[]>(QUERY_KEYS.gangs, (old) =>
        old ? old.filter((g) => g.id !== gangId) : []
      );

      return { previousGangs };
    },
    onError: (err, gangId, context) => {
      queryClient.setQueryData(
        QUERY_KEYS.gangs,
        // TODO can this be improved
        (context as any).previousGangs
      );
    },
    onSuccess: () => queryClient.invalidateQueries(QUERY_KEYS.gangs),
  });

  const deleteGang = mutationResult.mutate;

  return { ...mutationResult, deleteGang };
}
