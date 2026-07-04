"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

import { getServerSnapshot } from "@/lib/local-store";
import {
  getKeyResults,
  getObjectives,
  replaceKeyResults,
  replaceObjectives,
  subscribeKeyResults,
  subscribeObjectives,
} from "./store";
import { KR_MAX, type KeyResult, type Objective } from "./types";

export function useOkrs() {
  const objectivesSnap = useSyncExternalStore(
    subscribeObjectives,
    getObjectives,
    getServerSnapshot,
  );
  const keyResultsSnap = useSyncExternalStore(
    subscribeKeyResults,
    getKeyResults,
    getServerSnapshot,
  );

  const ready = objectivesSnap !== null && keyResultsSnap !== null;
  const objectives = useMemo(() => objectivesSnap ?? [], [objectivesSnap]);
  const keyResults = useMemo(() => keyResultsSnap ?? [], [keyResultsSnap]);

  /** One objective per quarter. Returns an error to show, or null. */
  const createObjective = useCallback(
    (quarter: string, text: string): string | null => {
      const all = getObjectives();
      if (all.some((o) => o.quarter === quarter)) {
        return "This quarter already has an objective — one per quarter keeps it honest.";
      }
      const now = new Date().toISOString();
      replaceObjectives([
        ...all,
        {
          id: crypto.randomUUID(),
          quarter,
          objective_text: text,
          created_at: now,
          updated_at: now,
        },
      ]);
      return null;
    },
    [],
  );

  const updateObjective = useCallback((id: string, text: string) => {
    replaceObjectives(
      getObjectives().map((o) =>
        o.id === id
          ? { ...o, objective_text: text, updated_at: new Date().toISOString() }
          : o,
      ),
    );
  }, []);

  const removeObjective = useCallback((id: string) => {
    replaceObjectives(getObjectives().filter((o) => o.id !== id));
    replaceKeyResults(
      getKeyResults().filter((kr) => kr.objective_id !== id),
    );
  }, []);

  /** Capped at four per objective. Returns an error to show, or null. */
  const addKeyResult = useCallback(
    (
      objectiveId: string,
      fields: Pick<KeyResult, "kr_text" | "target_value" | "unit">,
    ): string | null => {
      const all = getKeyResults();
      if (all.filter((kr) => kr.objective_id === objectiveId).length >= KR_MAX) {
        return "Four key results is the ceiling — fewer, sharper measures beat a long list.";
      }
      const now = new Date().toISOString();
      replaceKeyResults([
        ...all,
        {
          ...fields,
          id: crypto.randomUUID(),
          objective_id: objectiveId,
          current_value: 0,
          created_at: now,
          updated_at: now,
        },
      ]);
      return null;
    },
    [],
  );

  const updateKeyResult = useCallback(
    (id: string, patch: Partial<KeyResult>) => {
      replaceKeyResults(
        getKeyResults().map((kr) =>
          kr.id === id
            ? { ...kr, ...patch, updated_at: new Date().toISOString() }
            : kr,
        ),
      );
    },
    [],
  );

  const removeKeyResult = useCallback((id: string) => {
    replaceKeyResults(getKeyResults().filter((kr) => kr.id !== id));
  }, []);

  const objectiveForQuarter = useCallback(
    (quarter: string): Objective | null =>
      objectives.find((o) => o.quarter === quarter) ?? null,
    [objectives],
  );

  const keyResultsFor = useCallback(
    (objectiveId: string): KeyResult[] =>
      keyResults
        .filter((kr) => kr.objective_id === objectiveId)
        .sort((a, b) => a.created_at.localeCompare(b.created_at)),
    [keyResults],
  );

  return {
    ready,
    objectives,
    keyResults,
    createObjective,
    updateObjective,
    removeObjective,
    addKeyResult,
    updateKeyResult,
    removeKeyResult,
    objectiveForQuarter,
    keyResultsFor,
  };
}
