// Renders the social preview image and the PNG favicons from inline SVG using
// @resvg/resvg-js. Output goes to public/ so Vite copies it into dist/ unchanged.
// Run: npm run og
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';

const here = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(here, '..', 'public');
mkdirSync(publicDir, { recursive: true });

// Colors mirror the tokens in src/styles.css (sRGB fallbacks of the oklch values).
const BG = '#faf8f5';
const SURFACE = '#ffffff';
const BORDER = '#e0ded8';
const TEXT = '#1e1a13';
const MUTED = '#5e5a53';
const ACCENT = '#296944';

const check = (x, y, done, label) => `
  <rect x="${x}" y="${y}" width="40" height="40" rx="10" fill="${done ? ACCENT : SURFACE}" stroke="${done ? ACCENT : BORDER}" stroke-width="3"/>
  ${done ? `<path d="M${x + 11} ${y + 21}l6 6 12-13" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>` : ''}
  <text x="${x + 60}" y="${y + 28}" font-family="Liberation Sans, FreeSans, Arial, Helvetica, sans-serif" font-size="26" font-weight="500" fill="${TEXT}">${label}</text>
`;

const og = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${BG}"/>
  <g transform="translate(80 80)">
    <rect width="56" height="56" rx="14" fill="${ACCENT}"/>
    <path d="M16 29l8 8 17-18" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="72" y="40" font-family="Liberation Sans, FreeSans, Arial, Helvetica, sans-serif" font-size="30" font-weight="600" fill="${TEXT}">Agent Ready</text>
  </g>
  <text x="80" y="268" font-family="Liberation Sans, FreeSans, Arial, Helvetica, sans-serif" font-size="76" font-weight="700" letter-spacing="-2" fill="${TEXT}">Make your site</text>
  <text x="80" y="352" font-family="Liberation Sans, FreeSans, Arial, Helvetica, sans-serif" font-size="76" font-weight="700" letter-spacing="-2" fill="${ACCENT}">agent-ready.</text>
  <text x="80" y="420" font-family="Liberation Sans, FreeSans, Arial, Helvetica, sans-serif" font-size="30" fill="${MUTED}">A 15-point checklist for websites that people</text>
  <text x="80" y="462" font-family="Liberation Sans, FreeSans, Arial, Helvetica, sans-serif" font-size="30" fill="${MUTED}">and AI agents can both use.</text>
  <g transform="translate(760 120)">
    <rect width="360" height="390" rx="24" fill="${SURFACE}" stroke="${BORDER}" stroke-width="2"/>
    <text x="32" y="56" font-family="Liberation Sans, FreeSans, Arial, Helvetica, sans-serif" font-size="22" font-weight="600" fill="${MUTED}">Checklist</text>
    <text x="328" y="56" text-anchor="end" font-family="Liberation Sans, FreeSans, Arial, Helvetica, sans-serif" font-size="22" font-weight="600" fill="${ACCENT}">3 of 5</text>
    ${check(32, 92, true, 'One main landmark')}
    ${check(32, 152, true, 'Native buttons')}
    ${check(32, 212, true, 'Visible labels')}
    ${check(32, 272, false, 'Structured data')}
    ${check(32, 332, false, 'Clear robots rules')}
  </g>
</svg>`;

const icon = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="${ACCENT}"/>
  <path d="M18 33l9 9 19-20" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const render = (svg, width, file) => {
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: width } }).render().asPng();
  writeFileSync(resolve(publicDir, file), png);
  console.log(`wrote public/${file} (${png.length} bytes)`);
};

render(og, 1200, 'og.png');
render(icon(48), 48, 'favicon-48.png');
render(icon(180), 180, 'apple-touch-icon.png');
