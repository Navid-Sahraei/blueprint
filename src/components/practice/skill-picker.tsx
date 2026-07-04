"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SkillPicker({
  hasHistory,
  error,
  onStart,
}: {
  hasHistory: boolean;
  error: string | null;
  onStart: (fields: {
    skill_name: string;
    feedback_source_description: string;
  }) => void;
}) {
  const [name, setName] = useState("");
  const [feedback, setFeedback] = useState("");

  return (
    <section className="corner-marks border border-border bg-card p-6">
      <p className="label-technical">
        {hasHistory ? "Choose your next skill" : "Choose one skill"}
      </p>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">
        One at a time, for the year. What separates expert performers is the
        structure of practice — specific goals, immediate feedback, working
        at the edge of current ability — not hours logged (Ericsson, Krampe
        &amp; Tesch-Römer, 1993).
      </p>

      <form
        className="mt-5 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim() || !feedback.trim()) return;
          onStart({
            skill_name: name.trim(),
            feedback_source_description: feedback.trim(),
          });
        }}
      >
        <div className="space-y-1.5">
          <Label htmlFor="skill-name">Skill</Label>
          <Input
            id="skill-name"
            required
            autoFocus
            placeholder="Jazz piano improvisation"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="skill-feedback">
            Where will feedback come from?
          </Label>
          <Input
            id="skill-feedback"
            required
            placeholder="A teacher once a week; recording and comparing myself"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Without a feedback source, practice can’t be deliberate — it’s
            just repetition.
          </p>
        </div>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <Button type="submit">Start this skill</Button>
      </form>
    </section>
  );
}
