import { createLocalStore } from "@/lib/local-store";
import type { DeepWorkSession } from "./types";

const sessionsStore = createLocalStore<DeepWorkSession>(
  "blueprint.deep_work_sessions",
);

export const subscribeSessions = sessionsStore.subscribe;
export const getSessions = sessionsStore.get;
export const replaceSessions = sessionsStore.replace;

export { getServerSnapshot } from "@/lib/local-store";
