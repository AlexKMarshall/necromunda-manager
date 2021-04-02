import { useQuery, useMutation, useQueryClient } from "react-query";
import { QUERY_KEYS } from "../constants/query-keys";
import {
  CreateGangDto,
  gangSchema,
  Gang,
  loadingGang,
  CreateFighterDto,
  loadingFaction,
  loadingFighterPrototype,
} from "../schemas";
import { useReadFactions } from "./factions";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuthClient } from "./client";
import { createTempId } from "../utils";
import { useReadFighterPrototypes } from "./fighter-prototypes";
import { deepClone } from "../utils";

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

export function useReadGang(id: Gang["id"]) {
  const client = useAuthClient();

  const query = async () => {
    try {
      const data = await client(`gangs/${id}`);
      return gangSchema.parse(data);
    } catch (error) {
      return Promise.reject(error);
    }
  };
  const queryResult = useQuery([QUERY_KEYS.gangs, id], query);

  const gang = queryResult.data ?? loadingGang;

  return { ...queryResult, gang };
}

const initialCredits = 1000;
const initialGang = {
  stash: { credits: initialCredits },
  rating: 0,
  reputation: 1,
  wealth: initialCredits,
  fighters: [],
  territories: [],
};

export function useCreateGang() {
  const { user } = useAuth0();
  const client = useAuthClient();
  const queryClient = useQueryClient();
  const { factions } = useReadFactions();

  const query = (gang: CreateGangDto) => client("gangs", gang);

  const mutationResult = useMutation(query, {
    onMutate: async ({ name, factionId }) => {
      await queryClient.cancelQueries(QUERY_KEYS.gangs);

      const previousGangs =
        queryClient.getQueryData<Gang[]>(QUERY_KEYS.gangs) ?? [];

      const faction =
        factions.find((faction) => faction.id === factionId) ?? loadingFaction;

      queryClient.setQueryData<Gang[]>(QUERY_KEYS.gangs, (old) => {
        const oldGangs = old ?? [];
        const newGang = {
          ...initialGang,
          id: createTempId(),
          name,
          faction,
          userId: user.sub,
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

const initialFighter = {
  experience: 0,
  advancements: 0,
  recovery: false,
  lastingInjuries: "",
  capturedBy: "",
  weapons: [],
  skills: [],
};

export function useAddFighter(gangId: Gang["id"]) {
  const client = useAuthClient();
  const queryClient = useQueryClient();
  const { fighterPrototypes } = useReadFighterPrototypes();

  const query = (fighter: CreateFighterDto) =>
    client(`gangs/${gangId}/fighters`, fighter);

  const mutationResult = useMutation(query, {
    onMutate: async ({ name, fighterPrototypeId }) => {
      await queryClient.cancelQueries(QUERY_KEYS.gangs);

      const previousGang =
        queryClient.getQueryData<Gang>([QUERY_KEYS.gangs, gangId]) ??
        loadingGang;

      const fighterPrototype =
        fighterPrototypes.find((fp) => fp.id === fighterPrototypeId) ??
        loadingFighterPrototype;

      queryClient.setQueryData<Gang>([QUERY_KEYS.gangs, gangId], (old) => {
        const fighter = {
          ...initialFighter,
          id: createTempId(),
          name,
          fighterPrototype,
          cost: fighterPrototype.cost,
          fighterStats: { ...fighterPrototype.fighterStats },
        };

        const targetGang = deepClone(old ?? loadingGang);
        targetGang.fighters.push(fighter);
        targetGang.stash.credits -= fighter.cost;
        targetGang.reputation += fighter.cost;
        return targetGang;
      });
      return { previousGang };
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

  const addFighter = mutationResult.mutate;

  return { ...mutationResult, addFighter };
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
