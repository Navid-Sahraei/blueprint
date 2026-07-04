"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

import { currentQuarter, todayISO } from "@/lib/dates";
import {
  getHabits,
  getReviews,
  getServerSnapshot,
  replaceHabits,
  replaceReviews,
  subscribeHabits,
  subscribeReviews,
} from "./store";
import type {
  Habit,
  HabitFields,
  HabitStatus,
  HabitWeeklyReview,
} from "./types";

function patchHabit(id: string, patch: Partial<Habit>): void {
  replaceHabits(
    getHabits().map((h) =>
      h.id === id
        ? { ...h, ...patch, updated_at: new Date().toISOString() }
        : h,
    ),
  );
}

export function useHabits() {
  const habitsSnap = useSyncExternalStore(
    subscribeHabits,
    getHabits,
    getServerSnapshot,
  );
  const reviewsSnap = useSyncExternalStore(
    subscribeReviews,
    getReviews,
    getServerSnapshot,
  );

  const ready = habitsSnap !== null && reviewsSnap !== null;
  const habits = useMemo(() => habitsSnap ?? [], [habitsSnap]);
  const reviews = useMemo(() => reviewsSnap ?? [], [reviewsSnap]);

  const addHabit = useCallback((fields: HabitFields) => {
    const now = new Date().toISOString();
    replaceHabits([
      ...getHabits(),
      {
        ...fields,
        id: crypto.randomUUID(),
        status: "backlog",
        quarter: null,
        start_date: null,
        created_at: now,
        updated_at: now,
      },
    ]);
  }, []);

  const updateHabit = useCallback((id: string, patch: Partial<Habit>) => {
    patchHabit(id, patch);
  }, []);

  const removeHabit = useCallback((id: string) => {
    replaceHabits(getHabits().filter((h) => h.id !== id));
    replaceReviews(getReviews().filter((r) => r.habit_id !== id));
  }, []);

  /** Enforces the one-install-at-a-time rule. Returns an error to show, or null. */
  const beginInstall = useCallback((id: string): string | null => {
    if (getHabits().some((h) => h.status === "installing")) {
      return "One habit at a time — finish or drop the current install before starting another.";
    }
    patchHabit(id, {
      status: "installing",
      start_date: todayISO(),
      quarter: currentQuarter(),
    });
    return null;
  }, []);

  const setStatus = useCallback((id: string, status: HabitStatus) => {
    // A habit revived into the backlog starts fresh on its next install.
    patchHabit(
      id,
      status === "backlog"
        ? { status, start_date: null, quarter: null }
        : { status },
    );
  }, []);

  const upsertReview = useCallback(
    (
      habitId: string,
      weekOf: string,
      fields: Pick<
        HabitWeeklyReview,
        "days_completed" | "friction_note" | "adjustment_note"
      >,
    ) => {
      const all = getReviews();
      const existing = all.find(
        (r) => r.habit_id === habitId && r.week_of === weekOf,
      );
      if (existing) {
        replaceReviews(
          all.map((r) => (r.id === existing.id ? { ...existing, ...fields } : r)),
        );
      } else {
        replaceReviews([
          ...all,
          {
            ...fields,
            id: crypto.randomUUID(),
            habit_id: habitId,
            week_of: weekOf,
            created_at: new Date().toISOString(),
          },
        ]);
      }
    },
    [],
  );

  const installing = useMemo(
    () => habits.find((h) => h.status === "installing") ?? null,
    [habits],
  );

  return {
    ready,
    habits,
    reviews,
    installing,
    addHabit,
    updateHabit,
    removeHabit,
    beginInstall,
    setStatus,
    upsertReview,
  };
}
