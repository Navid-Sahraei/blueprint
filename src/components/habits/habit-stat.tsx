"use client";

import { useSyncExternalStore } from "react";

import { daysBetween } from "@/lib/dates";
import {
  getHabits,
  getServerSnapshot,
  subscribeHabits,
} from "@/lib/habits/store";

/** Live one-line stat for the dashboard's Habit Foundry card. */
export function HabitFoundryStat() {
  const habits = useSyncExternalStore(
    subscribeHabits,
    getHabits,
    getServerSnapshot,
  );

  let text = "…";
  if (habits !== null) {
    const active = habits.find((h) => h.status === "installing");
    if (active) {
      const day = active.start_date ? daysBetween(active.start_date) + 1 : 1;
      text = `${active.title.toUpperCase()} · DAY ${day}`;
    } else {
      const backlog = habits.filter((h) => h.status === "backlog").length;
      text =
        backlog > 0
          ? `${backlog} IN BACKLOG · NONE INSTALLING`
          : "NO HABIT YET";
    }
  }

  return (
    <span className="measure truncate text-xs text-dimension">{text}</span>
  );
}
