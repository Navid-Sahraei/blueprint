"use client";

import { useSyncExternalStore } from "react";

import { WoopWizard, type KrOption } from "@/components/woop/woop-wizard";
import { Button } from "@/components/ui/button";
import { getServerSnapshot } from "@/lib/local-store";
import {
  getKeyResults,
  getObjectives,
  subscribeKeyResults,
  subscribeObjectives,
} from "@/lib/okrs/store";
import { freshWoopDraft } from "@/lib/woop/types";
import { useWoop } from "@/lib/woop/use-woop";

export function WoopModule() {
  const { ready, entries, draft, setDraft, saveEntry, removeEntry } =
    useWoop();

  const keyResults = useSyncExternalStore(
    subscribeKeyResults,
    getKeyResults,
    getServerSnapshot,
  );
  const objectives = useSyncExternalStore(
    subscribeObjectives,
    getObjectives,
    getServerSnapshot,
  );

  const quarterOf = new Map(
    (objectives ?? []).map((o) => [o.id, o.quarter]),
  );
  const krOptions: KrOption[] = (keyResults ?? []).map((kr) => ({
    id: kr.id,
    label: `${quarterOf.get(kr.objective_id) ?? "?"} · ${kr.kr_text}`,
  }));
  const krLabel = new Map(krOptions.map((kr) => [kr.id, kr.label]));

  return (
    <div className="space-y-10">
      <header>
        <p className="label-technical mb-2">Layer 03 · Execution</p>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="font-mono text-3xl font-semibold text-primary">
            WOOP / Mental Contrasting
          </h1>
          <p className="measure text-xs text-dimension">
            SAVED IN THIS BROWSER
          </p>
        </div>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Wish, Outcome, Obstacle, Plan. Mental contrasting with
          implementation intentions is among the most rigorously tested
          motivation techniques in the literature, with randomized trials
          across health, academic, and interpersonal domains (Oettingen,
          2012). Positive thinking alone is not the method — the obstacle is.
        </p>
      </header>

      {!ready ? (
        <p className="measure text-xs text-dimension">LOADING…</p>
      ) : (
        <>
          {draft ? (
            <WoopWizard
              draft={draft}
              krOptions={krOptions}
              onChange={setDraft}
              onCancel={() => setDraft(null)}
              onSave={() => saveEntry(draft)}
            />
          ) : (
            <section className="border border-dashed border-border p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="label-technical">
                    {entries.length === 0 ? "No plans yet" : "Run it again"}
                  </p>
                  <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                    {entries.length === 0
                      ? "Four steps, a few minutes. Works on any goal — or attach it to a key result from the Goals module."
                      : "One WOOP per wish. New quarter, new obstacles — run it as often as goals change."}
                  </p>
                </div>
                <Button onClick={() => setDraft(freshWoopDraft())}>
                  {entries.length === 0 ? "Start your first WOOP" : "New WOOP"}
                </Button>
              </div>
            </section>
          )}

          {entries.length > 0 && (
            <section>
              <h2 className="label-technical">
                Saved plans · {entries.length}
              </h2>
              <ul className="mt-4 grid gap-4 lg:grid-cols-2">
                {entries.map((entry) => (
                  <li
                    key={entry.id}
                    className="corner-marks flex flex-col border border-border bg-card p-5"
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-medium">{entry.wish}</h3>
                      <span className="measure shrink-0 text-xs text-dimension">
                        {entry.created_at.slice(0, 10)}
                      </span>
                    </div>
                    {entry.linked_key_result_id && (
                      <p className="measure mt-1 text-[10px] text-dimension">
                        LINKED ·{" "}
                        {(
                          krLabel.get(entry.linked_key_result_id) ??
                          "KEY RESULT REMOVED"
                        ).toUpperCase()}
                      </p>
                    )}
                    <div className="mt-3 flex-1 border-l-2 border-accent bg-secondary/50 p-3">
                      <p className="text-sm font-medium">
                        {entry.if_then_plan}
                      </p>
                    </div>
                    <details className="mt-3 text-sm text-muted-foreground">
                      <summary className="cursor-pointer select-none text-xs uppercase tracking-[0.14em] text-dimension">
                        Outcome &amp; obstacle
                      </summary>
                      <p className="mt-2">
                        <span className="font-medium text-foreground">
                          Outcome:
                        </span>{" "}
                        {entry.outcome}
                      </p>
                      <p className="mt-1">
                        <span className="font-medium text-foreground">
                          Obstacle:
                        </span>{" "}
                        {entry.obstacle}
                      </p>
                    </details>
                    <div className="mt-3 border-t border-border pt-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          if (
                            window.confirm(`Delete the plan for “${entry.wish}”?`)
                          ) {
                            removeEntry(entry.id);
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <footer className="border-t border-border pt-6">
            <p className="max-w-2xl text-sm text-muted-foreground">
              WOOP was developed by Gabriele Oettingen and summarized for a
              general audience in Rethinking Positive Thinking (2014). The
              plan step is an implementation intention (Gollwitzer, 1999) —
              the meta-analytic effect across 94 studies is d ≈ 0.65
              (Gollwitzer &amp; Sheeran, 2006), which is why the same if-then
              move appears in Habit Foundry.
            </p>
          </footer>
        </>
      )}
    </div>
  );
}
