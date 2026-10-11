import { items, type CategoryId, type ChecklistItem } from '../data/checklist';

export type DoneSet = ReadonlySet<string>;

export type Filter = 'all' | CategoryId;

export interface Score {
  done: number;
  total: number;
  percent: number;
}

export const score = (done: DoneSet, scope: readonly ChecklistItem[] = items): Score => {
  const total = scope.length;
  const count = scope.filter((item) => done.has(item.id)).length;
  const percent = total === 0 ? 0 : Math.round((count / total) * 100);
  return { done: count, total, percent };
};

export const toggle = (done: DoneSet, id: string): Set<string> => {
  const next = new Set(done);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
};

export interface VisibleOptions {
  filter: Filter;
  remainingOnly: boolean;
}

export const visibleItems = (
  done: DoneSet,
  { filter, remainingOnly }: VisibleOptions,
  scope: readonly ChecklistItem[] = items,
): ChecklistItem[] =>
  scope.filter((item) => {
    if (filter !== 'all' && item.category !== filter) return false;
    if (remainingOnly && done.has(item.id)) return false;
    return true;
  });

/** Items in the current category filter, ignoring the remaining-only switch. */
export const scopedItems = (filter: Filter, scope: readonly ChecklistItem[] = items): ChecklistItem[] =>
  filter === 'all' ? [...scope] : scope.filter((item) => item.category === filter);
