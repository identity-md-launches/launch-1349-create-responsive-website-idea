import { describe, expect, it } from 'vitest';
import { publicationMetadata } from '../scripts/site-metadata';

describe('publication metadata', () => {
  it('does not invent an address for an unconfigured export', () => {
    expect(publicationMetadata(undefined)).toBeNull();
  });

  it('uses the supplied root or gateway directory for every URL', () => {
    for (const address of ['https://example.org/', 'https://example.org/preview', 'https://example.org/ipfs/test-fixture/']) {
      const result = publicationMetadata(address)!;
      const page = address.endsWith('/') ? address : `${address}/`;
      expect(result.page).toBe(page);
      expect(result.image).toBe(`${page}og.png`);
      expect(result.sitemapUrl).toBe(`${page}sitemap.xml`);
      const xml = new DOMParser().parseFromString(result.sitemap, 'application/xml');
      expect(xml.querySelector('parsererror')).toBeNull();
      expect(xml.querySelectorAll('loc')).toHaveLength(1);
      expect(xml.querySelector('loc')?.textContent).toBe(page);
    }
  });

  it('rejects ambiguous, non-HTTPS or credential-bearing addresses', () => {
    for (const address of ['/preview/', 'http://example.org/', 'https://user@example.org/', 'https://example.org/?q=1', 'https://example.org/#hash']) {
      expect(() => publicationMetadata(address)).toThrow();
    }
  });

  it('escapes a public path before embedding it into XML or HTML', () => {
    const result = publicationMetadata('https://example.org/a&b/')!;
    expect(result.page).toBe('https://example.org/a&amp;b/');
    const xml = new DOMParser().parseFromString(result.sitemap, 'application/xml');
    expect(xml.querySelector('loc')?.textContent).toBe('https://example.org/a&b/');
  });
});
