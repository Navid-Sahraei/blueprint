import { createLocalStore } from "@/lib/local-store";

/**
 * Explicit user activations (method slugs). A method also counts as active
 * if it already has data — see isActive() in module-data.ts — so existing
 * work never disappears behind a dimmed "not yet active" card.
 */
const activeStore = createLocalStore<string>("blueprint.active_modules");

export const subscribeActiveSlugs = activeStore.subscribe;
export const getActiveSlugs = activeStore.get;

export function activateModule(slug: string): void {
  const current = activeStore.get();
  if (!current.includes(slug)) activeStore.replace([...current, slug]);
}

export { getServerSnapshot } from "@/lib/local-store";
