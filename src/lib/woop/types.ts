/**
 * WOOP data shapes. `WoopEntry` mirrors the `woop_entries` table in
 * supabase/migrations/0001_init.sql. `WoopDraft` is UI state for a wizard
 * in progress — local only.
 */

export interface WoopEntry {
  id: string;
  linked_key_result_id: string | null;
  wish: string;
  outcome: string;
  obstacle: string;
  if_then_plan: string;
  created_at: string;
  updated_at: string;
}

export interface WoopDraft {
  step: 1 | 2 | 3 | 4;
  linked_key_result_id: string | null;
  wish: string;
  outcome: string;
  obstacle: string;
  if_condition: string;
  then_action: string;
}

export function freshWoopDraft(): WoopDraft {
  return {
    step: 1,
    linked_key_result_id: null,
    wish: "",
    outcome: "",
    obstacle: "",
    if_condition: "",
    then_action: "",
  };
}

/** "If it’s 6:30 and the alarm rings, then I will put on the shoes." */
export function composePlan(draft: WoopDraft): string {
  const cond = draft.if_condition.trim().replace(/[.。]+$/, "");
  const action = draft.then_action.trim().replace(/[.。]+$/, "");
  return `If ${cond}, then I will ${action}.`;
}
