"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

import { getServerSnapshot } from "@/lib/local-store";
import {
  getCandidates,
  getDebriefs,
  getTraining,
  replaceCandidates,
  replaceDebriefs,
  replaceTraining,
  subscribeCandidates,
  subscribeDebriefs,
  subscribeTraining,
} from "./store";
import {
  isActive,
  type DebriefOutcome,
  type MisogiCandidate,
  type TrainingSession,
} from "./types";

function patchCandidate(id: string, patch: Partial<MisogiCandidate>): void {
  replaceCandidates(
    getCandidates().map((c) =>
      c.id === id
        ? { ...c, ...patch, updated_at: new Date().toISOString() }
        : c,
    ),
  );
}

export function useMisogi() {
  const candidatesSnap = useSyncExternalStore(
    subscribeCandidates,
    getCandidates,
    getServerSnapshot,
  );
  const trainingSnap = useSyncExternalStore(
    subscribeTraining,
    getTraining,
    getServerSnapshot,
  );
  const debriefsSnap = useSyncExternalStore(
    subscribeDebriefs,
    getDebriefs,
    getServerSnapshot,
  );

  const ready =
    candidatesSnap !== null && trainingSnap !== null && debriefsSnap !== null;
  const candidates = useMemo(() => candidatesSnap ?? [], [candidatesSnap]);
  const sessions = useMemo(() => trainingSnap ?? [], [trainingSnap]);
  const debriefs = useMemo(() => debriefsSnap ?? [], [debriefsSnap]);

  const addCandidate = useCallback(
    (fields: {
      title: string;
      category: string;
      fear_score: number;
      pull_score: number;
      fifty_percent_check: boolean;
    }) => {
      const now = new Date().toISOString();
      replaceCandidates([
        ...getCandidates(),
        {
          ...fields,
          id: crypto.randomUUID(),
          status: "candidate",
          event_date: null,
          created_at: now,
          updated_at: now,
        },
      ]);
    },
    [],
  );

  const removeCandidate = useCallback((id: string) => {
    replaceCandidates(getCandidates().filter((c) => c.id !== id));
    replaceTraining(getTraining().filter((s) => s.misogi_id !== id));
    replaceDebriefs(getDebriefs().filter((d) => d.misogi_id !== id));
  }, []);

  /** One committed misogi at a time. Returns an error to show, or null. */
  const commit = useCallback((id: string, eventDate: string): string | null => {
    if (getCandidates().some(isActive)) {
      return "One misogi per year — debrief or stand down the current one first.";
    }
    patchCandidate(id, { status: "training", event_date: eventDate });
    return null;
  }, []);

  /** Return an active misogi to the vault; its training log is kept. */
  const standDown = useCallback((id: string) => {
    patchCandidate(id, { status: "candidate", event_date: null });
  }, []);

  const addSession = useCallback(
    (
      misogiId: string,
      fields: Pick<
        TrainingSession,
        "session_date" | "type" | "effort_score" | "notes"
      >,
    ) => {
      const now = new Date().toISOString();
      replaceTraining([
        ...getTraining(),
        {
          ...fields,
          id: crypto.randomUUID(),
          misogi_id: misogiId,
          created_at: now,
          updated_at: now,
        },
      ]);
    },
    [],
  );

  const saveDebrief = useCallback(
    (
      misogiId: string,
      outcome: DebriefOutcome,
      fields: {
        what_happened: string;
        what_it_changed: string;
        next_year_seed: string;
      },
    ) => {
      const now = new Date().toISOString();
      replaceDebriefs([
        ...getDebriefs().filter((d) => d.misogi_id !== misogiId),
        {
          ...fields,
          id: crypto.randomUUID(),
          misogi_id: misogiId,
          outcome,
          created_at: now,
          updated_at: now,
        },
      ]);
      patchCandidate(misogiId, {
        status:
          outcome === "completed"
            ? "done"
            : outcome === "failed_worth_it"
              ? "failed_worth_it"
              : "dropped",
      });
    },
    [],
  );

  const active = useMemo(
    () => candidates.find(isActive) ?? null,
    [candidates],
  );

  return {
    ready,
    candidates,
    sessions,
    debriefs,
    active,
    addCandidate,
    removeCandidate,
    commit,
    standDown,
    addSession,
    saveDebrief,
  };
}
