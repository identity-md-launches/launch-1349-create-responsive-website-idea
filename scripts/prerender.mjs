import { readFile, writeFile } from 'node:fs/promises';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { createServer } from 'vite';

const vite = await createServer({
  envFile: false,
  appType: 'custom',
  server: { middlewareMode: true, hmr: false, watch: null },
});

try {
  const { App } = await vite.ssrLoadModule('/src/App.tsx');
  const { publicationMetadata } = await vite.ssrLoadModule('/scripts/site-metadata.ts');
  const metadata = publicationMetadata(process.env.SITE_URL);
  const template = await readFile('dist/index.html', 'utf8');
  const root = '<div id="root"></div>';
  if (!template.includes(root)) throw new Error('Build template is missing the empty #root mount. Run vite build first.');
  let html = template.replace(root, () => `<div id="root">${renderToString(createElement(App))}</div>`);

  if (metadata) {
    html = html
      .replace('property="og:image" content="./og.png"', () => `property="og:image" content="${metadata.image}"`)
      .replace('name="twitter:image" content="./og.png"', () => `name="twitter:image" content="${metadata.image}"`)
      .replace('</head>', () => `  <meta property="og:url" content="${metadata.page}" />\n    <link rel="canonical" href="${metadata.page}" />\n  </head>`);
    await writeFile('dist/sitemap.xml', metadata.sitemap);
    const robots = await readFile('public/robots.txt', 'utf8');
    await writeFile('dist/robots.txt', `${robots.trimEnd()}\nSitemap: ${metadata.sitemapUrl}\n`);
  } else {
    console.warn('SITE_URL is unset: sitemap and absolute social URLs await the final public address. See README.md.');
  }

  await writeFile('dist/index.html', html);
  console.log('Prerendered the complete Agent Ready page into dist/index.html.');
} finally {
  await vite.close();
}
