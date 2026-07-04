"use client";

import { useRef, useState } from "react";

import { HabitForm } from "@/components/habits/habit-form";
import { PipelineBoard } from "@/components/habits/pipeline";
import { WeeklyReviewSection } from "@/components/habits/weekly-review";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { currentQuarter, daysBetween } from "@/lib/dates";
import type { Habit, HabitFields } from "@/lib/habits/types";
import { MEDIAN_DAYS_TO_AUTOMATIC } from "@/lib/habits/types";
import { useHabits } from "@/lib/habits/use-habits";

const FIELD_LABELS: Array<{
  key: "tiny_version" | "anchor" | "implementation_intention" | "identity_line";
  label: string;
}> = [
  { key: "tiny_version", label: "Tiny version" },
  { key: "anchor", label: "Anchor" },
  { key: "implementation_intention", label: "If-then plan" },
  { key: "identity_line", label: "Identity" },
];

export function HabitFoundry() {
  const {
    ready,
    habits,
    reviews,
    installing,
    addHabit,
    updateHabit,
    removeHabit,
    beginInstall,
    setStatus,
    upsertReview,
  } = useHabits();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Habit | null>(null);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLElement>(null);

  function handleBeginInstall(id: string) {
    setError(beginInstall(id));
  }

  function handleEdit(habit: Habit) {
    setError(null);
    setEditing(habit);
    setFormOpen(true);
    formRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }

  function handleDelete(habit: Habit) {
    if (
      window.confirm(
        `Delete “${habit.title}”? Its weekly reviews go with it.`,
      )
    ) {
      removeHabit(habit.id);
    }
  }

  function handleSave(fields: HabitFields) {
    if (editing) {
      updateHabit(editing.id, fields);
    } else {
      addHabit(fields);
    }
    setEditing(null);
    setFormOpen(false);
  }

  const day = installing?.start_date
    ? daysBetween(installing.start_date) + 1
    : 1;
  const pct = Math.min(100, Math.round((day / MEDIAN_DAYS_TO_AUTOMATIC) * 100));

  return (
    <div className="space-y-10">
      {/* Header */}
      <header>
        <p className="label-technical mb-2">Layer 04 · Growth &amp; Mastery</p>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="font-mono text-3xl font-semibold text-primary">
            Habit Foundry
          </h1>
          <p className="measure text-xs text-dimension">
            {currentQuarter()} · SAVED IN THIS BROWSER
          </p>
        </div>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          One habit per quarter, installed properly. In the best real-world
          study of habit formation, automaticity took a median of 66 days to
          develop — range 18 to 254 (Lally, van Jaarsveld, Potts &amp; Wardle,
          2010). The popular 21-day figure is a myth; a quarter gives a habit
          the time it actually needs.
        </p>
      </header>

      {!ready ? (
        <p className="measure text-xs text-dimension">LOADING…</p>
      ) : (
        <>
          {/* Active install */}
          {installing ? (
            <section className="corner-marks border border-border bg-card p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="label-technical">
                  Installing · {installing.quarter}
                </p>
                <p className="measure text-xs text-dimension">
                  DAY {day} · MEDIAN {MEDIAN_DAYS_TO_AUTOMATIC}
                </p>
              </div>
              <h2 className="mt-2 font-mono text-2xl font-semibold text-primary">
                {installing.title}
              </h2>
              {installing.identity_line && (
                <p className="mt-1 text-sm text-muted-foreground">
                  “{installing.identity_line}”
                </p>
              )}

              <div className="mt-4 h-1.5 w-full bg-muted" aria-hidden>
                <div
                  className="h-full bg-accent"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Day counts, not streaks — a missed day doesn’t reset anything
                (Lally et al., 2010).
              </p>

              <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                {FIELD_LABELS.map(({ key, label }) =>
                  installing[key] ? (
                    <div key={key}>
                      <dt className="label-technical">{label}</dt>
                      <dd className="mt-1 text-sm">{installing[key]}</dd>
                    </div>
                  ) : null,
                )}
              </dl>

              <div className="mt-6 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  onClick={() => setStatus(installing.id, "automatic")}
                >
                  Mark automatic
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(installing)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setStatus(installing.id, "dropped")}
                >
                  Drop
                </Button>
              </div>

              <Separator className="my-6" />

              <WeeklyReviewSection
                habit={installing}
                reviews={reviews.filter((r) => r.habit_id === installing.id)}
                onUpsert={upsertReview}
              />
            </section>
          ) : (
            <section className="border border-dashed border-border p-6">
              <p className="label-technical">No habit installing</p>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                Pick one from the backlog and begin its install, or add a new
                habit below. One per quarter is the whole method — resist the
                urge to run three at once.
              </p>
            </section>
          )}

          {/* Pipeline */}
          <section>
            <h2 className="label-technical">Pipeline</h2>
            {error && (
              <p role="alert" className="mt-2 text-sm text-destructive">
                {error}
              </p>
            )}
            <div className="mt-4">
              <PipelineBoard
                habits={habits}
                onBeginInstall={handleBeginInstall}
                onEdit={handleEdit}
                onRevive={(id) => setStatus(id, "backlog")}
                onDelete={handleDelete}
              />
            </div>
          </section>

          {/* Add / edit form */}
          <section
            ref={formRef}
            className="corner-marks border border-border bg-card p-6"
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="label-technical">
                {editing ? "Edit habit" : "Add a habit"}
              </h2>
              {!formOpen && (
                <Button size="sm" onClick={() => setFormOpen(true)}>
                  New habit
                </Button>
              )}
            </div>
            {formOpen ? (
              <HabitForm
                key={editing?.id ?? "new"}
                initial={editing ?? undefined}
                onSave={handleSave}
                onCancel={() => {
                  setFormOpen(false);
                  setEditing(null);
                }}
              />
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                New habits land in the backlog. Install one per quarter.
              </p>
            )}
          </section>

          {/* Design rationale */}
          <footer className="border-t border-border pt-6">
            <p className="max-w-2xl text-sm text-muted-foreground">
              Why there’s no daily checkbox grid here: daily ticking belongs
              somewhere with zero friction — a paper calendar, a widget on
              your phone. The Foundry’s job is the weekly diagnosis: how often
              the habit happened, what created friction, and the one
              adjustment for next week.
            </p>
          </footer>
        </>
      )}
    </div>
  );
}
