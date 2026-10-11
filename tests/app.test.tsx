import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from '../src/App';
import { items } from '../src/data/checklist';
import { STORAGE_KEY } from '../src/lib/storage';

const total = items.length;

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders the product and its main action on the page', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: 'Make your site agent-ready' })).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getAllByRole('checkbox', { name: /./ })).toHaveLength(total + 1); // items + remaining-only switch
    expect(screen.getByRole('button', { name: 'Download report' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Skip to checklist' })).toHaveAttribute('href', '#checklist');
  });

  it('updates the score when items are ticked and persists them', async () => {
    const user = userEvent.setup();
    render(<App />);
    const first = screen.getByRole('checkbox', { name: items[0]!.title });
    await user.click(first);
    expect(first).toBeChecked();
    expect(screen.getByText(`1 of ${total} done`)).toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}')).toMatchObject({ done: [items[0]!.id] });

    await user.click(first);
    expect(screen.getByText(`0 of ${total} done`)).toBeInTheDocument();
  });

  it('restores saved progress on load', () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ siteName: 'Saved site', done: ['labels', 'robots'] }));
    render(<App />);
    expect(screen.getByText(`2 of ${total} done`)).toBeInTheDocument();
    expect(screen.getByLabelText('Site name')).toHaveValue('Saved site');
    expect(screen.getByRole('checkbox', { name: /Every field has a visible, bound label/ })).toBeChecked();
  });

  it('filters by category and shows an empty state when a category is complete', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('radio', { name: /^Trust/ }));
    const trustItems = items.filter((i) => i.category === 'trust');
    expect(screen.getByRole('heading', { level: 2, name: 'Trust items' })).toBeInTheDocument();
    expect(screen.getByText(`Showing ${trustItems.length} of ${trustItems.length}`)).toBeInTheDocument();

    for (const item of trustItems) {
      await user.click(screen.getByRole('checkbox', { name: item.title }));
    }
    await user.click(screen.getByRole('checkbox', { name: 'Show only remaining items' }));
    expect(screen.getByText('Everything here is done')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Show all items' }));
    expect(screen.getByRole('radio', { name: /^All/ })).toBeChecked();
    expect(screen.getByText(`Showing ${total} of ${total}`)).toBeInTheDocument();
  });

  it('downloads a markdown report named after the site', async () => {
    const user = userEvent.setup();
    const createObjectURL = vi.fn((_blob: Blob) => 'blob:report');
    const revokeObjectURL = vi.fn();
    vi.stubGlobal('URL', Object.assign(URL, { createObjectURL, revokeObjectURL }));
    let downloadedName = '';
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
      downloadedName = this.download;
    });

    render(<App />);
    await user.type(screen.getByLabelText('Site name'), 'Example Shop');
    await user.click(screen.getByRole('button', { name: 'Download report' }));

    expect(createObjectURL).toHaveBeenCalledTimes(1);
    const blob = createObjectURL.mock.calls[0]![0];
    expect(blob.type).toContain('text/markdown');
    const text = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsText(blob);
    });
    expect(text).toContain('# Agent Ready report: Example Shop');
    expect(downloadedName).toBe('agent-ready-example-shop.md');
    expect(click).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Report download started.')).toBeInTheDocument();
  });

  it('copies the report and reports the outcome', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Copy report' }));
    expect(writeText).toHaveBeenCalledTimes(1);
    expect(writeText.mock.calls[0]?.[0]).toContain('# Agent Ready report');
    expect(await screen.findByText('Report copied to the clipboard.')).toBeInTheDocument();
  });

  it('asks before clearing progress, then clears', async () => {
    const user = userEvent.setup();
    render(<App />);
    const reset = screen.getByRole('button', { name: 'Reset progress' });
    expect(reset).toBeDisabled();

    await user.click(screen.getByRole('checkbox', { name: items[0]!.title }));
    expect(reset).toBeEnabled();
    await user.click(reset);
    expect(screen.getByText('Clear every ticked item? This cannot be undone.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.getByText(`1 of ${total} done`)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Reset progress' }));
    await user.click(screen.getByRole('button', { name: 'Clear all progress' }));
    expect(screen.getByText(`0 of ${total} done`)).toBeInTheDocument();
    expect(screen.getByText('Progress cleared.')).toBeInTheDocument();
    expect(window.localStorage.getItem(STORAGE_KEY)).toContain('"done":[]');
  });

  it('exposes a coherent heading outline and landmarks', () => {
    render(<App />);
    const nav = screen.getByRole('navigation', { name: 'Site' });
    expect(within(nav).getAllByRole('link')).toHaveLength(2);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getAllByRole('heading', { level: 2 }).length).toBeGreaterThanOrEqual(3);
  });
});
