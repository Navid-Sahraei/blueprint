"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { composePlan, type WoopDraft } from "@/lib/woop/types";

const STEP_NAMES = ["WISH", "OUTCOME", "OBSTACLE", "PLAN"] as const;

export interface KrOption {
  id: string;
  label: string;
}

function stepComplete(draft: WoopDraft): boolean {
  switch (draft.step) {
    case 1:
      return draft.wish.trim().length > 0;
    case 2:
      return draft.outcome.trim().length > 0;
    case 3:
      return draft.obstacle.trim().length > 0;
    case 4:
      return (
        draft.if_condition.trim().length > 0 &&
        draft.then_action.trim().length > 0
      );
  }
}

export function WoopWizard({
  draft,
  krOptions,
  onChange,
  onCancel,
  onSave,
}: {
  draft: WoopDraft;
  krOptions: KrOption[];
  onChange: (next: WoopDraft) => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  const canContinue = stepComplete(draft);

  function next() {
    if (!canContinue) return;
    if (draft.step === 4) onSave();
    else onChange({ ...draft, step: (draft.step + 1) as WoopDraft["step"] });
  }

  return (
    <section className="corner-marks border border-border bg-card p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="label-technical">New plan</p>
        <p className="measure text-xs text-dimension">
          STEP {draft.step} / 4 · {STEP_NAMES[draft.step - 1]}
        </p>
      </div>

      <form
        className="mt-5 space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          next();
        }}
      >
        {draft.step === 1 && (
          <>
            <div className="space-y-1.5">
              <Label htmlFor="woop-wish">Your wish</Label>
              <Input
                id="woop-wish"
                autoFocus
                placeholder="Run the first 10k of my life"
                value={draft.wish}
                onChange={(e) => onChange({ ...draft, wish: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Challenging but feasible, in your own words. This quarter’s
                horizon works well.
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="woop-link">
                Link to a key result{" "}
                <span className="text-muted-foreground">(optional)</span>
              </Label>
              <select
                id="woop-link"
                value={draft.linked_key_result_id ?? ""}
                onChange={(e) =>
                  onChange({
                    ...draft,
                    linked_key_result_id: e.target.value || null,
                  })
                }
                className="flex h-10 w-full rounded-sm border border-input bg-paper-raised px-3 py-2 text-sm"
              >
                <option value="">— standalone —</option>
                {krOptions.map((kr) => (
                  <option key={kr.id} value={kr.id}>
                    {kr.label}
                  </option>
                ))}
              </select>
              {krOptions.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  No key results yet — WOOP works standalone too.
                </p>
              )}
            </div>
          </>
        )}

        {draft.step === 2 && (
          <div className="space-y-1.5">
            <Label htmlFor="woop-outcome">The best outcome</Label>
            <Textarea
              id="woop-outcome"
              autoFocus
              placeholder="Crossing the line knowing I rebuilt my base from nothing"
              value={draft.outcome}
              onChange={(e) => onChange({ ...draft, outcome: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              If the wish came true — what’s the single best thing about it?
              Take a moment and actually picture it before writing.
            </p>
          </div>
        )}

        {draft.step === 3 && (
          <div className="space-y-1.5">
            <Label htmlFor="woop-obstacle">The obstacle — in you</Label>
            <Textarea
              id="woop-obstacle"
              autoFocus
              placeholder="I open the phone in bed and the morning evaporates"
              value={draft.obstacle}
              onChange={(e) =>
                onChange({ ...draft, obstacle: e.target.value })
              }
            />
            <p className="text-xs text-muted-foreground">
              An emotion, a habit, a belief — not other people, not the
              weather. Finding the inner obstacle is the step that makes this
              method work (Oettingen, 2012).
            </p>
          </div>
        )}

        {draft.step === 4 && (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="woop-if">If…</Label>
                <Input
                  id="woop-if"
                  autoFocus
                  placeholder="it’s 6:30 and the alarm rings"
                  value={draft.if_condition}
                  onChange={(e) =>
                    onChange({ ...draft, if_condition: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="woop-then">…then I will</Label>
                <Input
                  id="woop-then"
                  placeholder="put on the running shoes before opening any app"
                  value={draft.then_action}
                  onChange={(e) =>
                    onChange({ ...draft, then_action: e.target.value })
                  }
                />
              </div>
            </div>
            {canContinue && (
              <div className="border-l-2 border-accent bg-secondary/50 p-3">
                <p className="text-sm font-medium">{composePlan(draft)}</p>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              This is the same technique as Habit Foundry’s if-then field —
              the repetition is deliberate. Implementation intentions carry a
              medium-to-large effect across 94 studies, d ≈ 0.65 (Gollwitzer
              &amp; Sheeran, 2006).
            </p>
          </>
        )}

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={!canContinue}>
            {draft.step === 4 ? "Save plan" : "Next"}
          </Button>
          {draft.step > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                onChange({
                  ...draft,
                  step: (draft.step - 1) as WoopDraft["step"],
                })
              }
            >
              Back
            </Button>
          )}
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </section>
  );
}
