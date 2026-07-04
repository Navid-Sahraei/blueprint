import { createLocalStore } from "@/lib/local-store";
import type { MonthlyReflection, PracticeSession, PracticeSkill } from "./types";

const skillsStore = createLocalStore<PracticeSkill>("blueprint.practice_skill");
const sessionsStore = createLocalStore<PracticeSession>(
  "blueprint.practice_sessions",
);
const reflectionsStore = createLocalStore<MonthlyReflection>(
  "blueprint.practice_monthly_reflections",
);

export const subscribeSkills = skillsStore.subscribe;
export const getSkills = skillsStore.get;
export const replaceSkills = skillsStore.replace;

export const subscribeSessions = sessionsStore.subscribe;
export const getSessions = sessionsStore.get;
export const replaceSessions = sessionsStore.replace;

export const subscribeReflections = reflectionsStore.subscribe;
export const getReflections = reflectionsStore.get;
export const replaceReflections = reflectionsStore.replace;

export { getServerSnapshot } from "@/lib/local-store";
