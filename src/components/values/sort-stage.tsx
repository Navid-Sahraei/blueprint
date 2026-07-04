"use client";

import { Button } from "@/components/ui/button";
import { DECK } from "@/lib/values/deck";
import type { Pile, SortDraft } from "@/lib/values/types";
import { pileNames } from "@/lib/values/types";

export function SortStage({
  draft,
  onChange,
}: {
  draft: SortDraft;
  onChange: (next: SortDraft) => void;
}) {
  const index = draft.history.length;
  const card = index < DECK.length ? DECK[index] : null;
  const core = pileNames(draft, "core").length;
  const matters = pileNames(draft, "matters").length;
  const aside = pileNames(draft, "aside").length;

  function place(pile: Pile) {
    if (!card) return;
    const history = [...draft.history, { name: card.name, pile }];
    onChange({
      ...draft,
      history,
      stage: history.length === DECK.length ? 2 : 1,
    });
  }

  function undo() {
    if (draft.history.length === 0) return;
    onChange({ ...draft, stage: 1, history: draft.history.slice(0, -1) });
  }

  return (
    <section className="corner-marks border border-border bg-card p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="label-technical">Sort the deck</p>
        <p className="measure text-xs text-dimension">
          CARD {Math.min(index + 1, DECK.length)} / {DECK.length} · KEPT{" "}
          {core} · MATTERS {matters} · ASIDE {aside}
        </p>
      </div>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">
        One card at a time. Don’t deliberate — the first answer is usually the
        honest one.
      </p>

      {card ? (
        <div className="mx-auto mt-8 max-w-md">
          <div className="corner-marks border border-border bg-background px-6 py-10 text-center">
            <h2 className="font-mono text-2xl font-semibold uppercase tracking-wide text-primary">
              {card.name}
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">{card.gloss}</p>
          </div>
          <div className="mt-6 grid gap-2 sm:grid-cols-3">
            <Button onClick={() => place("core")}>Keep close</Button>
            <Button variant="outline" onClick={() => place("matters")}>
              Matters
            </Button>
            <Button variant="ghost" onClick={() => place("aside")}>
              Set aside
            </Button>
          </div>
        </div>
      ) : (
        <div className="mx-auto mt-8 max-w-md text-center">
          <p className="text-sm text-muted-foreground">
            All {DECK.length} cards sorted.
          </p>
          <Button
            className="mt-4"
            onClick={() => onChange({ ...draft, stage: 2 })}
          >
            Continue to ranking
          </Button>
        </div>
      )}

      {draft.history.length > 0 && (
        <div className="mt-6 text-center">
          <Button size="sm" variant="ghost" onClick={undo}>
            ↩ Undo last card
          </Button>
        </div>
      )}
    </section>
  );
}
