"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mondayOfWeek } from "@/lib/dates";
import type { Habit, HabitWeeklyReview } from "@/lib/habits/types";
import { cn } from "@/lib/utils";

function ReviewForm({
  weekOf,
  initial,
  onSubmit,
}: {
  weekOf: string;
  initial?: HabitWeeklyReview;
  onSubmit: (fields: {
    days_completed: number;
    friction_note: string;
    adjustment_note: string;
  }) => void;
}) {
  const [days, setDays] = useState<number | null>(
    initial?.days_completed ?? null,
  );
  const [friction, setFriction] = useState(initial?.friction_note ?? "");
  const [adjustment, setAdjustment] = useState(initial?.adjustment_note ?? "");

  return (
    <form
      className="mt-4 space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (days === null) return;
        onSubmit({
          days_completed: days,
          friction_note: friction.trim(),
          adjustment_note: adjustment.trim(),
        });
      }}
    >
      <div className="space-y-1.5">
        <Label>Days it happened — week of {weekOf}</Label>
        <div
          role="radiogroup"
          aria-label="Days completed this week"
          className="flex flex-wrap items-center gap-1.5"
        >
          {Array.from({ length: 8 }, (_, n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={days === n}
              onClick={() => setDays(n)}
              className={cn(
                "measure h-10 w-10 rounded-sm border text-sm transition-colors",
                days === n
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background hover:border-primary",
              )}
            >
              {n}
            </button>
          ))}
          <span className="ml-1 text-xs text-muted-foreground">of 7</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="review-friction">What created friction?</Label>
          <Input
            id="review-friction"
            placeholder="Late meetings ate the evening"
            value={friction}
            onChange={(e) => setFriction(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="review-adjustment">One adjustment for next week</Label>
          <Input
            id="review-adjustment"
            placeholder="Move it to lunch instead"
            value={adjustment}
            onChange={(e) => setAdjustment(e.target.value)}
          />
        </div>
      </div>

      <Button type="submit" size="sm" disabled={days === null}>
        {initial ? "Update this week" : "Log this week"}
      </Button>
    </form>
  );
}

export function WeeklyReviewSection({
  habit,
  reviews,
  onUpsert,
}: {
  habit: Habit;
  reviews: HabitWeeklyReview[];
  onUpsert: (
    habitId: string,
    weekOf: string,
    fields: {
      days_completed: number;
      friction_note: string;
      adjustment_note: string;
    },
  ) => void;
}) {
  const weekOf = mondayOfWeek();
  const current = reviews.find((r) => r.week_of === weekOf);
  const history = [...reviews].sort((a, b) =>
    b.week_of.localeCompare(a.week_of),
  );

  return (
    <div>
      <h3 className="label-technical">Weekly review</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Once a week, not once a day: how often it happened, what got in the
        way, and the one change you’ll try next week.
      </p>

      <ReviewForm
        key={`${habit.id}-${weekOf}-${current?.id ?? "new"}`}
        weekOf={weekOf}
        initial={current}
        onSubmit={(fields) => onUpsert(habit.id, weekOf, fields)}
      />

      {history.length > 0 && (
        <ul className="mt-6 space-y-3">
          {history.map((r) => (
            <li key={r.id} className="border-l-2 border-border pl-3">
              <p className="measure text-xs text-dimension">
                WK {r.week_of} · {r.days_completed}/7
              </p>
              {r.friction_note && (
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Friction: {r.friction_note}
                </p>
              )}
              {r.adjustment_note && (
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Adjustment: {r.adjustment_note}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
