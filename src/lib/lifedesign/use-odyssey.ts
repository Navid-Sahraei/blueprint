"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

import { getServerSnapshot } from "@/lib/local-store";
import { getPlans, replacePlans, subscribePlans } from "./store";
import { emptyPlanText, type OdysseyPlanText } from "./types";

export function useOdyssey() {
  const snap = useSyncExternalStore(
    subscribePlans,
    getPlans,
    getServerSnapshot,
  );

  const ready = snap !== null;
  const plans = useMemo(() => snap ?? [], [snap]);

  const textFor = useCallback(
    (label: string): OdysseyPlanText =>
      plans.find((p) => p.plan_label === label)?.plan_text ?? emptyPlanText(),
    [plans],
  );

  /** Write-through canvas editing: upsert the row for a path on every change. */
  const updatePath = useCallback(
    (label: string, patch: Partial<OdysseyPlanText>) => {
      const all = getPlans();
      const existing = all.find((p) => p.plan_label === label);
      const now = new Date().toISOString();
      if (existing) {
        replacePlans(
          all.map((p) =>
            p.id === existing.id
              ? {
                  ...p,
                  plan_text: { ...p.plan_text, ...patch },
                  updated_at: now,
                }
              : p,
          ),
        );
      } else {
        replacePlans([
          ...all,
          {
            id: crypto.randomUUID(),
            plan_label: label,
            plan_text: { ...emptyPlanText(), ...patch },
            created_at: now,
            updated_at: now,
          },
        ]);
      }
    },
    [],
  );

  return { ready, plans, textFor, updatePath };
}
