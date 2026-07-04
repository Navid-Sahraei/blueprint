/**
 * Local-first table store: rows live in this browser's localStorage, fronted
 * by an in-memory cache so components can subscribe via useSyncExternalStore.
 * Each module's row shapes match its tables in supabase/migrations, so
 * moving to Supabase later means swapping read/write internals only.
 */

type Listener = () => void;

/** Server snapshot: no data during SSR; components render a loading state. */
export function getServerSnapshot(): null {
  return null;
}

export interface LocalStore<T> {
  subscribe: (listener: Listener) => () => void;
  get: () => T[];
  replace: (rows: T[]) => void;
}

export function createLocalStore<T>(storageKey: string): LocalStore<T> {
  let cache: T[] | null = null;
  const listeners = new Set<Listener>();

  function readFromStorage(): T[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(storageKey);
      return raw ? (JSON.parse(raw) as T[]) : [];
    } catch {
      return [];
    }
  }

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    get() {
      if (cache === null) cache = readFromStorage();
      return cache;
    },
    replace(rows) {
      cache = rows;
      if (typeof window !== "undefined") {
        window.localStorage.setItem(storageKey, JSON.stringify(rows));
      }
      for (const listener of listeners) listener();
    },
  };
}
