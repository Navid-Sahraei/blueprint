"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

import { getServerSnapshot } from "@/lib/local-store";
import { getReviews, replaceReviews, subscribeReviews } from "./store";
import { composeReflection } from "./types";
import type { PeriodType, ReflectionAnswers, SummarySnapshot } from "./types";

export function useReview() {
  const snap = useSyncExternalStore(
    subscribeReviews,
    getReviews,
    getServerSnapshot,
  );

  const ready = snap !== null;
  const reviews = useMemo(
    () =>
      [...(snap ?? [])].sort((a, b) => b.created_at.localeCompare(a.created_at)),
    [snap],
  );

  const findReview = useCallback(
    (periodType: PeriodType, periodLabel: string) =>
      reviews.find(
        (r) => r.period_type === periodType && r.period_label === periodLabel,
      ) ?? null,
    [reviews],
  );

  const saveReview = useCallback(
    (
      periodType: PeriodType,
      periodLabel: string,
      snapshot: SummarySnapshot,
      answers: ReflectionAnswers,
    ) => {
      const now = new Date().toISOString();
      const existing = getReviews().find(
        (r) => r.period_type === periodType && r.period_label === periodLabel,
      );
      const reflection_text = composeReflection(answers);
      if (existing) {
        replaceReviews(
          getReviews().map((r) =>
            r.id === existing.id
              ? { ...r, reflection_text, updated_at: now }
              : r,
          ),
        );
      } else {
        replaceReviews([
          ...getReviews(),
          {
            id: crypto.randomUUID(),
            period_type: periodType,
            period_label: periodLabel,
            summary_snapshot: snapshot,
            reflection_text,
            created_at: now,
            updated_at: now,
          },
        ]);
      }
    },
    [],
  );

  const removeReview = useCallback((id: string) => {
    replaceReviews(getReviews().filter((r) => r.id !== id));
  }, []);

  return { ready, reviews, findReview, saveReview, removeReview };
}
