"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SortDraft } from "@/lib/values/types";
import { pileNames, VALUES_MAX, VALUES_MIN } from "@/lib/values/types";
import { cn } from "@/lib/utils";

function Chip({
  name,
  disabled,
  onClick,
}: {
  name: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "border border-border bg-background px-3 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors",
        disabled
          ? "cursor-not-allowed opacity-40"
          : "hover:border-primary hover:text-primary",
      )}
    >
      {name}
    </button>
  );
}

export function RankStage({
  draft,
  onChange,
}: {
  draft: SortDraft;
  onChange: (next: SortDraft) => void;
}) {
  const [custom, setCustom] = useState("");
  const core = pileNames(draft, "core").filter(
    (n) => !draft.ranked.includes(n),
  );

  function addCustom(e: React.FormEvent) {
    e.preventDefault();
    const name = custom.trim();
    if (!name) return;
    const exists = draft.history.some(
      (h) => h.name.toLowerCase() === name.toLowerCase(),
    );
    if (!exists) {
      onChange({
        ...draft,
        history: [...draft.history, { name, pile: "core" }],
      });
    }
    setCustom("");
  }
  const matters = pileNames(draft, "matters").filter(
    (n) => !draft.ranked.includes(n),
  );
  const full = draft.ranked.length >= VALUES_MAX;

  function add(name: string) {
    if (full) return;
    onChange({ ...draft, ranked: [...draft.ranked, name] });
  }

  function remove(name: string) {
    onChange({ ...draft, ranked: draft.ranked.filter((n) => n !== name) });
  }

  function move(name: string, delta: -1 | 1) {
    const i = draft.ranked.indexOf(name);
    const j = i + delta;
    if (i < 0 || j < 0 || j >= draft.ranked.length) return;
    const ranked = [...draft.ranked];
    [ranked[i], ranked[j]] = [ranked[j], ranked[i]];
    onChange({ ...draft, ranked });
  }

  return (
    <section className="corner-marks border border-border bg-card p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="label-technical">Choose and rank</p>
        <p className="measure text-xs text-dimension">
          {draft.ranked.length} / {VALUES_MAX} CHOSEN · MIN {VALUES_MIN}
        </p>
      </div>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">
        Pick three to five, heaviest first. Fewer than three won’t steer;
        more than five stops being a compass.
      </p>

      {/* Ranked list */}
      <ol className="mt-6 space-y-2">
        {draft.ranked.map((name, i) => (
          <li
            key={name}
            className="flex items-center gap-3 border border-border bg-background px-4 py-2.5"
          >
            <span className="measure w-7 text-sm text-dimension">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="flex-1 font-mono text-sm font-semibold uppercase tracking-wide text-primary">
              {name}
            </span>
            <Button
              size="sm"
              variant="ghost"
              aria-label={`Move ${name} up`}
              disabled={i === 0}
              onClick={() => move(name, -1)}
            >
              ↑
            </Button>
            <Button
              size="sm"
              variant="ghost"
              aria-label={`Move ${name} down`}
              disabled={i === draft.ranked.length - 1}
              onClick={() => move(name, 1)}
            >
              ↓
            </Button>
            <Button
              size="sm"
              variant="ghost"
              aria-label={`Remove ${name}`}
              onClick={() => remove(name)}
            >
              ×
            </Button>
          </li>
        ))}
        {draft.ranked.length === 0 && (
          <li className="measure border border-dashed border-border px-4 py-6 text-center text-xs text-dimension">
            NOTHING CHOSEN YET — PICK FROM THE PILES BELOW
          </li>
        )}
      </ol>
      {full && (
        <p className="mt-2 text-xs text-muted-foreground">
          Five is the ceiling — the compass stays legible.
        </p>
      )}

      {/* Pools */}
      <div className="mt-8">
        <h3 className="label-technical">Kept close · {core.length}</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {core.map((name) => (
            <Chip
              key={name}
              name={name}
              disabled={full}
              onClick={() => add(name)}
            />
          ))}
          {core.length === 0 && (
            <p className="measure text-xs text-dimension">EMPTY</p>
          )}
        </div>
      </div>
      {matters.length > 0 && (
        <div className="mt-6">
          <h3 className="label-technical">Also marked matters · {matters.length}</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {matters.map((name) => (
              <Chip
                key={name}
                name={name}
                disabled={full}
                onClick={() => add(name)}
              />
            ))}
          </div>
        </div>
      )}

      {/* The deck is 36 cards, not the universe of values. */}
      <form onSubmit={addCustom} className="mt-6 flex max-w-sm gap-2">
        <Input
          aria-label="Add your own value"
          placeholder="A value the deck missed"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          className="h-8 text-sm"
        />
        <Button type="submit" size="sm" variant="outline">
          Add your own
        </Button>
      </form>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button
          disabled={draft.ranked.length < VALUES_MIN}
          onClick={() => onChange({ ...draft, stage: 3 })}
        >
          Continue — write the definitions
        </Button>
        <Button
          variant="ghost"
          onClick={() => onChange({ ...draft, stage: 1 })}
        >
          Back to sorting
        </Button>
      </div>
    </section>
  );
}
