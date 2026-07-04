"use client";

import { useSyncExternalStore } from "react";

import { currentQuarter } from "@/lib/dates";
import { getServerSnapshot } from "@/lib/local-store";
import {
  getKeyResults,
  getObjectives,
  subscribeKeyResults,
  subscribeObjectives,
} from "@/lib/okrs/store";
import { objectiveProgress } from "@/lib/okrs/types";

/** Live one-line stat for the dashboard's OKR card. */
export function OkrStat() {
  const objectives = useSyncExternalStore(
    subscribeObjectives,
    getObjectives,
    getServerSnapshot,
  );
  const keyResults = useSyncExternalStore(
    subscribeKeyResults,
    getKeyResults,
    getServerSnapshot,
  );

  let text = "…";
  if (objectives !== null && keyResults !== null) {
    const quarter = currentQuarter();
    const objective = objectives.find((o) => o.quarter === quarter);
    if (!objective) {
      text = `${quarter} · NO OBJECTIVE`;
    } else {
      const krs = keyResults.filter(
        (kr) => kr.objective_id === objective.id,
      );
      text = `${quarter} · ${Math.round(objectiveProgress(krs) * 100)}%`;
    }
  }

  return (
    <span className="measure truncate text-xs text-dimension">{text}</span>
  );
}
