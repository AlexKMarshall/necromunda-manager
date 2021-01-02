import { useQuery, useMutation, useQueryClient } from "react-query";
import { QUERY_KEYS } from "../constants/query-keys";
import {
  CreateWeaponDto,
  Weapon,
  weaponSchema,
} from "../schemas/weapon.schema";
import { createTempId } from "../utils";
import { useAuthClient } from "./client";

export function useReadWeapons() {
  const client = useAuthClient();

  const query = async () => {
    try {
      const data = await client("weapons");
      return weaponSchema.array().parse(data);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const queryResult = useQuery(QUERY_KEYS.weapons, query);

  const weapons = queryResult.data ?? [];

  return { ...queryResult, weapons };
}

export function useCreateWeapon() {
  const client = useAuthClient();
  const queryClient = useQueryClient();

  const query = (weapon: CreateWeaponDto) => client("weapons", weapon);

  const mutationResult = useMutation(query, {
    onMutate: async (weapon) => {
      await queryClient.cancelQueries(QUERY_KEYS.weapons);

      const previousWeapons =
        queryClient.getQueryData<Weapon[]>(QUERY_KEYS.weapons) ?? [];

      queryClient.setQueryData<Weapon[]>(QUERY_KEYS.weapons, (old) => {
        const oldWeapons = old ?? [];
        const newWeapon = { ...weapon, id: createTempId() };
        return [...oldWeapons, newWeapon];
      });
      return { previousWeapons };
    },
    onError: (err, weapon, context) => {
      queryClient.setQueryData(
        QUERY_KEYS.weapons,
        // TODO can this be improved
        (context as any).previousWeapons
      );
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEYS.weapons),
  });

  const createWeapon = mutationResult.mutate;

  return { ...mutationResult, createWeapon };
}

export function useDeleteWeapon() {
  const client = useAuthClient();
  const queryClient = useQueryClient();

  const query = (weaponId: string) =>
    client(`weapons/${weaponId}`, undefined, { method: "DELETE" });

  const mutationResult = useMutation(query, {
    onMutate: async (weaponId) => {
      await queryClient.cancelQueries(QUERY_KEYS.weapons);

      const previousWeapons =
        queryClient.getQueryData<Weapon[]>(QUERY_KEYS.weapons) ?? [];

      queryClient.setQueryData<Weapon[]>(QUERY_KEYS.weapons, (old) =>
        old ? old.filter((w) => w.id !== weaponId) : []
      );

      return { previousWeapons };
    },
    onError: (err, weaponId, context) => {
      queryClient.setQueryData(
        QUERY_KEYS.weapons,
        // TODO can this be improved
        (context as any).previousWeapons
      );
    },
    onSettled: () => queryClient.invalidateQueries(QUERY_KEYS.weapons),
  });

  const deleteWeapon = mutationResult.mutate;

  return { ...mutationResult, deleteWeapon };
}
