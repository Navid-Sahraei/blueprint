"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

import { getServerSnapshot } from "@/lib/local-store";
import { getSessions, replaceSessions, subscribeSessions } from "./store";

export function useDeepWork() {
  const snap = useSyncExternalStore(
    subscribeSessions,
    getSessions,
    getServerSnapshot,
  );

  const ready = snap !== null;
  const sessions = useMemo(() => snap ?? [], [snap]);

  const addSession = useCallback(
    (fields: {
      date: string;
      start_time: string | null;
      task_description: string;
      planned_duration: number;
    }) => {
      const now = new Date().toISOString();
      replaceSessions([
        ...getSessions(),
        {
          ...fields,
          id: crypto.randomUUID(),
          actual_duration: null,
          focus_rating: null,
          created_at: now,
          updated_at: now,
        },
      ]);
    },
    [],
  );

  const completeSession = useCallback(
    (id: string, actual_duration: number, focus_rating: number) => {
      replaceSessions(
        getSessions().map((s) =>
          s.id === id
            ? {
                ...s,
                actual_duration,
                focus_rating,
                updated_at: new Date().toISOString(),
              }
            : s,
        ),
      );
    },
    [],
  );

  const removeSession = useCallback((id: string) => {
    replaceSessions(getSessions().filter((s) => s.id !== id));
  }, []);

  return { ready, sessions, addSession, completeSession, removeSession };
}
