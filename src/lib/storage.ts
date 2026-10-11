import { items } from '../data/checklist';

export const STORAGE_KEY = 'agent-ready.v1';

export interface Saved {
  siteName: string;
  done: string[];
}

const knownIds = new Set(items.map((item) => item.id));

export const load = (storage: Storage | undefined = globalThis.localStorage): Saved => {
  const empty: Saved = { siteName: '', done: [] };
  if (!storage) return empty;
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return empty;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return empty;
    const record = parsed as Record<string, unknown>;
    const siteName = typeof record.siteName === 'string' ? record.siteName.slice(0, 120) : '';
    const done = Array.isArray(record.done)
      ? record.done.filter((id): id is string => typeof id === 'string' && knownIds.has(id))
      : [];
    return { siteName, done };
  } catch {
    return empty;
  }
};

export const save = (value: Saved, storage: Storage | undefined = globalThis.localStorage): void => {
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Storage may be full or blocked (private mode). The page still works for this session.
  }
};

export const clear = (storage: Storage | undefined = globalThis.localStorage): void => {
  try {
    storage?.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
};
