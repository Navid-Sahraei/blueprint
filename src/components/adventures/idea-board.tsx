"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { todayISO } from "@/lib/dates";
import type { Adventure, AdventureStatus } from "@/lib/adventures/types";
import { TYPE_LABEL } from "@/lib/adventures/types";

const COLUMNS: Array<{ status: AdventureStatus; label: string }> = [
  { status: "idea", label: "Idea" },
  { status: "scheduled", label: "Scheduled" },
  { status: "booked", label: "Booked" },
  { status: "done", label: "Done" },
];

function AdventureCard({
  adventure,
  onSchedule,
  onBook,
  onStartDebrief,
  onEditDetails,
  onDelete,
}: {
  adventure: Adventure;
  onSchedule: (date: string) => void;
  onBook: () => void;
  onStartDebrief: () => void;
  onEditDetails: (fields: { budget: number | null; companions: string }) => void;
  onDelete: () => void;
}) {
  const [scheduling, setScheduling] = useState(false);
  const [date, setDate] = useState(adventure.target_date ?? todayISO());
  const [editing, setEditing] = useState(false);
  const [budget, setBudget] = useState(
    adventure.budget !== null ? String(adventure.budget) : "",
  );
  const [companions, setCompanions] = useState(adventure.companions);

  return (
    <div className="border border-border bg-background p-4">
      <p className="font-medium">{adventure.title}</p>
      <p className="measure mt-1 text-[10px] text-dimension">
        {adventure.type ? TYPE_LABEL[adventure.type].toUpperCase() : "UNCATEGORIZED"}
        {adventure.target_date ? ` · ${adventure.target_date}` : ""}
      </p>
      {(adventure.budget !== null || adventure.companions) && (
        <p className="mt-1 text-xs text-muted-foreground">
          {adventure.budget !== null && `Budget ${adventure.budget}`}
          {adventure.budget !== null && adventure.companions && " · "}
          {adventure.companions}
        </p>
      )}

      {editing && (
        <div className="mt-3 space-y-2 border-t border-border pt-3">
          <Input
            aria-label={`Budget for ${adventure.title}`}
            type="number"
            min={0}
            placeholder="Budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
          <Input
            aria-label={`Companions for ${adventure.title}`}
            placeholder="Companions"
            value={companions}
            onChange={(e) => setCompanions(e.target.value)}
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => {
                onEditDetails({
                  budget: budget.trim() ? Number(budget) : null,
                  companions: companions.trim(),
                });
                setEditing(false);
              }}
            >
              Save
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {!editing && (
        <div className="mt-3 flex flex-wrap gap-2">
          {adventure.status === "idea" &&
            (scheduling ? (
              <>
                <input
                  type="date"
                  aria-label={`Target date for ${adventure.title}`}
                  value={date}
                  min={todayISO()}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-8 rounded-sm border border-input bg-paper-raised px-2 text-sm"
                />
                <Button
                  size="sm"
                  onClick={() => {
                    onSchedule(date);
                    setScheduling(false);
                  }}
                >
                  Confirm
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setScheduling(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={() => setScheduling(true)}>
                Schedule
              </Button>
            ))}
          {adventure.status === "scheduled" && (
            <Button size="sm" onClick={onBook}>
              Mark booked
            </Button>
          )}
          {adventure.status === "booked" && (
            <Button size="sm" variant="accent" onClick={onStartDebrief}>
              It happened
            </Button>
          )}
          {adventure.status !== "done" && (
            <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
              Edit
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={onDelete}>
            Delete
          </Button>
        </div>
      )}

      {adventure.status === "done" && adventure.best_moment && (
        <div className="mt-3 border-t border-border pt-2 text-xs text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">Best moment:</span>{" "}
            {adventure.best_moment}
          </p>
        </div>
      )}
    </div>
  );
}

export function IdeaBoard({
  adventures,
  onSchedule,
  onBook,
  onStartDebrief,
  onEditDetails,
  onDelete,
}: {
  adventures: Adventure[];
  onSchedule: (id: string, date: string) => void;
  onBook: (id: string) => void;
  onStartDebrief: (id: string) => void;
  onEditDetails: (
    id: string,
    fields: { budget: number | null; companions: string },
  ) => void;
  onDelete: (a: Adventure) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {COLUMNS.map((col) => {
        const rows = adventures
          .filter((a) => a.status === col.status)
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
                rows.map((a) => (
                  <AdventureCard
                    key={a.id}
                    adventure={a}
                    onSchedule={(date) => onSchedule(a.id, date)}
                    onBook={() => onBook(a.id)}
                    onStartDebrief={() => onStartDebrief(a.id)}
                    onEditDetails={(fields) => onEditDetails(a.id, fields)}
                    onDelete={() => onDelete(a)}
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
