/**
 * Misogi OS data shapes. Rows mirror the misogi_candidates,
 * misogi_training_log, and misogi_debrief tables in 0001_init.sql.
 */

export type MisogiStatus =
  | "candidate"
  | "selected"
  | "training"
  | "done"
  | "failed_worth_it"
  | "dropped";

export type DebriefOutcome = "completed" | "failed_worth_it" | "abandoned";

export interface MisogiCandidate {
  id: string;
  title: string;
  category: string;
  fear_score: number; // 1–10
  pull_score: number; // 1–10
  fifty_percent_check: boolean;
  status: MisogiStatus;
  event_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface TrainingSession {
  id: string;
  misogi_id: string;
  session_date: string;
  type: string;
  effort_score: number; // 1–10
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface MisogiDebrief {
  id: string;
  misogi_id: string;
  outcome: DebriefOutcome;
  what_happened: string;
  what_it_changed: string;
  next_year_seed: string;
  created_at: string;
  updated_at: string;
}

export const CATEGORIES = [
  "Endurance",
  "Physical",
  "Wilderness",
  "Mental",
  "Skill",
  "Creative",
  "Other",
] as const;

/** An active misogi is one committed to and being trained for. */
export function isActive(c: MisogiCandidate): boolean {
  return c.status === "selected" || c.status === "training";
}

export function isFinished(c: MisogiCandidate): boolean {
  return c.status === "done" || c.status === "failed_worth_it";
}
