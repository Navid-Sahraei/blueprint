"use client";

import { useSyncExternalStore } from "react";

import { getServerSnapshot } from "@/lib/local-store";
import { getSessions, getSkills, subscribeSessions, subscribeSkills } from "@/lib/practice/store";

/**
 * Live one-line stat for the dashboard's Practice card. Deliberately shows
 * the most recent focus, not a session count or hours total — see
 * practice-module.tsx for why no accumulated total appears anywhere.
 */
export function PracticeStat() {
  const skills = useSyncExternalStore(
    subscribeSkills,
    getSkills,
    getServerSnapshot,
  );
  const sessions = useSyncExternalStore(
    subscribeSessions,
    getSessions,
    getServerSnapshot,
  );

  let text = "…";
  if (skills !== null && sessions !== null) {
    const active = skills.find((s) => s.is_active);
    if (!active) {
      text = "NO SKILL YET";
    } else {
      const last = [...sessions]
        .filter((s) => s.skill_id === active.id)
        .sort((a, b) => b.date.localeCompare(a.date))[0];
      text = last
        ? `${active.skill_name.toUpperCase()} · LAST: ${last.sub_skill_focus.toUpperCase()}`
        : `${active.skill_name.toUpperCase()} · NO SESSIONS YET`;
    }
  }

  return (
    <span className="measure truncate text-xs text-dimension">{text}</span>
  );
}
