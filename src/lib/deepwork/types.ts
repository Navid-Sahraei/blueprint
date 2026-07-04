/**
 * Deep Work data shapes. Mirrors the `deep_work_sessions` table in
 * supabase/migrations/0001_init.sql. planned_duration/actual_duration are
 * minutes; actual_duration and focus_rating are null until the block is
 * completed.
 */

export interface DeepWorkSession {
  id: string;
  date: string; // ISO date
  planned_duration: number; // minutes
  actual_duration: number | null; // minutes
  task_description: string;
  focus_rating: number | null; // 1–5
  created_at: string;
  updated_at: string;
}

export const PLANNED_DURATIONS = [25, 50, 90] as const;

export function isCompleted(s: DeepWorkSession): boolean {
  return s.actual_duration !== null;
}
