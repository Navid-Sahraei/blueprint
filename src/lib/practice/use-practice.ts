"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

import { todayISO } from "@/lib/dates";
import { getServerSnapshot } from "@/lib/local-store";
import {
  getReflections,
  getSessions,
  getSkills,
  replaceReflections,
  replaceSessions,
  replaceSkills,
  subscribeReflections,
  subscribeSessions,
  subscribeSkills,
} from "./store";

export function usePractice() {
  const skillsSnap = useSyncExternalStore(
    subscribeSkills,
    getSkills,
    getServerSnapshot,
  );
  const sessionsSnap = useSyncExternalStore(
    subscribeSessions,
    getSessions,
    getServerSnapshot,
  );
  const reflectionsSnap = useSyncExternalStore(
    subscribeReflections,
    getReflections,
    getServerSnapshot,
  );

  const ready =
    skillsSnap !== null && sessionsSnap !== null && reflectionsSnap !== null;
  const skills = useMemo(() => skillsSnap ?? [], [skillsSnap]);
  const sessions = useMemo(() => sessionsSnap ?? [], [sessionsSnap]);
  const reflections = useMemo(() => reflectionsSnap ?? [], [reflectionsSnap]);

  const activeSkill = useMemo(
    () => skills.find((s) => s.is_active) ?? null,
    [skills],
  );

  /** One active skill at a time. Returns an error to show, or null. */
  const startSkill = useCallback(
    (fields: {
      skill_name: string;
      feedback_source_description: string;
    }): string | null => {
      if (getSkills().some((s) => s.is_active)) {
        return "One skill at a time — retire the current one before starting another.";
      }
      const now = new Date().toISOString();
      replaceSkills([
        ...getSkills(),
        {
          ...fields,
          id: crypto.randomUUID(),
          start_date: todayISO(),
          is_active: true,
          created_at: now,
          updated_at: now,
        },
      ]);
      return null;
    },
    [],
  );

  const retireSkill = useCallback((id: string) => {
    replaceSkills(
      getSkills().map((s) =>
        s.id === id
          ? { ...s, is_active: false, updated_at: new Date().toISOString() }
          : s,
      ),
    );
  }, []);

  const addSession = useCallback(
    (
      skillId: string,
      fields: {
        date: string;
        duration_minutes: number;
        sub_skill_focus: string;
        feedback_notes: string;
        difficulty_rating: number;
      },
    ) => {
      const now = new Date().toISOString();
      replaceSessions([
        ...getSessions(),
        {
          ...fields,
          id: crypto.randomUUID(),
          skill_id: skillId,
          created_at: now,
          updated_at: now,
        },
      ]);
    },
    [],
  );

  const removeSession = useCallback((id: string) => {
    replaceSessions(getSessions().filter((s) => s.id !== id));
  }, []);

  const upsertReflection = useCallback(
    (skillId: string, monthLabel: string, whatChanged: string) => {
      const all = getReflections();
      const existing = all.find(
        (r) => r.skill_id === skillId && r.month_label === monthLabel,
      );
      if (existing) {
        replaceReflections(
          all.map((r) =>
            r.id === existing.id
              ? {
                  ...r,
                  what_changed: whatChanged,
                  updated_at: new Date().toISOString(),
                }
              : r,
          ),
        );
      } else {
        const now = new Date().toISOString();
        replaceReflections([
          ...all,
          {
            id: crypto.randomUUID(),
            skill_id: skillId,
            month_label: monthLabel,
            what_changed: whatChanged,
            created_at: now,
            updated_at: now,
          },
        ]);
      }
    },
    [],
  );

  return {
    ready,
    skills,
    sessions,
    reflections,
    activeSkill,
    startSkill,
    retireSkill,
    addSession,
    removeSession,
    upsertReflection,
  };
}
