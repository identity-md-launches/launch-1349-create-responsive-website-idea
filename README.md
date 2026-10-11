# Agent Ready

A small static website: a 15-point checklist for building sites that people and AI agents can both use. You tick items, the score updates, and you can download or copy a Markdown report. Progress is saved in the browser's local storage. There is no backend, no account and no tracking.

Stack: Vite 7, React 19, TypeScript 5, Vitest 3 with Testing Library. Styling is one hand-written CSS file with design tokens. `DESIGN.md` documents the design system; `docs/validation.md` records the build, test, browser and design-review results.

## Install

Requires Node 20 or newer (built and checked with Node 24.21, npm 11.19).

```sh
npm install
```

## Develop and preview

```sh
npm run dev        # Vite dev server with hot reload, http://localhost:5173
npm run preview    # serves the committed dist/ export, http://localhost:4173
```

## Rebuild the export

```sh
npm run og         # regenerates public/og.png and the PNG favicons from inline SVG (only needed if the artwork or colors change)
npm run build      # writes dist/ with relative asset URLs (vite base "./")
```

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

Two notes for hosting:

- `og:image` is a relative URL (`./og.png`). Most link unfurlers want an absolute URL. If you know the final address, set `og:image` and `twitter:image` in `index.html` to the absolute URL and rebuild.
- `public/robots.txt` allows all paths. Adjust it if you host under a subpath that should not be crawled.

## Project layout

```
index.html              document head: title, description, favicon, Open Graph tags
src/main.tsx            React entry
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
tests/                  vitest suites and setup
docs/                   validation record and screenshots from the browser review
dist/                   committed production export
DESIGN.md               design system as implemented
```

## Validation results (2026-10-11)

All commands were run on the final source. Details, the Better Interface review and the limitations are in `docs/validation.md`.

| Check | Command | Result |
| --- | --- | --- |
| Typecheck | `npm run typecheck` | passed, no errors |
| Production build | `npm run build` | passed; `dist/index.html` 1.95 kB, CSS 13.25 kB, JS 238.91 kB (75.22 kB gzip) |
| Tests | `npm run test` | 3 files, 22 tests passed |
| Browser review | bounded Playwright script against `dist/` served under `/preview/` | no console errors, no failed requests, no horizontal overflow at 320, 390, 768, 1280 and 1440 |

Interactions validated in the real browser: ticking an item updates the score and persists across reload, category filter and remaining-only switch produce the empty state and recover from it, the download emits `agent-ready-example-shop.md` with the ticked item, the two-step reset clears progress, Tab reaches every control with a visible focus ring, and Space toggles a checkbox.

Limitations: no screen-reader session, no physical device, no native 200% browser zoom (narrow viewports were used instead), no RTL mirror. Dark mode is not implemented. The Inter font is referenced first in the stack but not bundled; on the review machine the page rendered with Liberation Sans.

## License

Site source: MIT. Design guidance applied during the build is adapted from Jakub Krehel's Better Interface (MIT) and Paul Bakaus's Impeccable documentation method (Apache-2.0).
