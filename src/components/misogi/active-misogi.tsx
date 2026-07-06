"use client";

import { useState } from "react";

import { AddToCalendarButton } from "@/components/add-to-calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { daysUntil, todayISO } from "@/lib/dates";
import type {
  DebriefOutcome,
  MisogiCandidate,
  TrainingSession,
} from "@/lib/misogi/types";

const DEBRIEF_COPY: Record<
  DebriefOutcome,
  { heading: string; lead: string }
> = {
  completed: {
    heading: "It’s done.",
    lead: "Write it down while it’s still loud. Mastery experiences are the strongest source of self-efficacy (Bandura, 1977) — the record is how this one keeps paying.",
  },
  failed_worth_it: {
    heading: "It didn’t go — and it still counts.",
    lead: "A misogi with guaranteed success was never a misogi; the 50% rule cuts both ways. Debrief it with the same care as a finish — this record carries equal value.",
  },
  abandoned: {
    heading: "Standing down for good.",
    lead: "Sometimes the honest call is that it was the wrong challenge. Write down why, so next year’s pick is sharper.",
  },
};

function DebriefForm({
  outcome,
  onSave,
  onBack,
}: {
  outcome: DebriefOutcome;
  onSave: (fields: {
    what_happened: string;
    what_it_changed: string;
    next_year_seed: string;
  }) => void;
  onBack: () => void;
}) {
  const [happened, setHappened] = useState("");
  const [changed, setChanged] = useState("");
  const [seed, setSeed] = useState("");
  const copy = DEBRIEF_COPY[outcome];
  const complete = happened.trim() && changed.trim() && seed.trim();

  return (
    <form
      className="mt-5 space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!complete) return;
        onSave({
          what_happened: happened.trim(),
          what_it_changed: changed.trim(),
          next_year_seed: seed.trim(),
        });
      }}
    >
      <div>
        <h3 className="font-mono text-xl font-semibold text-primary">
          {copy.heading}
        </h3>
        <p className="mt-1 max-w-xl text-sm text-muted-foreground">
          {copy.lead}
        </p>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="debrief-happened">What happened?</Label>
        <Textarea
          id="debrief-happened"
          autoFocus
          value={happened}
          onChange={(e) => setHappened(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="debrief-changed">
          What did it change in how you see yourself?
        </Label>
        <Textarea
          id="debrief-changed"
          value={changed}
          onChange={(e) => setChanged(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="debrief-seed">A seed for next year’s misogi</Label>
        <Input
          id="debrief-seed"
          value={seed}
          onChange={(e) => setSeed(e.target.value)}
        />
      </div>
      <div className="flex gap-3">
        <Button type="submit" disabled={!complete}>
          Save the record
        </Button>
        <Button type="button" variant="ghost" onClick={onBack}>
          Back
        </Button>
      </div>
    </form>
  );
}

export function ActiveMisogi({
  misogi,
  sessions,
  onAddSession,
  onStandDown,
  onDebrief,
}: {
  misogi: MisogiCandidate;
  sessions: TrainingSession[];
  onAddSession: (fields: {
    session_date: string;
    type: string;
    effort_score: number;
    notes: string;
  }) => void;
  onStandDown: () => void;
  onDebrief: (
    outcome: DebriefOutcome,
    fields: {
      what_happened: string;
      what_it_changed: string;
      next_year_seed: string;
    },
  ) => void;
}) {
  const [debriefing, setDebriefing] = useState(false);
  const [outcome, setOutcome] = useState<DebriefOutcome | null>(null);
  const [date, setDate] = useState(todayISO());
  const [type, setType] = useState("");
  const [effort, setEffort] = useState(6);
  const [notes, setNotes] = useState("");

  const days = misogi.event_date ? daysUntil(misogi.event_date) : null;
  const sorted = [...sessions].sort((a, b) =>
    b.session_date.localeCompare(a.session_date),
  );

  return (
    <section className="corner-marks border border-border bg-card p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="label-technical">Committed · {misogi.category}</p>
        {days !== null && (
          <p className="measure text-sm text-accent">
            {days >= 0 ? `D-${days}` : `${-days} DAYS PAST — DEBRIEF IT`}
          </p>
        )}
      </div>
      <h2 className="mt-2 font-mono text-2xl font-semibold text-primary">
        {misogi.title}
      </h2>
      <p className="measure mt-1 text-xs text-dimension">
        EVENT {misogi.event_date} · FEAR {misogi.fear_score} · PULL{" "}
        {misogi.pull_score}
        {misogi.fifty_percent_check ? " · 50% ✓" : ""}
      </p>

      {debriefing ? (
        outcome === null ? (
          <div className="mt-6">
            <h3 className="label-technical">How did it end?</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button onClick={() => setOutcome("completed")}>
                Completed
              </Button>
              <Button variant="outline" onClick={() => setOutcome("failed_worth_it")}>
                Failed — worth it
              </Button>
              <Button variant="ghost" onClick={() => setOutcome("abandoned")}>
                Abandoned
              </Button>
              <Button variant="ghost" onClick={() => setDebriefing(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <DebriefForm
            outcome={outcome}
            onSave={(fields) => onDebrief(outcome, fields)}
            onBack={() => setOutcome(null)}
          />
        )
      ) : (
        <>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button size="sm" variant="accent" onClick={() => setDebriefing(true)}>
              It happened — debrief
            </Button>
            {misogi.event_date && (
              <AddToCalendarButton
                event={{
                  title: `Misogi: ${misogi.title} — Blueprint`,
                  date: misogi.event_date,
                  description: `${misogi.category} · fear ${misogi.fear_score}, pull ${misogi.pull_score}`,
                }}
              />
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                if (
                  window.confirm(
                    "Stand down? The challenge returns to the vault; the training log is kept.",
                  )
                ) {
                  onStandDown();
                }
              }}
            >
              Stand down
            </Button>
          </div>

          <Separator className="my-6" />

          <div className="flex items-baseline justify-between gap-2">
            <h3 className="label-technical">
              Training log · {sessions.length}
            </h3>
            {sorted[0] && (
              <span className="measure text-xs text-dimension">
                LAST {sorted[0].session_date}
              </span>
            )}
          </div>

          <form
            className="mt-4 grid gap-3 sm:grid-cols-[10rem_1fr_10rem_auto]"
            onSubmit={(e) => {
              e.preventDefault();
              if (!type.trim()) return;
              onAddSession({
                session_date: date,
                type: type.trim(),
                effort_score: effort,
                notes: notes.trim(),
              });
              setType("");
              setNotes("");
              setEffort(6);
              setDate(todayISO());
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="session-date">Date</Label>
              <input
                id="session-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="flex h-10 w-full rounded-sm border border-input bg-paper-raised px-2 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="session-type">Session</Label>
              <Input
                id="session-type"
                required
                placeholder="Long swim, cold exposure, hill repeats…"
                value={type}
                onChange={(e) => setType(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-baseline justify-between">
                <Label htmlFor="session-effort">Effort</Label>
                <span className="measure text-xs text-dimension">
                  {effort}/10
                </span>
              </div>
              <input
                id="session-effort"
                type="range"
                min={1}
                max={10}
                value={effort}
                onChange={(e) => setEffort(Number(e.target.value))}
                className="h-2 w-full pt-3"
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" size="sm">
                Log
              </Button>
            </div>
            <div className="space-y-1.5 sm:col-span-4">
              <Label htmlFor="session-notes">
                Notes <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="session-notes"
                placeholder="Water at 12°C — managed 20 minutes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </form>

          {sorted.length > 0 && (
            <ul className="mt-5 space-y-2">
              {sorted.map((s) => (
                <li key={s.id} className="border-l-2 border-border pl-3">
                  <p className="measure text-xs text-dimension">
                    {s.session_date} · E{s.effort_score}/10
                  </p>
                  <p className="text-sm">
                    {s.type}
                    {s.notes && (
                      <span className="text-muted-foreground"> — {s.notes}</span>
                    )}
                  </p>
                </li>
              ))}
            </ul>
          )}

          {!misogi.fifty_percent_check && (
            <p className="mt-5 text-xs text-muted-foreground">
              <Badge variant="outline" className="mr-2">
                Note
              </Badge>
              This one never passed the 50% check — if the odds feel certain,
              consider raising the bar next time.
            </p>
          )}
        </>
      )}
    </section>
  );
}
