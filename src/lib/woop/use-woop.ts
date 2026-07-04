"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

import { getServerSnapshot } from "@/lib/local-store";
import {
  getDraft,
  getEntries,
  replaceDraft,
  replaceEntries,
  subscribeDraft,
  subscribeEntries,
} from "./store";
import { composePlan, type WoopDraft } from "./types";

export function useWoop() {
  const entriesSnap = useSyncExternalStore(
    subscribeEntries,
    getEntries,
    getServerSnapshot,
  );
  const draft = useSyncExternalStore(
    subscribeDraft,
    getDraft,
    getServerSnapshot,
  );

  const ready = entriesSnap !== null;
  const entries = useMemo(
    () =>
      [...(entriesSnap ?? [])].sort((a, b) =>
        b.created_at.localeCompare(a.created_at),
      ),
    [entriesSnap],
  );

  const setDraft = useCallback((next: WoopDraft | null) => {
    replaceDraft(next);
  }, []);

  const saveEntry = useCallback((finished: WoopDraft) => {
    const now = new Date().toISOString();
    replaceEntries([
      ...getEntries(),
      {
        id: crypto.randomUUID(),
        linked_key_result_id: finished.linked_key_result_id,
        wish: finished.wish.trim(),
        outcome: finished.outcome.trim(),
        obstacle: finished.obstacle.trim(),
        if_then_plan: composePlan(finished),
        created_at: now,
        updated_at: now,
      },
    ]);
    replaceDraft(null);
  }, []);

  const removeEntry = useCallback((id: string) => {
    replaceEntries(getEntries().filter((e) => e.id !== id));
  }, []);

  return { ready, entries, draft, setDraft, saveEntry, removeEntry };
}
