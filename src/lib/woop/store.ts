import { createLocalStore, createLocalValueStore } from "@/lib/local-store";
import type { WoopDraft, WoopEntry } from "./types";

const entriesStore = createLocalStore<WoopEntry>("blueprint.woop_entries");
const draftStore = createLocalValueStore<WoopDraft>("blueprint.woop_draft");

export const subscribeEntries = entriesStore.subscribe;
export const getEntries = entriesStore.get;
export const replaceEntries = entriesStore.replace;

export const subscribeDraft = draftStore.subscribe;
export const getDraft = draftStore.get;
export const replaceDraft = draftStore.replace;

export { getServerSnapshot } from "@/lib/local-store";
