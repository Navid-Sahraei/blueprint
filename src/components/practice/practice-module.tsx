"use client";

import { useState } from "react";

import { MonthlyReflectionSection } from "@/components/practice/monthly-reflection";
import { SessionHistory, SessionLogger } from "@/components/practice/session-logger";
import { SkillPicker } from "@/components/practice/skill-picker";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { usePractice } from "@/lib/practice/use-practice";

export function PracticeModule() {
  const {
    ready,
    skills,
    sessions,
    reflections,
    activeSkill,
    startSkill,
    retireSkill,
    addSession,
    upsertReflection,
  } = usePractice();

  const [error, setError] = useState<string | null>(null);

  const retired = skills.filter((s) => !s.is_active);
  const skillSessions = activeSkill
    ? sessions.filter((s) => s.skill_id === activeSkill.id)
    : [];
  const skillReflections = activeSkill
    ? reflections.filter((r) => r.skill_id === activeSkill.id)
    : [];

  return (
    <div className="space-y-10">
      <header>
        <p className="label-technical mb-2">Layer 04 · Growth &amp; Mastery</p>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="font-mono text-3xl font-semibold text-primary">
            Deliberate Practice Tracker
          </h1>
          <p className="measure text-xs text-dimension">
            SAVED IN THIS BROWSER
          </p>
        </div>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Structured, feedback-driven practice toward one skill over the
          year — distinct from the once-a-year Misogi event; this is a
          continuous track. Ericsson, Krampe &amp; Tesch-Römer (1993) found
          that what separates expert performers is the structure of
          practice, not raw hours; popularized in Ericsson &amp; Pool’s
          Peak (2016).
        </p>
      </header>

      {!ready ? (
        <p className="measure text-xs text-dimension">LOADING…</p>
      ) : activeSkill ? (
        <>
          <section className="corner-marks border border-border bg-card p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="label-technical">Active skill</p>
              <p className="measure text-xs text-dimension">
                SINCE {activeSkill.start_date}
              </p>
            </div>
            <h2 className="mt-2 font-mono text-2xl font-semibold text-primary">
              {activeSkill.skill_name}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Feedback from: {activeSkill.feedback_source_description}
            </p>
            <div className="mt-4">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  if (
                    window.confirm(
                      `Retire “${activeSkill.skill_name}”? Its sessions and reflections stay in your history.`,
                    )
                  ) {
                    retireSkill(activeSkill.id);
                  }
                }}
              >
                Retire this skill
              </Button>
            </div>

            <Separator className="my-6" />

            <h3 className="label-technical">Log a session</h3>
            <div className="mt-4">
              <SessionLogger
                onAdd={(fields) => addSession(activeSkill.id, fields)}
              />
            </div>

            <Separator className="my-6" />

            <h3 className="label-technical">
              Session history · {skillSessions.length}
            </h3>
            <div className="mt-4">
              <SessionHistory sessions={skillSessions} />
            </div>

            <Separator className="my-6" />

            <MonthlyReflectionSection
              reflections={skillReflections}
              onSave={(month, text) =>
                upsertReflection(activeSkill.id, month, text)
              }
            />
          </section>
        </>
      ) : (
        <SkillPicker
          hasHistory={retired.length > 0}
          error={error}
          onStart={(fields) => setError(startSkill(fields))}
        />
      )}

      {retired.length > 0 && (
        <section>
          <h2 className="label-technical">Past skills · {retired.length}</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {retired.map((s) => {
              const count = sessions.filter((x) => x.skill_id === s.id).length;
              return (
                <li
                  key={s.id}
                  className="border border-border bg-card p-4"
                >
                  <p className="font-medium">{s.skill_name}</p>
                  <p className="measure mt-1 text-[10px] text-dimension">
                    {s.start_date} · {count} SESSION{count === 1 ? "" : "S"}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <footer className="border-t border-border pt-6">
        <p className="max-w-2xl text-sm text-muted-foreground">
          There is deliberately no hours-accumulated total anywhere in this
          module. Malcolm Gladwell’s “10,000-hour rule” (Outliers, 2008) is a
          simplification Ericsson himself publicly disputed — the defining
          variable is the structure of practice, not the clock.
        </p>
      </footer>
    </div>
  );
}
