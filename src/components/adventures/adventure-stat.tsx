"use client";

import { useSyncExternalStore } from "react";

import { daysUntil } from "@/lib/dates";
import { getServerSnapshot } from "@/lib/local-store";
import { getAdventures, subscribeAdventures } from "@/lib/adventures/store";
import { YEARLY_TARGET } from "@/lib/adventures/types";

/** Live one-line stat for the dashboard's Adventure Ledger card. */
export function AdventureStat() {
  const adventures = useSyncExternalStore(
    subscribeAdventures,
    getAdventures,
    getServerSnapshot,
  );

  let text = "…";
  if (adventures !== null) {
    const upcoming = adventures
      .filter(
        (a) =>
          (a.status === "scheduled" || a.status === "booked") &&
          a.target_date,
      )
      .sort((a, b) => a.target_date!.localeCompare(b.target_date!))[0];

    const doneCount = adventures.filter((a) => a.status === "done").length;

    if (upcoming) {
      const days = daysUntil(upcoming.target_date!);
      text = `NEXT · ${upcoming.title.toUpperCase()} · D-${days}`;
    } else if (adventures.length === 0) {
      text = "NO ADVENTURES YET";
    } else {
      text = `${doneCount} / ${YEARLY_TARGET} DONE THIS YEAR`;
    }
  }

  return (
    <span className="measure truncate text-xs text-dimension">{text}</span>
  );
}
