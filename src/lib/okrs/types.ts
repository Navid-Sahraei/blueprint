/**
 * OKR data shapes. Field names mirror the `objectives` and `key_results`
 * tables in supabase/migrations/0001_init.sql for a one-to-one swap later.
 */

export interface Objective {
  id: string;
  quarter: string; // e.g. "2026-Q3"
  objective_text: string;
  created_at: string;
  updated_at: string;
}

export interface KeyResult {
  id: string;
  objective_id: string;
  kr_text: string;
  target_value: number;
  current_value: number;
  unit: string;
  created_at: string;
  updated_at: string;
}

/** Per the spec: one objective per quarter, two to four key results. */
export const KR_MAX = 4;

/** 0–1, clamped. Over-achievement shows in the numbers, not the bar. */
export function krProgress(kr: KeyResult): number {
  if (kr.target_value <= 0) return 0;
  return Math.max(0, Math.min(1, kr.current_value / kr.target_value));
}

/** Unweighted mean of key-result progress, 0–1. */
export function objectiveProgress(krs: KeyResult[]): number {
  if (krs.length === 0) return 0;
  return krs.reduce((sum, kr) => sum + krProgress(kr), 0) / krs.length;
}
