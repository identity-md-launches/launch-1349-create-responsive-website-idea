# Agent Ready

A small static website: a 15-point checklist for building sites that people and AI agents can both use. You tick items, the score updates, and you can download or copy a Markdown report. The full checklist is prerendered as HTML and readable without JavaScript. Interactive progress is saved in the browser's local storage. There is no backend, no account and no tracking.

Stack: Vite 7, React 19, TypeScript 5, Vitest 3 with Testing Library. Styling is one hand-written CSS file with design tokens. `DESIGN.md` documents the design system; `docs/validation.md` records the build, test, browser and design-review results.

## Install

Requires Node 22.12 or newer (this revision checked with Node 22.23.3, npm 10.9.9).

```sh
npm ci
```

## Develop and preview

```sh
npm run dev        # Vite dev server with hot reload, http://localhost:5173
npm run preview    # serves the committed dist/ export, http://localhost:4173
```

## Rebuild the export

```sh
npm run og         # regenerates public/og.png and the PNG favicons from inline SVG (only needed if the artwork or colors change)
npm run build      # Vite build + HTML prerender; relative runtime assets (base "./")
```

`scripts/prerender.mjs` renders the same React `App` at build time. The client hydrates that HTML, then restores saved progress before enabling persistence. No server-side runtime is needed. Without JavaScript, all items and instructions remain readable; filtering, saving and reports require JavaScript.

`dist/` is committed on purpose: the publisher serves the committed export and does not rebuild. Rebuild and commit `dist/` after any source change.

## Check

```sh
npm run typecheck  # tsc --noEmit for the app, tests and config
npm run test       # vitest: unit tests, interaction tests (jsdom) and dist/ checks
npm run check      # typecheck + build + test, in that order
```

The `tests/dist.test.ts` suite reads the committed `dist/index.html`, so run `npm run build` before `npm run test` (or use `npm run check`).

## Publish

The site is a plain static export. Upload the contents of `dist/` to any static host, IPFS gateway, or object storage bucket. All asset URLs are relative (`./assets/...`, `./og.png`), so it works from a domain root, a subpath such as `https://example.org/preview/`, or an ENS name. No rewrite rules are needed: the site is a single page with hash links for in-page navigation.

Publication metadata is configured at build time with **`SITE_URL`**, the real HTTPS directory URL that will serve `index.html`. It may be a domain root or gateway subpath. It must not include credentials, a query or a fragment; a missing trailing slash is added. Once the publisher has put that address in `PUBLIC_SITE_URL`, run:

```sh
SITE_URL="$PUBLIC_SITE_URL" npm run check
```

This generates absolute `og:image` and `twitter:image` URLs, `og:url`, a canonical link, `dist/sitemap.xml` listing the page, and its `Sitemap:` directive in `dist/robots.txt`. Runtime script, stylesheet and icon URLs stay relative. The JSON-LD WebPage description is included in every build, even without `SITE_URL`.

**Current delivery limitation:** the final public address has not been supplied. The delivered export therefore keeps `./og.png` for social images and has no sitemap or canonical URL. Link previews on networks requiring an absolute image URL remain incomplete. The build prints this limitation; it never inserts a guessed domain or a relative sitemap location. Rebuild with the real `SITE_URL` before publishing if those features are required. A fixture URL was tested locally and is not in the delivered export.

For subpath hosting, the host operator should add the generated `Sitemap:` directive to the origin's root `/robots.txt`, or submit the sitemap through the host's search-console integration. A robots file under a gateway subpath is not the origin's crawl policy. Hosting and live social-card validation are outside this task; no site was published.

## Project layout

```
index.html              document head: title, description, favicon, Open Graph tags
src/main.tsx            hydration entry (client render fallback for Vite development)
src/App.tsx             page composition and state (done set, filter, site name)
src/components/         Header, Score, Filters, ItemList, ReportActions, Principles/About
src/data/checklist.ts   the five categories and fifteen items (the content)
src/lib/progress.ts     score, toggle and filter logic (pure functions)
src/lib/report.ts       Markdown report builder and file name
src/lib/storage.ts      localStorage load/save with validation
src/lib/download.ts     Blob download and clipboard copy
src/styles.css          tokens and all component styles
public/                 favicon.svg, generated PNG icons, og.png, robots.txt
scripts/make-og.mjs     renders the PNG images with @resvg/resvg-js
scripts/prerender.mjs   writes the complete page HTML after the Vite build
scripts/site-metadata.ts validates SITE_URL and derives publication URLs/sitemap
tests/                  vitest suites and setup
docs/                   validation record and screenshots from the browser review
dist/                   committed production export
DESIGN.md               design system as implemented
```

## Validation results (2026-10-11 revision)

Checks ran from an isolated `/tmp` copy with the unchanged lockfile installed using `npm ci`. This kept repository `node_modules/` untouched. The finished export was copied back to `dist/` and browser-tested there. Details and the six-domain Better Interface review are in [docs/validation.md](docs/validation.md).

| Check | Command | Result |
| --- | --- | --- |
| Typecheck | `npm run typecheck` | passed, no diagnostics |
| Production build | `npm run build` | passed; final prerendered HTML 17,382 bytes, CSS 13,123 bytes, JS 239,044 bytes |
| Automated tests | `npm test` | 5 files, 31 tests passed |
| Configured publication build | `SITE_URL` set to an explicit test fixture, then build/test | passed; absolute metadata, sitemap and robots entry agree |
| Production browser check | `node test/scratch/verify.mjs` using installed Playwright/Chromium | passed at 320, 390, 768, 1280 and 1440; no console errors, failed resources or page overflow |

Browser interactions: keyboard radio selection and checkbox toggle, progress/site-name restoration after reload, category and remaining filters, empty-state recovery, real clipboard copy and denied-copy fallback, Markdown download bytes and filename, reset cancellation/confirmation, and hash navigation. JavaScript-disabled Chromium reads the heading, main landmark, all 15 checklist items and their instructions. At 390×844 the first item checkbox ends at 746px, all six categories are visible and the header is one row. Saved-progress hydration has regression tests, including Strict Mode and checking that stored progress is never overwritten with the empty initial state.

Not checked: physical devices, screen readers, Safari/Firefox, native browser zoom, an automated accessibility audit or live social-network unfurling. No publication address was supplied; the metadata limitation above remains. Screenshots and measured contrast pairs are recorded in the validation document. Scratch scripts and diagnostic dumps are not part of the submitted bundle; the permanent tests are under `tests/`.

## License

Site source: MIT. Design guidance applied during the build is adapted from Jakub Krehel's Better Interface (MIT) and Paul Bakaus's Impeccable documentation method (Apache-2.0).
