/**
 * Values Compass data shapes. `ValueRow` mirrors the `values` table in
 * supabase/migrations/0001_init.sql. `SortDraft` is UI state for a sort in
 * progress — it stays local even once Supabase is connected.
 */

export interface ValueRow {
  id: string;
  value_name: string;
  rank: number; // 1-based
  personal_definition: string;
  created_at: string;
  updated_at: string;
}

export type Pile = "core" | "matters" | "aside";

export interface SortDraft {
  stage: 1 | 2 | 3;
  /** One entry per sorted card, in sort order; supports undo. */
  history: Array<{ name: string; pile: Pile }>;
  /** Stage 2 selection, in rank order. */
  ranked: string[];
  /** Stage 3 sentences, keyed by value name. */
  definitions: Record<string, string>;
}

export const VALUES_MIN = 3;
export const VALUES_MAX = 5;

export function freshDraft(): SortDraft {
  return { stage: 1, history: [], ranked: [], definitions: {} };
}

export function pileNames(draft: SortDraft, pile: Pile): string[] {
  return draft.history.filter((h) => h.pile === pile).map((h) => h.name);
}
