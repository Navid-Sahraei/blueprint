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

/** Single-value variant for UI drafts (e.g. a half-finished card sort). */
export interface LocalValueStore<T> {
  subscribe: (listener: Listener) => () => void;
  get: () => T | null;
  replace: (value: T | null) => void;
}

export function createLocalValueStore<T>(
  storageKey: string,
): LocalValueStore<T> {
  let cache: T | null | undefined;
  const listeners = new Set<Listener>();

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    get() {
      if (cache === undefined) {
        if (typeof window === "undefined") return null;
        try {
          const raw = window.localStorage.getItem(storageKey);
          cache = raw ? (JSON.parse(raw) as T) : null;
        } catch {
          cache = null;
        }
      }
      return cache;
    },
    replace(value) {
      cache = value;
      if (typeof window !== "undefined") {
        if (value === null) window.localStorage.removeItem(storageKey);
        else window.localStorage.setItem(storageKey, JSON.stringify(value));
      }
      for (const listener of listeners) listener();
    },
  };
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
