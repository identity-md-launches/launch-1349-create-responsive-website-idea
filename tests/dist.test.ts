// Checks the committed export in dist/. Run `npm run build` first; `npm run check` does.
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const dist = resolve(__dirname, '..', 'dist');
const indexPath = resolve(dist, 'index.html');

describe('dist/index.html', () => {
  it('exists (run npm run build first)', () => {
    expect(existsSync(indexPath)).toBe(true);
  });

  // Collapse whitespace so multi-line tags match like single-line ones.
  const html = existsSync(indexPath) ? readFileSync(indexPath, 'utf8').replace(/\s+/g, ' ') : '';

  const meta = (attr: string, name: string): string | undefined =>
    html.match(new RegExp(`<meta ${attr}="${name}" content="([^"]*)"`))?.[1];

  it('has a title, description, favicon and Open Graph tags', () => {
    expect(html).toMatch(/<title>[^<]{10,}<\/title>/);
    expect(meta('name', 'description')?.length ?? 0).toBeGreaterThan(20);
    expect(html).toMatch(/<link rel="icon"[^>]*href="\.\/favicon\.svg"/);
    expect(meta('property', 'og:title')?.length ?? 0).toBeGreaterThan(5);
    expect(meta('property', 'og:image')).toBe('./og.png');
    expect(meta('property', 'og:description')?.length ?? 0).toBeGreaterThan(5);
  });

  it('references only relative asset URLs that exist', () => {
    // Every path-like attribute value. A leading "/" would break subpath hosting.
    const urls = [...html.matchAll(/(?:src|href|content)="([^"]+)"/g)]
      .map((m) => m[1]!)
      .filter((u) => u.startsWith('./') || u.startsWith('/'));
    expect(urls.length).toBeGreaterThan(0);
    for (const url of urls) {
      expect(url.startsWith('./'), `absolute URL in export: ${url}`).toBe(true);
      expect(existsSync(resolve(dist, url)), `missing asset: ${url}`).toBe(true);
    }
  });

  it('bundles a script and a stylesheet', () => {
    expect(html).toMatch(/<script type="module" crossorigin src="\.\/assets\/index-[\w-]+\.js"><\/script>/);
    expect(html).toMatch(/<link rel="stylesheet" crossorigin href="\.\/assets\/index-[\w-]+\.css">/);
  });
});
