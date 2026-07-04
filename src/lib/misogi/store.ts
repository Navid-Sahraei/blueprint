import { createLocalStore } from "@/lib/local-store";
import type {
  MisogiCandidate,
  MisogiDebrief,
  TrainingSession,
} from "./types";

const candidatesStore = createLocalStore<MisogiCandidate>(
  "blueprint.misogi_candidates",
);
const trainingStore = createLocalStore<TrainingSession>(
  "blueprint.misogi_training_log",
);
const debriefStore = createLocalStore<MisogiDebrief>(
  "blueprint.misogi_debrief",
);

export const subscribeCandidates = candidatesStore.subscribe;
export const getCandidates = candidatesStore.get;
export const replaceCandidates = candidatesStore.replace;

export const subscribeTraining = trainingStore.subscribe;
export const getTraining = trainingStore.get;
export const replaceTraining = trainingStore.replace;

export const subscribeDebriefs = debriefStore.subscribe;
export const getDebriefs = debriefStore.get;
export const replaceDebriefs = debriefStore.replace;

export { getServerSnapshot } from "@/lib/local-store";
