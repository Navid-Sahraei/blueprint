"use client";

import { useSyncExternalStore } from "react";

import { daysUntil } from "@/lib/dates";
import { getServerSnapshot } from "@/lib/local-store";
import { getCandidates, subscribeCandidates } from "@/lib/misogi/store";
import { isActive, isFinished } from "@/lib/misogi/types";

/** Live one-line stat for the dashboard's Misogi card. */
export function MisogiStat() {
  const candidates = useSyncExternalStore(
    subscribeCandidates,
    getCandidates,
    getServerSnapshot,
  );

  let text = "…";
  if (candidates !== null) {
    const active = candidates.find(isActive);
    if (active?.event_date) {
      const days = daysUntil(active.event_date);
      text =
        days >= 0
          ? `D-${days} · ${active.title.toUpperCase()}`
          : `PAST EVENT · DEBRIEF IT`;
    } else if (candidates.some(isFinished)) {
      text = "DONE — NEXT YEAR’S PICK?";
    } else {
      const vault = candidates.filter((c) => c.status === "candidate").length;
      text = vault > 0 ? `${vault} IN THE VAULT · NONE COMMITTED` : "NO MISOGI YET";
    }
  }

  return (
    <span className="measure truncate text-xs text-dimension">{text}</span>
  );
}
