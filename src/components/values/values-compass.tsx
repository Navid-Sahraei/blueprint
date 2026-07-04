"use client";

import { useState } from "react";
import Link from "next/link";

import { ModuleHeader } from "@/components/module-header";
import { DefineStage } from "@/components/values/define-stage";
import { RankStage } from "@/components/values/rank-stage";
import { SortStage } from "@/components/values/sort-stage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { freshDraft } from "@/lib/values/types";
import { useValues } from "@/lib/values/use-values";

export function ValuesCompass() {
  const {
    ready,
    values,
    draft,
    setDraft,
    saveCompass,
    updateDefinition,
    clearAll,
  } = useValues();

  const [editing, setEditing] = useState(false);
  const [edits, setEdits] = useState<Record<string, string>>({});

  const hasCompass = values.length > 0;
  const activeDraft = draft ?? (hasCompass ? null : freshDraft());

  function handleSave() {
    if (!draft) return;
    saveCompass(
      draft.ranked.map((name) => ({
        value_name: name,
        personal_definition: (draft.definitions[name] ?? "").trim(),
      })),
    );
  }

  function startEditing() {
    setEdits(
      Object.fromEntries(values.map((v) => [v.id, v.personal_definition])),
    );
    setEditing(true);
  }

  function saveEdits() {
    for (const v of values) {
      const text = (edits[v.id] ?? "").trim();
      if (text && text !== v.personal_definition) {
        updateDefinition(v.id, text);
      }
    }
    setEditing(false);
  }

  function redoSort() {
    if (
      window.confirm(
        "Redo the sort? Your current compass and its definitions will be replaced.",
      )
    ) {
      clearAll();
      setDraft(freshDraft());
    }
  }

  return (
    <div className="space-y-10">
      <ModuleHeader
        layer="Layer 01 · Direction"
        title="Values Compass"
        meta="SAVED IN THIS BROWSER"
      >
        Three to five values, chosen before any goal. Values clarification
        is a core component of Acceptance and Commitment Therapy
        (meta-analysis: A-Tjak et al., 2015), and goals held for your own
        reasons sustain motivation better than goals imposed from outside
        (Ryan &amp; Deci, 2000). The sort takes about three minutes.
      </ModuleHeader>

      {!ready ? (
        <p className="measure text-xs text-dimension">LOADING…</p>
      ) : hasCompass && !draft ? (
        /* Saved compass */
        <section className="corner-marks border border-border bg-card p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="label-technical">Your compass</p>
            <p className="measure text-xs text-dimension">
              {values.length} VALUES · SET{" "}
              {values[0]?.created_at.slice(0, 10)}
            </p>
          </div>

          <ol className="mt-6 space-y-5">
            {values.map((v) => (
              <li key={v.id} className="flex gap-4">
                <span className="measure pt-0.5 text-sm text-dimension">
                  {String(v.rank).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-mono text-lg font-semibold uppercase tracking-wide text-primary">
                    {v.value_name}
                  </h2>
                  {editing ? (
                    <Input
                      aria-label={`Definition for ${v.value_name}`}
                      className="mt-1.5"
                      value={edits[v.id] ?? ""}
                      onChange={(e) =>
                        setEdits((prev) => ({
                          ...prev,
                          [v.id]: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    <p className="mt-1 text-sm text-muted-foreground">
                      “{v.personal_definition}”
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-8 flex flex-wrap gap-2">
            {editing ? (
              <>
                <Button size="sm" onClick={saveEdits}>
                  Save definitions
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" variant="outline" onClick={startEditing}>
                  Edit definitions
                </Button>
                <Button size="sm" variant="ghost" onClick={redoSort}>
                  Redo the sort
                </Button>
              </>
            )}
          </div>

          <p className="mt-8 border-t border-border pt-4 text-sm text-muted-foreground">
            Every goal you set this year should answer to at least one of
            these.{" "}
            <Link
              href="/app/goals"
              className="text-primary underline-offset-4 hover:underline"
            >
              Set the quarter’s objective →
            </Link>
          </p>
        </section>
      ) : activeDraft ? (
        <>
          {activeDraft.stage === 1 && (
            <SortStage draft={activeDraft} onChange={setDraft} />
          )}
          {activeDraft.stage === 2 && (
            <RankStage draft={activeDraft} onChange={setDraft} />
          )}
          {activeDraft.stage === 3 && (
            <DefineStage
              draft={activeDraft}
              onChange={setDraft}
              onSave={handleSave}
            />
          )}
        </>
      ) : null}

      <footer className="border-t border-border pt-6">
        <p className="max-w-2xl text-sm text-muted-foreground">
          The card sort is a structured exercise from ACT practice, not a
          psychometric test — there is no score. Its job is to give the rest
          of the system something to answer to. Daniel Pink’s Drive (2009)
          popularized this research for a general audience; Ryan &amp; Deci
          (2000) is the primary source.
        </p>
      </footer>
    </div>
  );
}
