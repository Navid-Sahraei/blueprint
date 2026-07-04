"use client";

import { useState } from "react";

import { ActiveMisogi } from "@/components/misogi/active-misogi";
import { CandidateVault } from "@/components/misogi/candidate-vault";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { isFinished } from "@/lib/misogi/types";
import { useMisogi } from "@/lib/misogi/use-misogi";

export function MisogiModule() {
  const {
    ready,
    candidates,
    sessions,
    debriefs,
    active,
    addCandidate,
    removeCandidate,
    commit,
    standDown,
    addSession,
    saveDebrief,
  } = useMisogi();

  const [error, setError] = useState<string | null>(null);

  const finished = candidates
    .filter(isFinished)
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at));

  return (
    <div className="space-y-10">
      <header>
        <p className="label-technical mb-2">Layer 02 · Big Moves</p>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="font-mono text-3xl font-semibold text-primary">
            Misogi OS
          </h1>
          <p className="measure text-xs text-dimension">
            SAVED IN THIS BROWSER
          </p>
        </div>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          One extremely hard challenge a year, with a genuine chance of
          failure. Mastery experiences are the strongest source of
          self-efficacy (Bandura, 1977), and moderate adversity predicts
          better resilience outcomes than none at all (Seery, Holman &amp;
          Silver, 2010). The modern misogi comes from performance scientist
          Marcus Elliott, popularized in Michael Easter’s The Comfort Crisis
          (2021).
        </p>
      </header>

      {!ready ? (
        <p className="measure text-xs text-dimension">LOADING…</p>
      ) : (
        <>
          {active && (
            <ActiveMisogi
              misogi={active}
              sessions={sessions.filter((s) => s.misogi_id === active.id)}
              onAddSession={(fields) => addSession(active.id, fields)}
              onStandDown={() => standDown(active.id)}
              onDebrief={(outcome, fields) => {
                saveDebrief(active.id, outcome, fields);
              }}
            />
          )}

          <CandidateVault
            candidates={candidates}
            hasActive={active !== null}
            error={error}
            onAdd={(fields) => {
              setError(null);
              addCandidate(fields);
            }}
            onCommit={(id, eventDate) => setError(commit(id, eventDate))}
            onRemove={(c) => {
              if (
                window.confirm(
                  `Delete “${c.title}”? Its training log goes with it.`,
                )
              ) {
                removeCandidate(c.id);
              }
            }}
          />

          {/* Safety note — required copy */}
          <section className="border border-border bg-secondary/50 p-4">
            <p className="text-sm text-muted-foreground">
              <Badge variant="outline" className="mr-2">
                Safety
              </Badge>
              A misogi should be difficult, not reckless. No challenge is
              worth an injury that ends your year — for physically demanding
              challenges, get medical clearance first, tell someone your
              plan, and build in a bail-out point.
            </p>
          </section>

          {finished.length > 0 && (
            <section>
              <h2 className="label-technical">The record · {finished.length}</h2>
              <ul className="mt-4 space-y-4">
                {finished.map((m) => {
                  const debrief = debriefs.find((d) => d.misogi_id === m.id);
                  const trained = sessions.filter(
                    (s) => s.misogi_id === m.id,
                  ).length;
                  return (
                    <li
                      key={m.id}
                      className="corner-marks border border-border bg-card p-5"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="font-mono text-lg font-semibold text-primary">
                          {m.title}
                        </h3>
                        <Badge
                          variant={m.status === "done" ? "default" : "outline"}
                        >
                          {m.status === "done" ? "Done" : "Failed — worth it"}
                        </Badge>
                      </div>
                      <p className="measure mt-1 text-[10px] text-dimension">
                        {m.category.toUpperCase()} · EVENT {m.event_date} ·{" "}
                        {trained} TRAINING SESSIONS
                      </p>
                      {debrief && (
                        <dl className="mt-4 space-y-3 text-sm">
                          <div>
                            <dt className="label-technical">What happened</dt>
                            <dd className="mt-1">{debrief.what_happened}</dd>
                          </div>
                          <div>
                            <dt className="label-technical">What it changed</dt>
                            <dd className="mt-1">{debrief.what_it_changed}</dd>
                          </div>
                          <div>
                            <dt className="label-technical">
                              Seed for next year
                            </dt>
                            <dd className="mt-1">{debrief.next_year_seed}</dd>
                          </div>
                        </dl>
                      )}
                      <div className="mt-4 border-t border-border pt-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            if (
                              window.confirm(
                                `Delete the record of “${m.title}”?`,
                              )
                            ) {
                              removeCandidate(m.id);
                            }
                          }}
                        >
                          Delete record
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          <footer className="border-t border-border pt-6">
            <p className="max-w-2xl text-sm text-muted-foreground">
              The misogi is a practitioner framework, not a clinical protocol
              — the research cited above supports its mechanisms (mastery
              experience, moderate adversity), not the ritual itself. The
              rules are simple: make it genuinely hard, make it matter to
              you, and don’t die. One a year is enough.
            </p>
          </footer>
        </>
      )}
    </div>
  );
}
