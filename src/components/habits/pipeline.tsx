"use client";

import { Button } from "@/components/ui/button";
import type { Habit, HabitStatus } from "@/lib/habits/types";

const COLUMNS: Array<{ status: HabitStatus; label: string }> = [
  { status: "backlog", label: "Backlog" },
  { status: "installing", label: "Installing" },
  { status: "automatic", label: "Automatic" },
  { status: "dropped", label: "Dropped" },
];

function PipelineCard({
  habit,
  onBeginInstall,
  onEdit,
  onRevive,
  onDelete,
}: {
  habit: Habit;
  onBeginInstall: (id: string) => void;
  onEdit: (habit: Habit) => void;
  onRevive: (id: string) => void;
  onDelete: (habit: Habit) => void;
}) {
  return (
    <div className="border border-border bg-background p-4">
      <p className="font-medium">{habit.title}</p>
      {habit.tiny_version && (
        <p className="mt-1 text-xs text-muted-foreground">
          Tiny: {habit.tiny_version}
        </p>
      )}
      {habit.quarter && (
        <p className="measure mt-1 text-[10px] text-dimension">
          {habit.quarter}
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        {habit.status === "backlog" && (
          <>
            <Button size="sm" onClick={() => onBeginInstall(habit.id)}>
              Begin install
            </Button>
            <Button size="sm" variant="outline" onClick={() => onEdit(habit)}>
              Edit
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onDelete(habit)}>
              Delete
            </Button>
          </>
        )}
        {habit.status === "installing" && (
          <p className="text-xs text-muted-foreground">
            Managed in the install card above.
          </p>
        )}
        {habit.status === "automatic" && (
          <Button size="sm" variant="ghost" onClick={() => onDelete(habit)}>
            Delete
          </Button>
        )}
        {habit.status === "dropped" && (
          <>
            <Button size="sm" variant="outline" onClick={() => onRevive(habit.id)}>
              Back to backlog
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onDelete(habit)}>
              Delete
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export function PipelineBoard({
  habits,
  onBeginInstall,
  onEdit,
  onRevive,
  onDelete,
}: {
  habits: Habit[];
  onBeginInstall: (id: string) => void;
  onEdit: (habit: Habit) => void;
  onRevive: (id: string) => void;
  onDelete: (habit: Habit) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {COLUMNS.map((col) => {
        const rows = habits
          .filter((h) => h.status === col.status)
          .sort((a, b) => a.created_at.localeCompare(b.created_at));
        return (
          <div key={col.status} className="border border-border bg-card">
            <div className="flex items-baseline justify-between border-b border-border px-4 py-2">
              <span className="label-technical">{col.label}</span>
              <span className="measure text-xs text-dimension">
                {rows.length}
              </span>
            </div>
            <div className="space-y-3 p-4">
              {rows.length === 0 ? (
                <p className="measure text-xs text-dimension">EMPTY</p>
              ) : (
                rows.map((h) => (
                  <PipelineCard
                    key={h.id}
                    habit={h}
                    onBeginInstall={onBeginInstall}
                    onEdit={onEdit}
                    onRevive={onRevive}
                    onDelete={onDelete}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
