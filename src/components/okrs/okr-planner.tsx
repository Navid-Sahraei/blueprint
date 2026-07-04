"use client";

import { useMemo, useState, useSyncExternalStore } from "react";

import { ModuleHeader } from "@/components/module-header";
import { KeyResultRow } from "@/components/okrs/key-result-row";
import { ValuesStrip } from "@/components/okrs/values-strip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { currentQuarter, shiftQuarter } from "@/lib/dates";
import { getServerSnapshot } from "@/lib/local-store";
import { KR_MAX, objectiveProgress } from "@/lib/okrs/types";
import { useOkrs } from "@/lib/okrs/use-okrs";
import { getReviews, subscribeReviews } from "@/lib/review/store";
import { parseReflection } from "@/lib/review/types";
import { cn } from "@/lib/utils";

function ObjectiveForm({
  quarter,
  initialText,
  onSave,
  onCancel,
}: {
  quarter: string;
  initialText?: string;
  onSave: (text: string) => void;
  onCancel?: () => void;
}) {
  const [text, setText] = useState(initialText ?? "");
  return (
    <form
      className="mt-4 space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (!text.trim()) return;
        onSave(text.trim());
      }}
    >
      <div className="space-y-1.5">
        <Label htmlFor="objective-text">Objective for {quarter}</Label>
        <Input
          id="objective-text"
          required
          placeholder="Ship the first paid version to real users"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Specific and challenging beats vague and easy — the core finding of
          goal-setting theory (Locke &amp; Latham, 2002).
        </p>
      </div>
      <div className="flex gap-3">
        <Button type="submit">
          {initialText ? "Save objective" : "Set the objective"}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

function AddKeyResultForm({
  onAdd,
}: {
  onAdd: (fields: {
    kr_text: string;
    target_value: number;
    unit: string;
  }) => void;
}) {
  const [text, setText] = useState("");
  const [target, setTarget] = useState("");
  const [unit, setUnit] = useState("");
  const [invalid, setInvalid] = useState<string | null>(null);

  return (
    <form
      className="mt-4 space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        const targetNum = Number(target);
        if (!text.trim()) return;
        if (!Number.isFinite(targetNum) || targetNum <= 0) {
          setInvalid("Target must be a number above zero.");
          return;
        }
        setInvalid(null);
        onAdd({
          kr_text: text.trim(),
          target_value: targetNum,
          unit: unit.trim(),
        });
        setText("");
        setTarget("");
        setUnit("");
      }}
    >
      <div className="grid gap-3 sm:grid-cols-[1fr_7rem_8rem]">
        <div className="space-y-1.5">
          <Label htmlFor="kr-text">Key result</Label>
          <Input
            id="kr-text"
            required
            placeholder="Onboard beta users"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="kr-target">Target</Label>
          <Input
            id="kr-target"
            required
            type="number"
            min={0}
            step="any"
            placeholder="20"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="kr-unit">Unit</Label>
          <Input
            id="kr-unit"
            placeholder="users, km, %"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          />
        </div>
      </div>
      {invalid && (
        <p role="alert" className="text-sm text-destructive">
          {invalid}
        </p>
      )}
      <Button type="submit" size="sm">
        Add key result
      </Button>
    </form>
  );
}

export function OkrPlanner() {
  const {
    ready,
    createObjective,
    updateObjective,
    removeObjective,
    addKeyResult,
    updateKeyResult,
    removeKeyResult,
    objectiveForQuarter,
    keyResultsFor,
  } = useOkrs();

  const [quarter, setQuarter] = useState(currentQuarter());
  const [editingObjective, setEditingObjective] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const objective = objectiveForQuarter(quarter);
  const krs = objective ? keyResultsFor(objective.id) : [];
  const pct = Math.round(objectiveProgress(krs) * 100);
  const year = quarter.split("-Q")[0];

  // Cadence made visible: the newest key-result touch is the last check-in.
  const lastCheckIn =
    krs.length > 0
      ? krs.reduce(
          (max, kr) => (kr.updated_at > max ? kr.updated_at : max),
          krs[0].updated_at,
        )
      : null;

  // Kolb's cycle, closed: the last review's "one change" greets the next
  // quarter's objective.
  const reviewsSnap = useSyncExternalStore(
    subscribeReviews,
    getReviews,
    getServerSnapshot,
  );
  const lastReviewChange = useMemo(() => {
    const latest = [...(reviewsSnap ?? [])].sort((a, b) =>
      b.created_at.localeCompare(a.created_at),
    )[0];
    if (!latest) return null;
    const change = parseReflection(latest.reflection_text).change;
    return change ? { period: latest.period_label, change } : null;
  }, [reviewsSnap]);

  function handleCreate(text: string) {
    setError(createObjective(quarter, text));
  }

  function handleAddKr(fields: {
    kr_text: string;
    target_value: number;
    unit: string;
  }) {
    if (objective) setError(addKeyResult(objective.id, fields));
  }

  return (
    <div className="space-y-10">
      <ModuleHeader
        layer="Layer 01 · Direction"
        title="Annual Goals / OKRs"
        meta={`${currentQuarter()} · SAVED IN THIS BROWSER`}
      >
        One objective per quarter, made measurable by two to four key
        results. The format comes from Andy Grove (High Output Management,
        1983), popularized by John Doerr (Measure What Matters, 2018). The
        mechanism underneath is one of the best-replicated findings in
        organizational psychology: specific, challenging goals reliably
        outperform vague “do your best” goals — given ability and commitment
        (Locke &amp; Latham, 2002).
      </ModuleHeader>

      {!ready ? (
        <p className="measure text-xs text-dimension">LOADING…</p>
      ) : (
        <>
          <ValuesStrip />

          {/* Year strip */}
          <section>
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="label-technical">The year — {year}</h2>
              {quarter !== currentQuarter() && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setQuarter(currentQuarter())}
                >
                  Jump to current quarter
                </Button>
              )}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[1, 2, 3, 4].map((q) => {
                const label = `${year}-Q${q}`;
                const obj = objectiveForQuarter(label);
                const objPct = obj
                  ? Math.round(objectiveProgress(keyResultsFor(obj.id)) * 100)
                  : null;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setQuarter(label)}
                    className={cn(
                      "border bg-card p-3 text-left transition-colors",
                      label === quarter
                        ? "border-primary"
                        : "border-border hover:border-primary",
                    )}
                  >
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="measure text-xs text-dimension">
                        Q{q}
                      </span>
                      <span className="measure text-xs text-dimension">
                        {objPct !== null ? `${objPct}%` : "—"}
                      </span>
                    </span>
                    <span className="mt-1 line-clamp-2 block min-h-8 text-xs text-muted-foreground">
                      {obj ? obj.objective_text : "No objective"}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Quarter panel */}
          {objective ? (
            <section className="corner-marks border border-border bg-card p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    variant="ghost"
                    aria-label="Previous quarter"
                    onClick={() => setQuarter(shiftQuarter(quarter, -1))}
                  >
                    ‹
                  </Button>
                  <p className="label-technical">Objective · {quarter}</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    aria-label="Next quarter"
                    onClick={() => setQuarter(shiftQuarter(quarter, 1))}
                  >
                    ›
                  </Button>
                </div>
                <p className="measure text-xs text-dimension">
                  PROGRESS {pct}%
                  {lastCheckIn && ` · CHECKED ${lastCheckIn.slice(0, 10)}`}
                </p>
              </div>

              {editingObjective ? (
                <ObjectiveForm
                  quarter={quarter}
                  initialText={objective.objective_text}
                  onSave={(text) => {
                    updateObjective(objective.id, text);
                    setEditingObjective(false);
                  }}
                  onCancel={() => setEditingObjective(false)}
                />
              ) : (
                <>
                  <h2 className="mt-2 font-mono text-2xl font-semibold text-primary">
                    {objective.objective_text}
                  </h2>
                  <div
                    className="relative mt-4 h-1.5 w-full bg-muted"
                    aria-hidden
                  >
                    <div
                      className="h-full bg-accent"
                      style={{ width: `${pct}%` }}
                    />
                    {/* Stretch mark: ~70% on a stretch objective is success. */}
                    <div
                      className="absolute left-[70%] top-[-3px] h-3 w-px bg-dimension"
                      title="≈70% on a stretch objective counts as success (Doerr, 2018)"
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    The tick sits at 70% — on a genuine stretch objective
                    that&rsquo;s success. Routinely finishing at 100% means
                    the target was set too low (Doerr, 2018).
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingObjective(true)}
                    >
                      Edit objective
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Delete the ${quarter} objective? Its key results go with it.`,
                          )
                        ) {
                          removeObjective(objective.id);
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </>
              )}

              <div className="mt-8">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="label-technical">
                    Key results · {krs.length}/{KR_MAX}
                  </h3>
                  <p className="hidden text-xs text-muted-foreground sm:block">
                    Check in weekly — goals work best with feedback on
                    progress (Locke &amp; Latham, 2002).
                  </p>
                </div>

                {krs.length === 0 && (
                  <p className="mt-3 text-sm text-muted-foreground">
                    No key results yet. Without a measure, an objective is a
                    wish — add two to four below.
                  </p>
                )}
                {krs.length === 1 && (
                  <p className="mt-3 text-sm text-muted-foreground">
                    One measure rarely captures an objective — aim for two to
                    four key results.
                  </p>
                )}

                <ul className="mt-4 space-y-3">
                  {krs.map((kr) => (
                    <KeyResultRow
                      key={kr.id}
                      kr={kr}
                      onUpdate={(patch) => updateKeyResult(kr.id, patch)}
                      onRemove={() => removeKeyResult(kr.id)}
                    />
                  ))}
                </ul>

                {error && (
                  <p role="alert" className="mt-3 text-sm text-destructive">
                    {error}
                  </p>
                )}

                {krs.length < KR_MAX && <AddKeyResultForm onAdd={handleAddKr} />}
              </div>
            </section>
          ) : (
            <section className="border border-dashed border-border p-6">
              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  variant="ghost"
                  aria-label="Previous quarter"
                  onClick={() => setQuarter(shiftQuarter(quarter, -1))}
                >
                  ‹
                </Button>
                <p className="label-technical">No objective for {quarter}</p>
                <Button
                  size="sm"
                  variant="ghost"
                  aria-label="Next quarter"
                  onClick={() => setQuarter(shiftQuarter(quarter, 1))}
                >
                  ›
                </Button>
              </div>
              {error && (
                <p role="alert" className="mt-2 text-sm text-destructive">
                  {error}
                </p>
              )}
              {lastReviewChange && (
                <div className="mt-4 max-w-xl border-l-2 border-accent bg-secondary/50 p-3">
                  <p className="label-technical mb-1">
                    From your {lastReviewChange.period} review
                  </p>
                  <p className="text-sm">“{lastReviewChange.change}”</p>
                </div>
              )}
              <ObjectiveForm quarter={quarter} onSave={handleCreate} />
            </section>
          )}

          {/* Honesty note */}
          <footer className="border-t border-border pt-6">
            <p className="max-w-2xl text-sm text-muted-foreground">
              Grove’s and Doerr’s books are practitioner frameworks; the
              research grounding is Locke &amp; Latham’s 35-year program on
              goal-setting theory. The effect belongs to goals that are
              specific and challenging, and that you actually commit to — an
              easy or vague objective forfeits it.
            </p>
          </footer>
        </>
      )}
    </div>
  );
}
