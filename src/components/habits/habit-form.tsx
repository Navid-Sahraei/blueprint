"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Habit, HabitFields } from "@/lib/habits/types";

/**
 * The four-field install method. Each hint names the technique's source,
 * per the product's content standards.
 */
const FIELDS: Array<{
  key: keyof Omit<HabitFields, "title">;
  label: string;
  placeholder: string;
  hint: string;
  multiline?: boolean;
}> = [
  {
    key: "tiny_version",
    label: "Tiny version",
    placeholder: "Read one page",
    hint: "Scale it down until it is almost too small to fail (Fogg, Tiny Habits, 2019).",
  },
  {
    key: "anchor",
    label: "Anchor",
    placeholder: "After I pour my evening tea…",
    hint: "The existing routine this attaches to — habits run on cues (Wood & Neal, 2007).",
  },
  {
    key: "implementation_intention",
    label: "If-then plan",
    placeholder: "If it’s 9pm and the tea is poured, then I read one page on the couch.",
    hint: "A concrete if-then plan roughly doubles follow-through (Gollwitzer, 1999).",
    multiline: true,
  },
  {
    key: "identity_line",
    label: "Identity line",
    placeholder: "I’m someone who reads every day.",
    hint: "Tie the habit to who you’re becoming, not just what you do (Clear, Atomic Habits, 2018).",
  },
];

export function HabitForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Habit;
  onSave: (fields: HabitFields) => void;
  onCancel: () => void;
}) {
  const [fields, setFields] = useState<HabitFields>({
    title: initial?.title ?? "",
    tiny_version: initial?.tiny_version ?? "",
    anchor: initial?.anchor ?? "",
    implementation_intention: initial?.implementation_intention ?? "",
    identity_line: initial?.identity_line ?? "",
  });

  const set =
    (key: keyof HabitFields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFields((f) => ({ ...f, [key]: e.target.value }));

  return (
    <form
      className="mt-4 space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (!fields.title.trim()) return;
        onSave({ ...fields, title: fields.title.trim() });
      }}
    >
      <div className="space-y-1.5">
        <Label htmlFor="habit-title">Habit</Label>
        <Input
          id="habit-title"
          required
          placeholder="Read before bed"
          value={fields.title}
          onChange={set("title")}
        />
      </div>

      {FIELDS.map((f) => (
        <div key={f.key} className="space-y-1.5">
          <Label htmlFor={`habit-${f.key}`}>{f.label}</Label>
          {f.multiline ? (
            <Textarea
              id={`habit-${f.key}`}
              placeholder={f.placeholder}
              value={fields[f.key]}
              onChange={set(f.key)}
            />
          ) : (
            <Input
              id={`habit-${f.key}`}
              placeholder={f.placeholder}
              value={fields[f.key]}
              onChange={set(f.key)}
            />
          )}
          <p className="text-xs text-muted-foreground">{f.hint}</p>
        </div>
      ))}

      <div className="flex gap-3">
        <Button type="submit">{initial ? "Save changes" : "Add to backlog"}</Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
