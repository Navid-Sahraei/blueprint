"use client";

import { useState } from "react";

import { IdeaBoard } from "@/components/adventures/idea-board";
import { ModuleHeader } from "@/components/module-header";
import { IdeaPrompts } from "@/components/adventures/idea-prompts";
import { SavoringDebrief } from "@/components/adventures/savoring-debrief";
import { YearCalendar } from "@/components/adventures/year-calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdventures } from "@/lib/adventures/use-adventures";
import { TYPE_LABEL, YEARLY_TARGET, type AdventureType } from "@/lib/adventures/types";

export function AdventureModule() {
  const {
    ready,
    adventures,
    addAdventure,
    updateAdventure,
    setStatus,
    removeAdventure,
    saveDebrief,
  } = useAdventures();

  const [title, setTitle] = useState("");
  const [type, setType] = useState<AdventureType | "">("");
  const [debriefingId, setDebriefingId] = useState<string | null>(null);

  const year = new Date().getFullYear();
  const doneThisYear = adventures.filter(
    (a) =>
      a.status === "done" &&
      a.target_date &&
      new Date(`${a.target_date}T00:00:00`).getFullYear() === year,
  ).length;
  const debriefing = adventures.find((a) => a.id === debriefingId) ?? null;

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    addAdventure({ title: title.trim(), type: type || null });
    setTitle("");
    setType("");
  }

  return (
    <div className="space-y-10">
      <ModuleHeader
        layer="Layer 02 · Big Moves"
        title="Adventure Ledger"
        meta={`${doneThisYear} / ${YEARLY_TARGET} THIS YEAR · SAVED IN THIS BROWSER`}
      >
        Six small, novel experiences a year — roughly one every two months.
        Sometimes called Kevin’s Rule, after a heuristic entrepreneur Jesse
        Itzler attributes to a friend; the mechanisms behind it are real.
        Experiences beat material purchases for lasting well-being (Van
        Boven &amp; Gilovich, 2003), anticipating one is itself a source of
        happiness (Kumar, Killingsworth &amp; Gilovich, 2014), and novelty
        counteracts hedonic adaptation (Lyubomirsky, Sheldon &amp; Schkade,
        2005).
      </ModuleHeader>

      {!ready ? (
        <p className="measure text-xs text-dimension">LOADING…</p>
      ) : debriefing ? (
        <SavoringDebrief
          adventure={debriefing}
          onSave={(fields) => {
            saveDebrief(debriefing.id, fields);
            setDebriefingId(null);
          }}
          onCancel={() => setDebriefingId(null)}
        />
      ) : (
        <>
          <IdeaPrompts
            onUse={(promptTitle, promptType) => {
              addAdventure({ title: promptTitle, type: promptType });
            }}
          />

          <section className="corner-marks border border-border bg-card p-6">
            <p className="label-technical">Add your own</p>
            <form onSubmit={handleAdd} className="mt-4 grid gap-3 sm:grid-cols-[1fr_10rem_auto]">
              <Input
                aria-label="New adventure idea"
                placeholder="A weekend I keep putting off"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <select
                aria-label="Category"
                value={type}
                onChange={(e) => setType(e.target.value as AdventureType | "")}
                className="flex h-10 w-full rounded-sm border border-input bg-paper-raised px-3 py-2 text-sm"
              >
                <option value="">Category…</option>
                {(Object.keys(TYPE_LABEL) as AdventureType[]).map((t) => (
                  <option key={t} value={t}>
                    {TYPE_LABEL[t]}
                  </option>
                ))}
              </select>
              <Button type="submit">Add idea</Button>
            </form>
          </section>

          <section>
            <h2 className="label-technical">Idea board</h2>
            <div className="mt-4">
              <IdeaBoard
                adventures={adventures}
                onSchedule={(id, date) =>
                  updateAdventure(id, { status: "scheduled", target_date: date })
                }
                onBook={(id) => setStatus(id, "booked")}
                onStartDebrief={(id) => setDebriefingId(id)}
                onEditDetails={(id, fields) => updateAdventure(id, fields)}
                onDelete={(a) => {
                  if (window.confirm(`Delete “${a.title}”?`)) {
                    removeAdventure(a.id);
                  }
                }}
              />
            </div>
          </section>

          <section>
            <h2 className="label-technical">The year — {year}</h2>
            <div className="mt-4">
              <YearCalendar adventures={adventures} year={year} />
            </div>
          </section>

          <footer className="border-t border-border pt-6">
            <p className="max-w-2xl text-sm text-muted-foreground">
              Itzler’s framing is a practitioner heuristic, not a research
              finding — the studies above support why novelty and anticipation
              matter, not the specific number six. Adjust the pace to your
              life; the point is spacing, not the count.
            </p>
          </footer>
        </>
      )}
    </div>
  );
}
