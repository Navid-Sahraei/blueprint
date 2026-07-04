"use client";

import { useSyncExternalStore } from "react";

import { mondayOfWeek } from "@/lib/dates";
import { getEntries, subscribeEntries } from "@/lib/gratitude/store";
import { getServerSnapshot } from "@/lib/local-store";

/** Live one-line stat for the dashboard's Gratitude card. */
export function GratitudeStat() {
  const entries = useSyncExternalStore(
    subscribeEntries,
    getEntries,
    getServerSnapshot,
  );

  let text = "…";
  if (entries !== null) {
    const week = mondayOfWeek();
    const done = entries.some((e) => e.week_of === week);
    text = done ? "THIS WEEK LOGGED" : "NOT LOGGED THIS WEEK";
  }

  return (
    <span className="measure truncate text-xs text-dimension">{text}</span>
  );
}
