"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

import { getServerSnapshot } from "@/lib/local-store";
import {
  getAdventures,
  replaceAdventures,
  subscribeAdventures,
} from "./store";
import type { Adventure, AdventureStatus, AdventureType } from "./types";

function patch(id: string, changes: Partial<Adventure>): void {
  replaceAdventures(
    getAdventures().map((a) =>
      a.id === id
        ? { ...a, ...changes, updated_at: new Date().toISOString() }
        : a,
    ),
  );
}

export function useAdventures() {
  const snap = useSyncExternalStore(
    subscribeAdventures,
    getAdventures,
    getServerSnapshot,
  );

  const ready = snap !== null;
  const adventures = useMemo(() => snap ?? [], [snap]);

  const addAdventure = useCallback(
    (fields: { title: string; type: AdventureType | null }) => {
      const now = new Date().toISOString();
      replaceAdventures([
        ...getAdventures(),
        {
          id: crypto.randomUUID(),
          title: fields.title,
          type: fields.type,
          status: "idea",
          target_date: null,
          budget: null,
          companions: "",
          best_moment: "",
          biggest_surprise: "",
          keepsake: "",
          created_at: now,
          updated_at: now,
        },
      ]);
    },
    [],
  );

  const updateAdventure = useCallback(
    (id: string, changes: Partial<Adventure>) => patch(id, changes),
    [],
  );

  const setStatus = useCallback((id: string, status: AdventureStatus) => {
    patch(id, { status });
  }, []);

  const removeAdventure = useCallback((id: string) => {
    replaceAdventures(getAdventures().filter((a) => a.id !== id));
  }, []);

  const saveDebrief = useCallback(
    (
      id: string,
      fields: {
        best_moment: string;
        biggest_surprise: string;
        keepsake: string;
      },
    ) => {
      patch(id, { ...fields, status: "done" });
    },
    [],
  );

  return {
    ready,
    adventures,
    addAdventure,
    updateAdventure,
    setStatus,
    removeAdventure,
    saveDebrief,
  };
}
