"use client";

import { useState } from "react";

import { WeekPlanner } from "@/components/deepwork/week-planner";
import { WeeklyTrend } from "@/components/deepwork/weekly-trend";
import { mondayOfWeek, weekDates } from "@/lib/dates";
import { useDeepWork } from "@/lib/deepwork/use-deep-work";

export function DeepWorkModule() {
  const { ready, sessions, addSession, completeSession, removeSession } =
    useDeepWork();
  const [running, setRunning] = useState<{ id: string; startedAt: number } | null>(
    null,
  );

  const monday = mondayOfWeek();
  const days = weekDates(monday);
  const weekSessions = sessions.filter((s) => days.includes(s.date));
  const weekHours =
    weekSessions
      .filter((s) => s.actual_duration !== null)
      .reduce((sum, s) => sum + (s.actual_duration ?? 0), 0) / 60;

  return (
    <div className="space-y-10">
      <header>
        <p className="label-technical mb-2">Layer 03 · Execution</p>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="font-mono text-3xl font-semibold text-primary">
            Deep Work &amp; Time Blocking
          </h1>
          <p className="measure text-xs text-dimension">
            {weekHours.toFixed(1)} HRS THIS WEEK · SAVED IN THIS BROWSER
          </p>
        </div>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          A weekly plan around a small number of high-value, focus-intensive
          blocks. Switching tasks leaves attention residue — part of your
          attention stays with the last task, measurably degrading
          performance on the next one (Leroy, 2009). Blocking contiguous time
          is the direct countermeasure, popularized by Cal Newport in Deep
          Work (2016).
        </p>
      </header>

      {!ready ? (
        <p className="measure text-xs text-dimension">LOADING…</p>
      ) : (
        <>
          <section>
            <h2 className="label-technical">This week</h2>
            <div className="mt-4">
              <WeekPlanner
                weekDates={days}
                sessions={weekSessions}
                running={running}
                onAdd={(date, task, plannedDuration) =>
                  addSession({
                    date,
                    task_description: task,
                    planned_duration: plannedDuration,
                  })
                }
                onStart={(id) => setRunning({ id, startedAt: Date.now() })}
                onStop={() => setRunning(null)}
                onManualComplete={(id, minutes, focus) =>
                  completeSession(id, minutes, focus)
                }
                onDelete={(id) => {
                  if (running?.id === id) setRunning(null);
                  removeSession(id);
                }}
              />
            </div>
          </section>

          <section>
            <h2 className="label-technical">Weekly hours — trend</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Six weeks, so a slipping trend shows up before it becomes a
              slipping quarter.
            </p>
            <div className="mt-5 border border-border bg-card p-5">
              <WeeklyTrend sessions={sessions} />
            </div>
          </section>

          <footer className="border-t border-border pt-6">
            <p className="max-w-2xl text-sm text-muted-foreground">
              Deep Work is a practitioner framework built on cognitive
              psychology research, not itself a peer-reviewed study. The
              planned-versus-actual gap each week is often more informative
              than the hours total alone.
            </p>
          </footer>
        </>
      )}
    </div>
  );
}
