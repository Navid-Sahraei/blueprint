"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { currentMonth } from "@/lib/dates";
import type { MonthlyReflection } from "@/lib/practice/types";

export function MonthlyReflectionSection({
  reflections,
  onSave,
}: {
  reflections: MonthlyReflection[];
  onSave: (monthLabel: string, whatChanged: string) => void;
}) {
  const month = currentMonth();
  const current = reflections.find((r) => r.month_label === month);
  const [text, setText] = useState(current?.what_changed ?? "");
  const history = [...reflections]
    .filter((r) => r.month_label !== month)
    .sort((a, b) => b.month_label.localeCompare(a.month_label));

  return (
    <div>
      <h3 className="label-technical">What changed this month — {month}</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Not a session count, not hours logged — the popular “10,000-hour
        rule” is a simplification Ericsson himself disputed. What can you do
        now that you couldn’t a month ago?
      </p>
      <form
        className="mt-4 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          onSave(month, text.trim());
        }}
      >
        <Textarea
          aria-label="What changed this month"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="The left hand doesn’t rush anymore under pressure — that took the whole month."
        />
        <Button type="submit" size="sm" disabled={!text.trim()}>
          {current ? "Update this month" : "Save this month"}
        </Button>
      </form>

      {history.length > 0 && (
        <ul className="mt-6 space-y-3">
          {history.map((r) => (
            <li key={r.id} className="border-l-2 border-border pl-3">
              <p className="measure text-xs text-dimension">{r.month_label}</p>
              <p className="text-sm">{r.what_changed}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
