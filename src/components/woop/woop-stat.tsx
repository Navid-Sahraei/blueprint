"use client";

import { useSyncExternalStore } from "react";

import { getServerSnapshot } from "@/lib/local-store";
import { getEntries, subscribeEntries } from "@/lib/woop/store";

/** Live one-line stat for the dashboard's WOOP card. */
export function WoopStat() {
  const entries = useSyncExternalStore(
    subscribeEntries,
    getEntries,
    getServerSnapshot,
  );

  let text = "…";
  if (entries !== null) {
    if (entries.length === 0) {
      text = "NO PLANS YET";
    } else {
      const linked = entries.filter(
        (e) => e.linked_key_result_id !== null,
      ).length;
      text = `${entries.length} PLAN${entries.length === 1 ? "" : "S"} · ${linked} LINKED`;
    }
  }

  return (
    <span className="measure truncate text-xs text-dimension">{text}</span>
  );
}
