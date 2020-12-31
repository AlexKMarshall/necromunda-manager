import { useQuery, useMutation, useQueryClient } from "react-query";
import { QUERY_KEYS } from "../constants/query-keys";
import { useAuthClient } from "./client";

export function useReadGangs() {
  const client = useAuthClient();
  const queryResult = useQuery(QUERY_KEYS.gangs, () => client("gangs"));

  const gangs = queryResult.data;

  return { ...queryResult, gangs };
}

export function useCreateGang() {
  const client = useAuthClient();
  const queryClient = useQueryClient();

  const createGang = (gang: any) => client("gangs", gang);

  const mutationResult = useMutation(createGang, {
    onSuccess: () => queryClient.invalidateQueries(QUERY_KEYS.gangs),
  });

  const postGang = mutationResult.mutate;

  return { ...mutationResult, postGang };
}
