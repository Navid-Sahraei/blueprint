import type { SummarySnapshot } from "@/lib/review/types";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border bg-background p-3">
      <p className="label-technical">{label}</p>
      <p className="mt-1 text-sm">{value}</p>
    </div>
  );
}

export function SnapshotView({ snapshot }: { snapshot: SummarySnapshot }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <Stat
        label="Values"
        value={
          snapshot.values.count > 0
            ? `${snapshot.values.count} set · top: ${snapshot.values.top}`
            : "Not sorted yet"
        }
      />
      {snapshot.quarters.map((q) => (
        <Stat
          key={q.label}
          label={`Goals — ${q.label}`}
          value={
            q.objectiveText
              ? `${q.objectiveText} (${q.progressPct}%)`
              : "No objective set"
          }
        />
      ))}
      {snapshot.quarters.map((q) => (
        <Stat
          key={`habit-${q.label}`}
          label={`Habit — ${q.label}`}
          value={q.habitTitle ? `${q.habitTitle} (${q.habitStatus})` : "None"}
        />
      ))}
      <Stat
        label="Misogi"
        value={
          snapshot.misogi.activeTitle
            ? `${snapshot.misogi.activeTitle}${
                snapshot.misogi.daysUntil !== null
                  ? ` · D-${snapshot.misogi.daysUntil}`
                  : ""
              }`
            : `${snapshot.misogi.doneInPeriod} done, ${snapshot.misogi.failedWorthItInPeriod} failed — worth it`
        }
      />
      <Stat
        label="Adventures"
        value={`${snapshot.adventures.doneInPeriod} done this period${
          snapshot.adventures.upcomingTitle
            ? ` · next: ${snapshot.adventures.upcomingTitle}`
            : ""
        }`}
      />
      <Stat label="WOOP plans" value={`${snapshot.woop.totalCount} total`} />
      <Stat
        label="Deep work"
        value={`${snapshot.deepWorkHours} hrs this period`}
      />
      <Stat
        label="Practice"
        value={
          snapshot.practice.activeSkillName
            ? `${snapshot.practice.activeSkillName} · ${snapshot.practice.sessionsInPeriod} sessions`
            : "No active skill"
        }
      />
    </div>
  );
}
