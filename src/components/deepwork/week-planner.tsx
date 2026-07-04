"use client";

import { useState } from "react";

import { CompleteForm } from "@/components/deepwork/complete-form";
import { SessionTimer } from "@/components/deepwork/session-timer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { todayISO } from "@/lib/dates";
import type { DeepWorkSession } from "@/lib/deepwork/types";
import { isCompleted, PLANNED_DURATIONS } from "@/lib/deepwork/types";
import { cn } from "@/lib/utils";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function DayColumn({
  date,
  label,
  isToday,
  sessions,
  running,
  onStart,
  onStop,
  onManualComplete,
  onDelete,
}: {
  date: string;
  label: string;
  isToday: boolean;
  sessions: DeepWorkSession[];
  running: { id: string; startedAt: number } | null;
  onStart: (id: string) => void;
  onStop: (id: string) => void;
  onManualComplete: (id: string, minutes: number, focus: number) => void;
  onDelete: (id: string) => void;
}) {
  const [manualId, setManualId] = useState<string | null>(null);
  const [pending, setPending] = useState<Record<string, number>>({});

  return (
    <div className={cn("border bg-card", isToday ? "border-primary" : "border-border")}>
      <div className="flex items-baseline justify-between border-b border-border px-3 py-2">
        <span className="label-technical">{label}</span>
        <span className="measure text-xs text-dimension">
          {date.slice(5)}
        </span>
      </div>
      <div className="space-y-2 p-3">
        {sessions.length === 0 && (
          <p className="measure text-xs text-dimension">—</p>
        )}
        {sessions.map((s) => {
          const done = isCompleted(s);
          const isRunning = running?.id === s.id;
          const stoppedMinutes = pending[s.id];
          return (
            <div key={s.id} className="border border-border bg-background p-2.5">
              <p className="text-sm font-medium">{s.task_description}</p>
              <p className="measure mt-0.5 text-[10px] text-dimension">
                {s.start_time ? `${s.start_time} · ` : ""}
                {done
                  ? `${s.actual_duration}MIN · FOCUS ${s.focus_rating}/5`
                  : `PLANNED ${s.planned_duration}MIN`}
              </p>
              {!done && isRunning && (
                <div className="mt-2">
                  <SessionTimer
                    startedAt={running.startedAt}
                    onStop={(m) => {
                      onStop(s.id);
                      setPending((prev) => ({ ...prev, [s.id]: m }));
                    }}
                  />
                </div>
              )}
              {!done && !isRunning && stoppedMinutes !== undefined && (
                <CompleteForm
                  defaultMinutes={stoppedMinutes}
                  onSave={(m, f) => {
                    onManualComplete(s.id, m, f);
                    setPending((prev) => {
                      const next = { ...prev };
                      delete next[s.id];
                      return next;
                    });
                  }}
                  onCancel={() =>
                    setPending((prev) => {
                      const next = { ...prev };
                      delete next[s.id];
                      return next;
                    })
                  }
                />
              )}
              {!done && !isRunning && stoppedMinutes === undefined && manualId === s.id && (
                <CompleteForm
                  defaultMinutes={s.planned_duration}
                  onSave={(m, f) => {
                    onManualComplete(s.id, m, f);
                    setManualId(null);
                  }}
                  onCancel={() => setManualId(null)}
                />
              )}
              {!done && !isRunning && stoppedMinutes === undefined && manualId !== s.id && (
                <div className="mt-2 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    disabled={running !== null}
                    onClick={() => onStart(s.id)}
                  >
                    Start
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={running !== null}
                    onClick={() => setManualId(s.id)}
                  >
                    Log manually
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => onDelete(s.id)}>
                    Delete
                  </Button>
                </div>
              )}
              {done && (
                <div className="mt-2">
                  <Button size="sm" variant="ghost" onClick={() => onDelete(s.id)}>
                    Delete
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function WeekPlanner({
  weekDates,
  sessions,
  running,
  onAdd,
  onStart,
  onStop,
  onManualComplete,
  onDelete,
}: {
  weekDates: string[];
  sessions: DeepWorkSession[];
  running: { id: string; startedAt: number } | null;
  onAdd: (
    date: string,
    task: string,
    planned: number,
    startTime: string | null,
  ) => void;
  onStart: (id: string) => void;
  onStop: (id: string) => void;
  onManualComplete: (id: string, minutes: number, focus: number) => void;
  onDelete: (id: string) => void;
}) {
  const [date, setDate] = useState(todayISO());
  const [task, setTask] = useState("");
  const [planned, setPlanned] = useState<number>(PLANNED_DURATIONS[1]);
  const [startTime, setStartTime] = useState("");
  const today = todayISO();

  return (
    <div className="space-y-5">
      <form
        className="corner-marks grid gap-3 border border-border bg-card p-5 sm:grid-cols-[9rem_1fr_8rem_8rem_auto]"
        onSubmit={(e) => {
          e.preventDefault();
          if (!task.trim()) return;
          onAdd(date, task.trim(), planned, startTime || null);
          setTask("");
          setStartTime("");
        }}
      >
        <div className="space-y-1.5">
          <Label htmlFor="block-date">Day</Label>
          <select
            id="block-date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="flex h-10 w-full rounded-sm border border-input bg-paper-raised px-2 text-sm"
          >
            {weekDates.map((d, i) => (
              <option key={d} value={d}>
                {DAY_LABELS[i]} {d.slice(5)}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="block-task">Block</Label>
          <Input
            id="block-task"
            required
            placeholder="Draft the chapter, not “work on book”"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="block-time">
            Start <span className="text-muted-foreground">(opt.)</span>
          </Label>
          <input
            id="block-time"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="flex h-10 w-full rounded-sm border border-input bg-paper-raised px-2 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="block-planned">Planned</Label>
          <select
            id="block-planned"
            value={planned}
            onChange={(e) => setPlanned(Number(e.target.value))}
            className="flex h-10 w-full rounded-sm border border-input bg-paper-raised px-2 text-sm"
          >
            {PLANNED_DURATIONS.map((m) => (
              <option key={m} value={m}>
                {m} min
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <Button type="submit" className="w-full sm:w-auto">
            Add block
          </Button>
        </div>
      </form>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {weekDates.map((d, i) => (
          <DayColumn
            key={d}
            date={d}
            label={DAY_LABELS[i]}
            isToday={d === today}
            sessions={sessions
              .filter((s) => s.date === d)
              .sort((a, b) => {
                // Timed blocks first, in day order; untimed after, by entry.
                if (a.start_time && b.start_time)
                  return a.start_time.localeCompare(b.start_time);
                if (a.start_time) return -1;
                if (b.start_time) return 1;
                return a.created_at.localeCompare(b.created_at);
              })}
            running={running}
            onStart={onStart}
            onStop={onStop}
            onManualComplete={onManualComplete}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
