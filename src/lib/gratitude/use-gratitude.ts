"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

import { getServerSnapshot } from "@/lib/local-store";
import { getEntries, replaceEntries, subscribeEntries } from "./store";

export function useGratitude() {
  const snap = useSyncExternalStore(
    subscribeEntries,
    getEntries,
    getServerSnapshot,
  );

  const ready = snap !== null;
  const entries = useMemo(
    () => [...(snap ?? [])].sort((a, b) => b.week_of.localeCompare(a.week_of)),
    [snap],
  );

  const upsertWeek = useCallback(
    (weekOf: string, fields: { entry_1: string; entry_2: string; entry_3: string }) => {
      const all = getEntries();
      const existing = all.find((e) => e.week_of === weekOf);
      const now = new Date().toISOString();
      if (existing) {
        replaceEntries(
          all.map((e) =>
            e.id === existing.id ? { ...e, ...fields, updated_at: now } : e,
          ),
        );
      } else {
        replaceEntries([
          ...all,
          { ...fields, id: crypto.randomUUID(), week_of: weekOf, created_at: now, updated_at: now },
        ]);
      }
    },
    [],
  );

  return { ready, entries, upsertWeek };
}
