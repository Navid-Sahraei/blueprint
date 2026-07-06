"use client";

import { useSyncExternalStore } from "react";

import { getAdventures, subscribeAdventures } from "@/lib/adventures/store";
import {
  getSessions as getDeepWorkSessions,
  subscribeSessions as subscribeDeepWorkSessions,
} from "@/lib/deepwork/store";
import { getEntries as getGratitude, subscribeEntries as subscribeGratitude } from "@/lib/gratitude/store";
import { getHabits, subscribeHabits } from "@/lib/habits/store";
import { getPlans, subscribePlans } from "@/lib/lifedesign/store";
import { getServerSnapshot } from "@/lib/local-store";
import { getCandidates, subscribeCandidates } from "@/lib/misogi/store";
import {
  getActiveSlugs,
  subscribeActiveSlugs,
} from "@/lib/modules/active-store";
import { getKeyResults, getObjectives, subscribeKeyResults, subscribeObjectives } from "@/lib/okrs/store";
import {
  getSessions as getPracticeSessions,
  getSkills as getPracticeSkills,
  subscribeSessions as subscribePracticeSessions,
  subscribeSkills as subscribePracticeSkills,
} from "@/lib/practice/store";
import { getReviews, subscribeReviews } from "@/lib/review/store";
import { getValues, subscribeValues } from "@/lib/values/store";
import { getEntries as getWoopEntries, subscribeEntries as subscribeWoopEntries } from "@/lib/woop/store";

/** One subscription point for every module's local store — the dashboard's data source. */
export function useAllModuleData() {
  const activeSlugs = useSyncExternalStore(subscribeActiveSlugs, getActiveSlugs, getServerSnapshot);
  const values = useSyncExternalStore(subscribeValues, getValues, getServerSnapshot);
  const plans = useSyncExternalStore(subscribePlans, getPlans, getServerSnapshot);
  const objectives = useSyncExternalStore(subscribeObjectives, getObjectives, getServerSnapshot);
  const keyResults = useSyncExternalStore(subscribeKeyResults, getKeyResults, getServerSnapshot);
  const habits = useSyncExternalStore(subscribeHabits, getHabits, getServerSnapshot);
  const misogiCandidates = useSyncExternalStore(subscribeCandidates, getCandidates, getServerSnapshot);
  const adventures = useSyncExternalStore(subscribeAdventures, getAdventures, getServerSnapshot);
  const deepWorkSessions = useSyncExternalStore(subscribeDeepWorkSessions, getDeepWorkSessions, getServerSnapshot);
  const woopEntries = useSyncExternalStore(subscribeWoopEntries, getWoopEntries, getServerSnapshot);
  const practiceSkills = useSyncExternalStore(subscribePracticeSkills, getPracticeSkills, getServerSnapshot);
  const practiceSessions = useSyncExternalStore(subscribePracticeSessions, getPracticeSessions, getServerSnapshot);
  const reviews = useSyncExternalStore(subscribeReviews, getReviews, getServerSnapshot);
  const gratitude = useSyncExternalStore(subscribeGratitude, getGratitude, getServerSnapshot);

  const ready = [
    activeSlugs,
    values,
    plans,
    objectives,
    keyResults,
    habits,
    misogiCandidates,
    adventures,
    deepWorkSessions,
    woopEntries,
    practiceSkills,
    practiceSessions,
    reviews,
    gratitude,
  ].every((x) => x !== null);

  return {
    ready,
    activeSlugs: activeSlugs ?? [],
    values: values ?? [],
    plans: plans ?? [],
    objectives: objectives ?? [],
    keyResults: keyResults ?? [],
    habits: habits ?? [],
    misogiCandidates: misogiCandidates ?? [],
    adventures: adventures ?? [],
    deepWorkSessions: deepWorkSessions ?? [],
    woopEntries: woopEntries ?? [],
    practiceSkills: practiceSkills ?? [],
    practiceSessions: practiceSessions ?? [],
    reviews: reviews ?? [],
    gratitude: gratitude ?? [],
  };
}

export type AllModuleData = ReturnType<typeof useAllModuleData>;
