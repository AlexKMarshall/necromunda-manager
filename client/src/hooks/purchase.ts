import { useMutation, useQueryClient } from "react-query";
import { useAuthClient } from "./client";

export function useCreatePuchase(gangId: string) {
  const client = useAuthClient();

  const query = (basket: any) => client(`gangs/${gangId}/purchase`, basket);

  const mutationResult = useMutation(query);

  const createPurchase = mutationResult.mutate;

  return { ...mutationResult, createPurchase };
}
