// Checks the committed export in dist/. Run `npm run build` first; `npm run check` does.
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { items } from '../src/data/checklist';

const dist = resolve(__dirname, '..', 'dist');
const indexPath = resolve(dist, 'index.html');

describe('dist/index.html', () => {
  it('exists (run npm run build first)', () => {
    expect(existsSync(indexPath)).toBe(true);
  });

  // Collapse whitespace so multi-line tags match like single-line ones.
  const html = existsSync(indexPath) ? readFileSync(indexPath, 'utf8').replace(/\s+/g, ' ') : '';

  const meta = (attr: string, name: string): string | undefined =>
    new DOMParser().parseFromString(html, 'text/html')
      .querySelector(`meta[${attr}="${name}"]`)?.getAttribute('content') ?? undefined;

  it('has a title, description, favicon and Open Graph tags', () => {
    expect(html).toMatch(/<title>[^<]{10,}<\/title>/);
    expect(meta('name', 'description')?.length ?? 0).toBeGreaterThan(20);
    expect(html).toMatch(/<link rel="icon"[^>]*href="\.\/favicon\.svg"/);
    expect(meta('property', 'og:title')?.length ?? 0).toBeGreaterThan(5);
    expect(meta('property', 'og:image')).toMatch(/^(\.\/og\.png|https:\/\/.+\/og\.png)$/);
    expect(meta('property', 'og:description')?.length ?? 0).toBeGreaterThan(5);
  });

  it('contains the complete readable checklist before JavaScript runs', () => {
    const page = new DOMParser().parseFromString(html, 'text/html');
    expect(page.querySelectorAll('main')).toHaveLength(1);
    expect(page.querySelector('h1')?.textContent).toBe('Make your site agent-ready');
    expect(page.querySelectorAll('.item input[type="checkbox"]')).toHaveLength(15);
    for (const item of items) {
      expect(page.body.textContent).toContain(item.title);
      expect(page.body.textContent).toContain(item.why);
      expect(page.body.textContent).toContain(item.how);
    }
    expect(page.querySelector('.score-value')?.textContent).toBe('0 of 15 done');
    expect(page.querySelector('noscript')?.textContent).toContain('Enable JavaScript');
  });

  it('provides a WebPage JSON-LD block with the actual description', () => {
    const page = new DOMParser().parseFromString(html, 'text/html');
    const blocks = page.querySelectorAll('script[type="application/ld+json"]');
    expect(blocks).toHaveLength(1);
    expect(JSON.parse(blocks[0]!.textContent!)).toEqual({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Agent Ready',
      description: page.querySelector('meta[name="description"]')?.getAttribute('content'),
    });
  });

  it('keeps publication URLs consistent when a public address is configured', () => {
    const page = new DOMParser().parseFromString(html, 'text/html');
    const url = page.querySelector('meta[property="og:url"]')?.getAttribute('content');
    if (url) {
      expect(page.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(url);
      expect(meta('property', 'og:image')).toBe(new URL('og.png', url).href);
      expect(meta('name', 'twitter:image')).toBe(new URL('og.png', url).href);
      const sitemap = new DOMParser().parseFromString(readFileSync(resolve(dist, 'sitemap.xml'), 'utf8'), 'application/xml');
      expect(sitemap.querySelector('parsererror')).toBeNull();
      expect(sitemap.querySelector('loc')?.textContent).toBe(url);
      expect(readFileSync(resolve(dist, 'robots.txt'), 'utf8')).toContain(`Sitemap: ${new URL('sitemap.xml', url).href}`);
    } else {
      expect(existsSync(resolve(dist, 'sitemap.xml'))).toBe(false);
      expect(readFileSync(resolve(dist, 'robots.txt'), 'utf8')).not.toContain('Sitemap:');
    }
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
