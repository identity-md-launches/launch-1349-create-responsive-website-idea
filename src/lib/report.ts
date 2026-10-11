import { categories, items } from '../data/checklist';
import { score, type DoneSet } from './progress';

export interface ReportInput {
  siteName: string;
  done: DoneSet;
  /** Injected so tests can pin the date. */
  date?: Date;
}

const isoDate = (d: Date): string => d.toISOString().slice(0, 10);

/** Build the Markdown report that the Download and Copy actions emit. */
export const buildReport = ({ siteName, done, date = new Date() }: ReportInput): string => {
  const name = siteName.trim() || 'Untitled site';
  const total = score(done);
  const lines: string[] = [];

  lines.push(`# Agent Ready report: ${name}`);
  lines.push('');
  lines.push(`Date: ${isoDate(date)}`);
  lines.push(`Score: ${total.done} of ${total.total} items done (${total.percent}%)`);
  lines.push('');

  for (const category of categories) {
    const scoped = items.filter((item) => item.category === category.id);
    const s = score(done, scoped);
    lines.push(`## ${category.name} (${s.done}/${s.total})`);
    lines.push('');
    for (const item of scoped) {
      const mark = done.has(item.id) ? 'x' : ' ';
      lines.push(`- [${mark}] ${item.title}`);
      if (!done.has(item.id)) {
        lines.push(`  - Next step: ${item.how}`);
      }
    }
    lines.push('');
  }

  lines.push('Generated with Agent Ready.');
  return lines.join('\n');
};

export const reportFileName = (siteName: string): string => {
  const slug = siteName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `agent-ready-${slug || 'report'}.md`;
};
