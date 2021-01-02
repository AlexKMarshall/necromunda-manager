import { useMutation, useQueryClient } from "react-query";
import { QUERY_KEYS } from "../constants/query-keys";
import { useAuthClient } from "./client";

export function useCreatePuchase(gangId: string) {
  const client = useAuthClient();
  const queryClient = useQueryClient();

  const query = (basket: any) => client(`gangs/${gangId}/purchase`, basket);

  const mutationResult = useMutation(query, {
    onSettled: () => {
      queryClient.invalidateQueries([QUERY_KEYS.gangs, gangId]);
    },
  });

  const createPurchase = mutationResult.mutate;

  return { ...mutationResult, createPurchase };
}
