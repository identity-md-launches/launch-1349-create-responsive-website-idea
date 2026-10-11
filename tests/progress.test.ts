import { describe, expect, it } from 'vitest';
import { categories, items } from '../src/data/checklist';
import { score, scopedItems, toggle, visibleItems } from '../src/lib/progress';
import { buildReport, reportFileName } from '../src/lib/report';
import { STORAGE_KEY, clear, load, save } from '../src/lib/storage';

describe('checklist data', () => {
  it('has unique ids and known categories', () => {
    const ids = new Set(items.map((i) => i.id));
    expect(ids.size).toBe(items.length);
    const known = new Set(categories.map((c) => c.id));
    for (const item of items) expect(known.has(item.category)).toBe(true);
  });

  it('has at least one item per category', () => {
    for (const category of categories) {
      expect(items.some((i) => i.category === category.id)).toBe(true);
    }
  });
});

describe('score and filters', () => {
  it('scores zero when nothing is done', () => {
    expect(score(new Set())).toEqual({ done: 0, total: items.length, percent: 0 });
  });

  it('rounds the percentage', () => {
    const done = new Set([items[0]!.id]);
    const s = score(done);
    expect(s.done).toBe(1);
    expect(s.percent).toBe(Math.round((1 / items.length) * 100));
  });

  it('toggles without mutating the input', () => {
    const start = new Set<string>();
    const on = toggle(start, 'labels');
    expect(start.size).toBe(0);
    expect(on.has('labels')).toBe(true);
    expect(toggle(on, 'labels').has('labels')).toBe(false);
  });

  it('filters by category and by remaining', () => {
    const structure = scopedItems('structure');
    expect(structure.every((i) => i.category === 'structure')).toBe(true);
    const done = new Set(structure.map((i) => i.id));
    expect(visibleItems(done, { filter: 'structure', remainingOnly: true })).toHaveLength(0);
    expect(visibleItems(done, { filter: 'structure', remainingOnly: false })).toHaveLength(structure.length);
    expect(visibleItems(done, { filter: 'all', remainingOnly: true })).toHaveLength(items.length - structure.length);
  });
});

describe('report', () => {
  it('lists every item with its state and a next step for open ones', () => {
    const done = new Set(['landmarks']);
    const text = buildReport({ siteName: 'Example Shop', done, date: new Date('2026-10-11T12:00:00Z') });
    expect(text).toContain('# Agent Ready report: Example Shop');
    expect(text).toContain('Date: 2026-10-11');
    expect(text).toContain(`Score: 1 of ${items.length} items done`);
    expect(text).toContain('- [x] One main landmark and a heading outline');
    expect(text).toContain('- [ ] Native buttons and links for every action');
    expect(text).toContain('  - Next step: Use button for actions');
    for (const category of categories) expect(text).toContain(`## ${category.name} (`);
  });

  it('falls back to an untitled report', () => {
    expect(buildReport({ siteName: '   ', done: new Set() })).toContain('Untitled site');
    expect(reportFileName('')).toBe('agent-ready-report.md');
    expect(reportFileName('My Shop (beta)!')).toBe('agent-ready-my-shop-beta.md');
  });
});

describe('storage', () => {
  it('round-trips and drops unknown ids', () => {
    save({ siteName: 'x', done: ['labels', 'not-an-item'] });
    expect(load()).toEqual({ siteName: 'x', done: ['labels'] });
    clear();
    expect(load()).toEqual({ siteName: '', done: [] });
  });

  it('survives corrupt data', () => {
    window.localStorage.setItem(STORAGE_KEY, '{not json');
    expect(load()).toEqual({ siteName: '', done: [] });
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ done: 'nope', siteName: 5 }));
    expect(load()).toEqual({ siteName: '', done: [] });
  });
});
