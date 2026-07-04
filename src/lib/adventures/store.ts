import { createLocalStore } from "@/lib/local-store";
import type { Adventure } from "./types";

const adventuresStore = createLocalStore<Adventure>("blueprint.adventures");

export const subscribeAdventures = adventuresStore.subscribe;
export const getAdventures = adventuresStore.get;
export const replaceAdventures = adventuresStore.replace;

export { getServerSnapshot } from "@/lib/local-store";
