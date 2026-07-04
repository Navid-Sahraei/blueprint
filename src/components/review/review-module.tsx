"use client";

import { useState } from "react";

import { ReflectionForm } from "@/components/review/reflection-form";
import { SnapshotView } from "@/components/review/snapshot-view";
import { Button } from "@/components/ui/button";
import { currentQuarter } from "@/lib/dates";
import { buildSummarySnapshot } from "@/lib/review/snapshot";
import { parseReflection } from "@/lib/review/types";
import type { PeriodType, SummarySnapshot } from "@/lib/review/types";
import { useReview } from "@/lib/review/use-review";
import { cn } from "@/lib/utils";

export function ReviewModule() {
  const { ready, reviews, findReview, saveReview } = useReview();
  const [periodType, setPeriodType] = useState<PeriodType>("quarterly");
  const [draftSnapshot, setDraftSnapshot] = useState<SummarySnapshot | null>(
    null,
  );

  const periodLabel =
    periodType === "quarterly"
      ? currentQuarter()
      : String(new Date().getFullYear());
  const existing = findReview(periodType, periodLabel);
  const history = reviews.filter(
    (r) => !(r.period_type === periodType && r.period_label === periodLabel),
  );

  return (
    <div className="space-y-10">
      <header>
        <p className="label-technical mb-2">Layer 05 · Learning Loop</p>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="font-mono text-3xl font-semibold text-primary">
            Annual / Quarterly Review
          </h1>
          <p className="measure text-xs text-dimension">
            SAVED IN THIS BROWSER
          </p>
        </div>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Close the loop. Structured reflection after a task measurably
          improves subsequent performance in both field and lab settings
          (Di Stefano, Gino, Pisano &amp; Staats, 2016) — the mechanism
          behind Kolb&rsquo;s experiential learning cycle (1984): experience,
          reflect, conceptualize, try again.
        </p>
      </header>

      {!ready ? (
        <p className="measure text-xs text-dimension">LOADING…</p>
      ) : (
        <>
          <div className="flex gap-2">
            {(["quarterly", "annual"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setPeriodType(t);
                  setDraftSnapshot(null);
                }}
                className={cn(
                  "border px-4 py-2 font-mono text-xs uppercase tracking-wide transition-colors",
                  t === periodType
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:border-primary",
                )}
              >
                {t}
              </button>
            ))}
          </div>

          <section className="corner-marks border border-border bg-card p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="label-technical">
                {periodType === "quarterly" ? "Quarter" : "Year"} ·{" "}
                {periodLabel}
              </p>
              {existing && <p className="measure text-xs text-accent">SAVED</p>}
            </div>

            {existing ? (
              <>
                <div className="mt-4">
                  <SnapshotView snapshot={existing.summary_snapshot} />
                </div>
                <div className="mt-6 border-t border-border pt-6">
                  <h3 className="label-technical mb-3">Reflection</h3>
                  <ReflectionForm
                    initial={parseReflection(existing.reflection_text)}
                    onSave={(answers) =>
                      saveReview(
                        periodType,
                        periodLabel,
                        existing.summary_snapshot,
                        answers,
                      )
                    }
                  />
                </div>
              </>
            ) : draftSnapshot ? (
              <>
                <div className="mt-4">
                  <SnapshotView snapshot={draftSnapshot} />
                </div>
                <div className="mt-6 border-t border-border pt-6">
                  <h3 className="label-technical mb-3">
                    Guided reflection
                  </h3>
                  <ReflectionForm
                    onSave={(answers) => {
                      saveReview(periodType, periodLabel, draftSnapshot, answers);
                      setDraftSnapshot(null);
                    }}
                  />
                </div>
              </>
            ) : (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  Pull a snapshot from every module you&rsquo;re running,
                  then write the reflection.
                </p>
                <Button
                  className="mt-4"
                  onClick={() =>
                    setDraftSnapshot(
                      buildSummarySnapshot(periodType, periodLabel),
                    )
                  }
                >
                  Generate {periodType} review
                </Button>
              </div>
            )}
          </section>

          {history.length > 0 && (
            <section>
              <h2 className="label-technical">Past reviews · {history.length}</h2>
              <ul className="mt-4 space-y-3">
                {history.map((r) => (
                  <li
                    key={r.id}
                    className="border border-border bg-card p-4"
                  >
                    <p className="measure text-xs text-dimension">
                      {r.period_type.toUpperCase()} · {r.period_label}
                    </p>
                    <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">
                      {r.reflection_text}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <footer className="border-t border-border pt-6">
            <p className="max-w-2xl text-sm text-muted-foreground">
              The snapshot freezes at generation time — it won&rsquo;t change
              if you edit other modules later, so a review stays an honest
              record of that moment.
            </p>
          </footer>
        </>
      )}
    </div>
  );
}
