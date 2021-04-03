import { useQuery, useMutation, useQueryClient } from "react-query";
import { QUERY_KEYS } from "../constants/query-keys";
import {
  CreateWeaponDto,
  Weapon,
  weaponSchema,
  loadingTrait,
} from "../schemas";
import { useAuthClient } from "./client";
import { createTempId, sortByField } from "../utils";
import { useReadTraits } from "./traits";

const endpoint = "weapons";

export function useReadWeapons() {
  const client = useAuthClient();

  const query = async () => {
    try {
      const data = await client(endpoint);
      return weaponSchema
        .array()
        .parse(data)
        .sort(sortByField("name"))
        .map((fp) => ({ ...fp, loading: false }));
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
  const { traits } = useReadTraits();

  const query = (weapon: CreateWeaponDto) => client(endpoint, weapon);

  const mutationResult = useMutation(query, {
    onMutate: async (weapon) => {
      await queryClient.cancelQueries(QUERY_KEYS.weapons);

      const previousWeapons =
        queryClient.getQueryData<Weapon[]>(QUERY_KEYS.weapons) ?? [];

      const weaponTraits = weapon.traits.map(({ id, modifier }) => {
        const trait = traits.find((t) => t.id === id) ?? loadingTrait;
        return { ...trait, modifier };
      });

      queryClient.setQueryData<Weapon[]>(QUERY_KEYS.weapons, (old) => {
        const oldWeapons = old ?? [];
        const newWeapon = {
          ...weapon,
          traits: weaponTraits,
          id: createTempId(),
          loading: true,
        };
        return [...oldWeapons, newWeapon].sort(sortByField("name"));
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

  const postWeapon = mutationResult.mutate;

  return { ...mutationResult, postWeapon };
}

export function useDeleteWeapon(id: Weapon["id"]) {
  const client = useAuthClient();
  const queryClient = useQueryClient();

  const query = () =>
    client(`${endpoint}/${id}`, null, {
      method: "DELETE",
    });

  const mutationResult = useMutation(query, {
    onMutate: async () => {
      await queryClient.cancelQueries(QUERY_KEYS.weapons);

      const previousWeapons =
        queryClient.getQueryData<Weapon[]>(QUERY_KEYS.weapons) ?? [];

      queryClient.setQueryData<Weapon[]>(QUERY_KEYS.weapons, (old) =>
        old ? old.filter((fp) => fp.id !== id) : []
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
    onSuccess: () => queryClient.invalidateQueries(QUERY_KEYS.weapons),
  });

  const deleteWeapon = mutationResult.mutate;

  return { ...mutationResult, deleteWeapon };
}
