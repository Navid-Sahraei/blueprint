"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { ReflectionAnswers } from "@/lib/review/types";

export function ReflectionForm({
  initial,
  onSave,
}: {
  initial?: ReflectionAnswers;
  onSave: (answers: ReflectionAnswers) => void;
}) {
  const [worked, setWorked] = useState(initial?.worked ?? "");
  const [didnt, setDidnt] = useState(initial?.didnt ?? "");
  const [change, setChange] = useState(initial?.change ?? "");
  const complete = worked.trim() && didnt.trim() && change.trim();

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!complete) return;
        onSave({
          worked: worked.trim(),
          didnt: didnt.trim(),
          change: change.trim(),
        });
      }}
    >
      <div className="space-y-1.5">
        <label htmlFor="review-worked" className="text-sm font-medium">
          What worked?
        </label>
        <Textarea
          id="review-worked"
          autoFocus
          value={worked}
          onChange={(e) => setWorked(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="review-didnt" className="text-sm font-medium">
          What didn&rsquo;t?
        </label>
        <Textarea
          id="review-didnt"
          value={didnt}
          onChange={(e) => setDidnt(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="review-change" className="text-sm font-medium">
          One change for next time
        </label>
        <Textarea
          id="review-change"
          value={change}
          onChange={(e) => setChange(e.target.value)}
        />
      </div>
      <Button type="submit" disabled={!complete}>
        {initial ? "Update reflection" : "Save review"}
      </Button>
    </form>
  );
}
