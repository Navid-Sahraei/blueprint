"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mondayOfWeek } from "@/lib/dates";
import type { GratitudeEntry } from "@/lib/gratitude/types";
import { useGratitude } from "@/lib/gratitude/use-gratitude";

function WeekForm({
  current,
  onSave,
}: {
  current?: GratitudeEntry;
  onSave: (fields: { entry_1: string; entry_2: string; entry_3: string }) => void;
}) {
  const [entry1, setEntry1] = useState(current?.entry_1 ?? "");
  const [entry2, setEntry2] = useState(current?.entry_2 ?? "");
  const [entry3, setEntry3] = useState(current?.entry_3 ?? "");
  const complete = entry1.trim() && entry2.trim() && entry3.trim();

  return (
    <form
      className="mt-4 space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (!complete) return;
        onSave({
          entry_1: entry1.trim(),
          entry_2: entry2.trim(),
          entry_3: entry3.trim(),
        });
      }}
    >
      {[
        { id: "grat-1", value: entry1, set: setEntry1 },
        { id: "grat-2", value: entry2, set: setEntry2 },
        { id: "grat-3", value: entry3, set: setEntry3 },
      ].map((f, i) => (
        <div key={f.id} className="space-y-1.5">
          <Label htmlFor={f.id}>Thing {i + 1}</Label>
          <Input
            id={f.id}
            value={f.value}
            onChange={(e) => f.set(e.target.value)}
            placeholder="Small and specific beats big and vague"
          />
        </div>
      ))}
      <Button type="submit" disabled={!complete}>
        {current ? "Update this week" : "Save this week"}
      </Button>
    </form>
  );
}

export function GratitudeModule() {
  const { ready, entries, upsertWeek } = useGratitude();
  const weekOf = mondayOfWeek();
  const current = entries.find((e) => e.week_of === weekOf);
  const history = entries.filter((e) => e.week_of !== weekOf);

  return (
    <div className="space-y-10">
      <header>
        <p className="label-technical mb-2">Layer 05 · Learning Loop</p>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="font-mono text-3xl font-semibold text-primary">
            Gratitude Practice
          </h1>
          <p className="measure text-xs text-dimension">
            OPTIONAL · SAVED IN THIS BROWSER
          </p>
        </div>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Three things a week, once a week. The original counting-blessings
          experiment found gratitude journaling improved subjective
          well-being (Emmons &amp; McCullough, 2003); later, larger
          meta-analytic work found the effect is real but more modest than
          its popular reputation suggests (Davis et al., 2016). This is
          offered as a small, pleasant practice — not a transformation.
        </p>
      </header>

      {!ready ? (
        <p className="measure text-xs text-dimension">LOADING…</p>
      ) : (
        <>
          <section className="corner-marks border border-border bg-card p-6">
            <p className="label-technical">Week of {weekOf}</p>
            <WeekForm
              key={current?.id ?? "new"}
              current={current}
              onSave={(fields) => upsertWeek(weekOf, fields)}
            />
          </section>

          {history.length > 0 && (
            <section>
              <h2 className="label-technical">Past weeks · {history.length}</h2>
              <ul className="mt-4 space-y-3">
                {history.map((e) => (
                  <li key={e.id} className="border-l-2 border-border pl-3">
                    <p className="measure text-xs text-dimension">
                      WK {e.week_of}
                    </p>
                    <ul className="mt-1 list-inside list-disc text-sm">
                      <li>{e.entry_1}</li>
                      <li>{e.entry_2}</li>
                      <li>{e.entry_3}</li>
                    </ul>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}
