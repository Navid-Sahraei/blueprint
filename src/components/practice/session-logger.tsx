"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { todayISO } from "@/lib/dates";
import type { PracticeSession } from "@/lib/practice/types";

const DIFFICULTY_LABELS = [
  "Comfortable — below my current level",
  "Easy — within my current level",
  "Right at my current level",
  "Stretching — above my current level",
  "Struggling — well beyond my current level",
];

export function SessionLogger({
  onAdd,
}: {
  onAdd: (fields: {
    date: string;
    duration_minutes: number;
    sub_skill_focus: string;
    feedback_notes: string;
    next_focus: string;
    difficulty_rating: number;
  }) => void;
}) {
  const [date, setDate] = useState(todayISO());
  const [duration, setDuration] = useState("30");
  const [subSkill, setSubSkill] = useState("");
  const [feedback, setFeedback] = useState("");
  const [nextFocus, setNextFocus] = useState("");
  const [difficulty, setDifficulty] = useState(3);

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        const mins = Number(duration);
        if (!subSkill.trim() || !Number.isFinite(mins) || mins <= 0) return;
        onAdd({
          date,
          duration_minutes: Math.round(mins),
          sub_skill_focus: subSkill.trim(),
          feedback_notes: feedback.trim(),
          next_focus: nextFocus.trim(),
          difficulty_rating: difficulty,
        });
        setSubSkill("");
        setFeedback("");
        setNextFocus("");
        setDuration("30");
        setDifficulty(3);
        setDate(todayISO());
      }}
    >
      <div className="grid gap-3 sm:grid-cols-[8rem_1fr_6rem]">
        <div className="space-y-1.5">
          <Label htmlFor="session-date">Date</Label>
          <input
            id="session-date"
            type="date"
            value={date}
            max={todayISO()}
            onChange={(e) => setDate(e.target.value)}
            className="flex h-10 w-full rounded-sm border border-input bg-paper-raised px-2 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="session-subskill">Specific sub-skill worked on</Label>
          <Input
            id="session-subskill"
            required
            placeholder="Left-hand voicings under a walking bassline"
            value={subSkill}
            onChange={(e) => setSubSkill(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="session-duration">Minutes</Label>
          <Input
            id="session-duration"
            type="number"
            min={1}
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="session-feedback">Feedback received</Label>
          <Input
            id="session-feedback"
            placeholder="Teacher said the transitions rush"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="session-next">
            Next session&rsquo;s adjustment{" "}
            <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="session-next"
            placeholder="Slow the left hand to 60bpm first"
            value={nextFocus}
            onChange={(e) => setNextFocus(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-baseline justify-between">
          <Label htmlFor="session-difficulty">Difficulty</Label>
          <span className="measure text-xs text-dimension">
            {difficulty}/5
          </span>
        </div>
        <input
          id="session-difficulty"
          type="range"
          min={1}
          max={5}
          value={difficulty}
          onChange={(e) => setDifficulty(Number(e.target.value))}
          className="h-2 w-full"
        />
        <p className="text-xs text-muted-foreground">
          {DIFFICULTY_LABELS[difficulty - 1]}
        </p>
      </div>

      <Button type="submit" size="sm">
        Log session
      </Button>
    </form>
  );
}

export function SessionHistory({ sessions }: { sessions: PracticeSession[] }) {
  const sorted = [...sessions].sort((a, b) => b.date.localeCompare(a.date));
  if (sorted.length === 0) {
    return (
      <p className="measure text-xs text-dimension">
        NO SESSIONS LOGGED YET
      </p>
    );
  }
  return (
    <ul className="space-y-3">
      {sorted.map((s) => (
        <li key={s.id} className="border-l-2 border-border pl-3">
          <p className="measure text-xs text-dimension">
            {s.date} · {s.duration_minutes}MIN · DIFFICULTY {s.difficulty_rating}/5
          </p>
          <p className="text-sm">{s.sub_skill_focus}</p>
          {s.feedback_notes && (
            <p className="mt-0.5 text-sm text-muted-foreground">
              {s.feedback_notes}
            </p>
          )}
          {s.next_focus && (
            <p className="mt-0.5 text-sm text-muted-foreground">
              Next: {s.next_focus}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
