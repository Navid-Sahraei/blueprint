import { createLocalStore, createLocalValueStore } from "@/lib/local-store";
import type { SortDraft, ValueRow } from "./types";

const valuesStore = createLocalStore<ValueRow>("blueprint.values");
const draftStore = createLocalValueStore<SortDraft>(
  "blueprint.values_sort_draft",
);

export const subscribeValues = valuesStore.subscribe;
export const getValues = valuesStore.get;
export const replaceValues = valuesStore.replace;

export const subscribeDraft = draftStore.subscribe;
export const getDraft = draftStore.get;
export const replaceDraft = draftStore.replace;

export { getServerSnapshot } from "@/lib/local-store";
