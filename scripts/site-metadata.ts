// Hosting is assigned after delivery. Only generate absolute publication URLs
// when the publisher supplies the real directory URL; never invent an origin.
export const publicationMetadata = (value: string | undefined) => {
  if (!value) return null;
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash) {
    throw new Error('SITE_URL must be an HTTPS directory URL without credentials, query or fragment.');
  }
  if (!url.pathname.endsWith('/')) url.pathname += '/';

  const escapeXml = (text: string) => text.replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
  })[char]!);
  return {
    page: escapeXml(url.href),
    image: escapeXml(new URL('og.png', url).href),
    sitemapUrl: new URL('sitemap.xml', url).href,
    sitemap: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${escapeXml(url.href)}</loc></url>\n</urlset>\n`,
  };
};
