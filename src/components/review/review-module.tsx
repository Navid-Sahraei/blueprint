"use client";

import { useState } from "react";
import Link from "next/link";

import { AddToCalendarButton } from "@/components/add-to-calendar";
import { ModuleHeader } from "@/components/module-header";
import { ReflectionForm } from "@/components/review/reflection-form";
import { SnapshotView } from "@/components/review/snapshot-view";
import { Button } from "@/components/ui/button";
import { currentQuarter, shiftQuarter, todayISO } from "@/lib/dates";
import { buildSummarySnapshot } from "@/lib/review/snapshot";
import { parseReflection } from "@/lib/review/types";
import type { PeriodType, SummarySnapshot } from "@/lib/review/types";
import { useReview } from "@/lib/review/use-review";
import { cn } from "@/lib/utils";

export function ReviewModule() {
  const { ready, reviews, findReview, saveReview } = useReview();
  const [periodType, setPeriodType] = useState<PeriodType>("quarterly");
  // 0 = the current period; negative reaches back — a quarter stays
  // reviewable after it ends, which is when reviews actually happen.
  const [offset, setOffset] = useState(0);
  const [draftSnapshot, setDraftSnapshot] = useState<SummarySnapshot | null>(
    null,
  );

  const periodLabel =
    periodType === "quarterly"
      ? shiftQuarter(currentQuarter(), offset)
      : String(new Date().getFullYear() + offset);

  function shiftPeriod(delta: number) {
    setOffset((o) => Math.min(0, o + delta));
    setDraftSnapshot(null);
  }
  const existing = findReview(periodType, periodLabel);
  const history = reviews.filter(
    (r) => !(r.period_type === periodType && r.period_label === periodLabel),
  );

  return (
    <div className="space-y-10">
      <ModuleHeader
        layer="Layer 05 · Learning Loop"
        title="Annual / Quarterly Review"
        meta="SAVED IN THIS BROWSER"
      >
        Close the loop. Structured reflection after a task measurably
        improves subsequent performance in both field and lab settings
        (Di Stefano, Gino, Pisano &amp; Staats, 2016) — the mechanism
        behind Kolb&rsquo;s experiential learning cycle (1984): experience,
        reflect, conceptualize, try again.
      </ModuleHeader>

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
                  setOffset(0);
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
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  aria-label="Previous period"
                  onClick={() => shiftPeriod(-1)}
                >
                  ‹
                </Button>
                <p className="label-technical">
                  {periodType === "quarterly" ? "Quarter" : "Year"} ·{" "}
                  {periodLabel}
                </p>
                <Button
                  size="sm"
                  variant="ghost"
                  aria-label="Next period"
                  disabled={offset === 0}
                  onClick={() => shiftPeriod(1)}
                >
                  ›
                </Button>
              </div>
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
                <p className="mt-6 border-t border-border pt-4 text-sm text-muted-foreground">
                  Loop closed.{" "}
                  <Link
                    href="/app/goals"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    Set the next quarter&rsquo;s objective →
                  </Link>
                </p>
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
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    onClick={() =>
                      setDraftSnapshot(
                        buildSummarySnapshot(periodType, periodLabel),
                      )
                    }
                  >
                    Generate {periodType} review
                  </Button>
                  <AddToCalendarButton
                    event={{
                      title: `${periodType === "quarterly" ? "Quarterly" : "Annual"} review · ${periodLabel} — Blueprint`,
                      date: todayISO(),
                      description: `Due: ${periodType} review for ${periodLabel}.`,
                    }}
                  />
                </div>
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
