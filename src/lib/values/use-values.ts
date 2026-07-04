"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

import { getServerSnapshot } from "@/lib/local-store";
import {
  getDraft,
  getValues,
  replaceDraft,
  replaceValues,
  subscribeDraft,
  subscribeValues,
} from "./store";
import type { SortDraft } from "./types";

export function useValues() {
  const valuesSnap = useSyncExternalStore(
    subscribeValues,
    getValues,
    getServerSnapshot,
  );
  const draft = useSyncExternalStore(
    subscribeDraft,
    getDraft,
    getServerSnapshot,
  );

  const ready = valuesSnap !== null;
  const values = useMemo(
    () => [...(valuesSnap ?? [])].sort((a, b) => a.rank - b.rank),
    [valuesSnap],
  );

  const setDraft = useCallback((next: SortDraft | null) => {
    replaceDraft(next);
  }, []);

  /** Replace the whole compass with the ranked, defined values. */
  const saveCompass = useCallback(
    (entries: Array<{ value_name: string; personal_definition: string }>) => {
      const now = new Date().toISOString();
      replaceValues(
        entries.map((entry, i) => ({
          id: crypto.randomUUID(),
          value_name: entry.value_name,
          rank: i + 1,
          personal_definition: entry.personal_definition,
          created_at: now,
          updated_at: now,
        })),
      );
      replaceDraft(null);
    },
    [],
  );

  const updateDefinition = useCallback((id: string, text: string) => {
    replaceValues(
      getValues().map((v) =>
        v.id === id
          ? {
              ...v,
              personal_definition: text,
              updated_at: new Date().toISOString(),
            }
          : v,
      ),
    );
  }, []);

  /** Wipe the compass and any draft — used by "redo the sort". */
  const clearAll = useCallback(() => {
    replaceValues([]);
    replaceDraft(null);
  }, []);

  return {
    ready,
    values,
    draft,
    setDraft,
    saveCompass,
    updateDefinition,
    clearAll,
  };
}
