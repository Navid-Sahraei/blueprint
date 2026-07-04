import { createLocalStore } from "@/lib/local-store";
import type { KeyResult, Objective } from "./types";

const objectivesStore = createLocalStore<Objective>("blueprint.objectives");
const keyResultsStore = createLocalStore<KeyResult>("blueprint.key_results");

export const subscribeObjectives = objectivesStore.subscribe;
export const getObjectives = objectivesStore.get;
export const replaceObjectives = objectivesStore.replace;

export const subscribeKeyResults = keyResultsStore.subscribe;
export const getKeyResults = keyResultsStore.get;
export const replaceKeyResults = keyResultsStore.replace;

export { getServerSnapshot } from "@/lib/local-store";
