import { createLocalStore } from "@/lib/local-store";
import type { GratitudeEntry } from "./types";

const entriesStore = createLocalStore<GratitudeEntry>(
  "blueprint.gratitude_entries",
);

export const subscribeEntries = entriesStore.subscribe;
export const getEntries = entriesStore.get;
export const replaceEntries = entriesStore.replace;

export { getServerSnapshot } from "@/lib/local-store";
