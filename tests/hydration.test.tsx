import { act } from '@testing-library/react';
import { StrictMode } from 'react';
import { hydrateRoot, type Root } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import { App } from '../src/App';
import { STORAGE_KEY } from '../src/lib/storage';

it.each([
  { siteName: '', done: [] },
  { siteName: 'Saved site', done: ['labels', 'robots'] },
])('hydrates without replacing HTML or overwriting saved progress: %j', async (saved) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  const container = document.createElement('div');
  // Browser storage must never change the deterministic build-time markup.
  container.innerHTML = renderToString(<App />);
  document.body.append(container);
  const originalHeading = container.querySelector('h1');
  expect(container.querySelector('.score-value')?.textContent).toBe('0 of 15 done');
  const recoverableError = vi.fn();
  const writes = vi.spyOn(Storage.prototype, 'setItem');
  let root: Root | undefined;
  try {
    await act(async () => {
      root = hydrateRoot(container, <StrictMode><App /></StrictMode>, { onRecoverableError: recoverableError });
    });
    expect(recoverableError).not.toHaveBeenCalled();
    expect(container.querySelector('h1')).toBe(originalHeading);
    expect(container.querySelector('.score-value')?.textContent).toBe(`${saved.done.length} of 15 done`);
    expect(container.querySelector('#site-name')).toHaveValue(saved.siteName);
    expect(container.querySelectorAll('.item input:checked')).toHaveLength(saved.done.length);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toEqual(saved);
    for (const [key, value] of writes.mock.calls) {
      if (key === STORAGE_KEY) expect(JSON.parse(value)).toEqual(saved);
    }
  } finally {
    await act(async () => root?.unmount());
    writes.mockRestore();
    container.remove();
  }
});
