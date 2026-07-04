"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SortDraft } from "@/lib/values/types";

export function DefineStage({
  draft,
  onChange,
  onSave,
}: {
  draft: SortDraft;
  onChange: (next: SortDraft) => void;
  onSave: () => void;
}) {
  const allFilled = draft.ranked.every((name) =>
    (draft.definitions[name] ?? "").trim(),
  );

  return (
    <section className="corner-marks border border-border bg-card p-6">
      <p className="label-technical">One sentence each</p>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">
        For each value: how should it show up this year, concretely? A value
        without a sentence is a mood.
      </p>

      <form
        className="mt-6 space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (allFilled) onSave();
        }}
      >
        {draft.ranked.map((name, i) => (
          <div key={name} className="space-y-1.5">
            <Label htmlFor={`def-${name}`}>
              <span className="measure mr-2 text-dimension">
                {String(i + 1).padStart(2, "0")}
              </span>
              {name}
            </Label>
            <Input
              id={`def-${name}`}
              placeholder={`This year, ${name.toLowerCase()} looks like…`}
              value={draft.definitions[name] ?? ""}
              onChange={(e) =>
                onChange({
                  ...draft,
                  definitions: {
                    ...draft.definitions,
                    [name]: e.target.value,
                  },
                })
              }
            />
          </div>
        ))}

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={!allFilled}>
            Save compass
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => onChange({ ...draft, stage: 2 })}
          >
            Back to ranking
          </Button>
        </div>
      </form>
    </section>
  );
}
