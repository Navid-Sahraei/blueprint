"use client";

import { useState } from "react";

import { FearPullChart } from "@/components/misogi/fear-pull-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { todayISO } from "@/lib/dates";
import type { MisogiCandidate } from "@/lib/misogi/types";
import { CATEGORIES } from "@/lib/misogi/types";

function ScoreSlider({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <Label htmlFor={id}>{label}</Label>
        <span className="measure text-xs text-dimension">{value} / 10</span>
      </div>
      <input
        id={id}
        type="range"
        min={1}
        max={10}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full"
      />
    </div>
  );
}

export function CandidateVault({
  candidates,
  hasActive,
  error,
  onAdd,
  onCommit,
  onRemove,
}: {
  candidates: MisogiCandidate[];
  hasActive: boolean;
  error: string | null;
  onAdd: (fields: {
    title: string;
    category: string;
    fear_score: number;
    pull_score: number;
    fifty_percent_check: boolean;
  }) => void;
  onCommit: (id: string, eventDate: string) => void;
  onRemove: (c: MisogiCandidate) => void;
}) {
  const [formOpen, setFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [fear, setFear] = useState(5);
  const [pull, setPull] = useState(5);
  const [fifty, setFifty] = useState(false);
  const [committingId, setCommittingId] = useState<string | null>(null);
  const [eventDate, setEventDate] = useState("");

  const vault = candidates.filter((c) => c.status === "candidate");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({
      title: title.trim(),
      category,
      fear_score: fear,
      pull_score: pull,
      fifty_percent_check: fifty,
    });
    setTitle("");
    setFear(5);
    setPull(5);
    setFifty(false);
    setFormOpen(false);
  }

  return (
    <section className="corner-marks border border-border bg-card p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="label-technical">Candidate vault · {vault.length}</h2>
        {!formOpen && (
          <Button size="sm" onClick={() => setFormOpen(true)}>
            New candidate
          </Button>
        )}
      </div>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">
        Collect ideas all year. The one worth committing to sits where fear
        and pull are both high — and passes the 50% rule: roughly even odds
        you finish.
      </p>

      {formOpen && (
        <form onSubmit={submit} className="mt-5 space-y-4 border-t border-border pt-5">
          <div className="grid gap-4 sm:grid-cols-[1fr_11rem]">
            <div className="space-y-1.5">
              <Label htmlFor="misogi-title">The challenge</Label>
              <Input
                id="misogi-title"
                required
                autoFocus
                placeholder="Swim the lake I grew up next to, end to end"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="misogi-category">Category</Label>
              <select
                id="misogi-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="flex h-10 w-full rounded-sm border border-input bg-paper-raised px-3 py-2 text-sm"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <ScoreSlider
              id="misogi-fear"
              label="Fear — how much it scares you"
              value={fear}
              onChange={setFear}
            />
            <ScoreSlider
              id="misogi-pull"
              label="Pull — how much it draws you"
              value={pull}
              onChange={setPull}
            />
          </div>
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={fifty}
              onChange={(e) => setFifty(e.target.checked)}
              className="mt-0.5"
            />
            <span>
              The 50% rule: I’d give myself roughly even odds of finishing.
              <span className="block text-xs text-muted-foreground">
                If success is certain, it isn’t a misogi.
              </span>
            </span>
          </label>
          <div className="flex gap-3">
            <Button type="submit">Add to vault</Button>
            <Button type="button" variant="ghost" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1fr)_280px]">
        {/* list */}
        <div>
          {error && (
            <p role="alert" className="mb-3 text-sm text-destructive">
              {error}
            </p>
          )}
          {vault.length === 0 ? (
            <p className="measure border border-dashed border-border px-4 py-8 text-center text-xs text-dimension">
              THE VAULT IS EMPTY — ADD THE IDEA YOU KEEP NOT SAYING OUT LOUD
            </p>
          ) : (
            <ul className="space-y-3">
              {vault.map((c) => (
                <li key={c.id} className="border border-border bg-background p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-medium">{c.title}</p>
                    {c.fifty_percent_check && (
                      <Badge variant="outline">50% ✓</Badge>
                    )}
                  </div>
                  <p className="measure mt-1 text-[10px] text-dimension">
                    {c.category.toUpperCase()} · FEAR {c.fear_score} · PULL{" "}
                    {c.pull_score}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {committingId === c.id ? (
                      <>
                        <input
                          type="date"
                          aria-label={`Event date for ${c.title}`}
                          value={eventDate}
                          min={todayISO()}
                          onChange={(e) => setEventDate(e.target.value)}
                          className="h-8 rounded-sm border border-input bg-paper-raised px-2 text-sm"
                        />
                        <Button
                          size="sm"
                          variant="accent"
                          disabled={!eventDate}
                          onClick={() => {
                            onCommit(c.id, eventDate);
                            setCommittingId(null);
                            setEventDate("");
                          }}
                        >
                          Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setCommittingId(null)}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          disabled={hasActive}
                          onClick={() => setCommittingId(c.id)}
                        >
                          Commit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onRemove(c)}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* chart */}
        <div>
          <FearPullChart candidates={candidates.filter((c) => c.status !== "dropped")} />
        </div>
      </div>
    </section>
  );
}
