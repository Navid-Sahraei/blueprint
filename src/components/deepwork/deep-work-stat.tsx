"use client";

import { useSyncExternalStore } from "react";

import { mondayOfWeek, weekDates } from "@/lib/dates";
import { getSessions, subscribeSessions } from "@/lib/deepwork/store";
import { getServerSnapshot } from "@/lib/local-store";

/** Live one-line stat for the dashboard's Deep Work card. */
export function DeepWorkStat() {
  const sessions = useSyncExternalStore(
    subscribeSessions,
    getSessions,
    getServerSnapshot,
  );

  let text = "…";
  if (sessions !== null) {
    if (sessions.length === 0) {
      text = "NO BLOCKS YET";
    } else {
      const days = weekDates(mondayOfWeek());
      const minutes = sessions
        .filter((s) => days.includes(s.date) && s.actual_duration !== null)
        .reduce((sum, s) => sum + (s.actual_duration ?? 0), 0);
      text = `${(minutes / 60).toFixed(1)} HRS THIS WEEK`;
    }
  }

  return (
    <span className="measure truncate text-xs text-dimension">{text}</span>
  );
}
