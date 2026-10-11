# Validation record: Agent Ready revision

Date: 2026-10-11. Worker-side results for this revision; these are not independent certification. This record supersedes the previous round's measurements. The existing product, checklist content, palette and component structure are retained.

## Scope and assumptions

The task reopens ten findings on the accepted single-page React/Vite checklist. Each was reproduced before editing, using the original `dist/` and source. The revision adds static HTML rendering and JSON-LD, preserves browser progress during hydration, and corrects the reported shared styles, mobile navigation, copy and tablet grid.

No public hosting URL was provided. `SITE_URL` is an optional publisher-owned build setting, as allowed by the task's setting guidance. The build can produce an absolute-address sitemap, robots directive, canonical URL and social images from it. The delivered generic export has no invented origin: it keeps relative social images and omits the address-dependent sitemap. This limitation remains explicit; sitemap/social publishing is not claimed complete.

Dependencies were installed from the existing lockfile into an isolated `/tmp/agent-ready-revision-*` working copy using `npm ci --no-audit --no-fund`; repository `node_modules/` was not created or edited. Source, config, scripts, tests and assets were copied there. The built export was copied back to repository `dist/`. No dependency versions, lockfile entries or ignore rules changed. No publishing commands ran, and no `.git/`, `.github/` or `.env` files were edited.

## Findings, reproduction and disposition

IDs below are shortened for readability; `.imd-responses.json` contains all exact IDs.

| Finding | Source in final tree | Reproduced before change | Correction and recheck |
| --- | --- | --- | --- |
| High `b758a36e` — empty HTML, JSON-LD and sitemap | `scripts/prerender.mjs:6`, `src/main.tsx:16`, `src/App.tsx:15`, `index.html:31` | Original fetched body was only an empty root; JavaScript-disabled Chromium had 0 h1, main and inputs, and empty body text. No JSON-LD or sitemap existed. | Build now uses Vite SSR loading and React `renderToString`; client hydrates the same initial state then restores storage. No-JS result: 1 h1, 1 main, 15 item checkboxes, 15 instructions and 5,359 visible text characters. WebPage JSON-LD matches the description. Regression tests check the export and hydration with saved progress. Sitemap generation and its robots entry are implemented/tested with `SITE_URL`; actual address-dependent output awaits the publisher's URL. |
| Medium `8873cda0` — disabled reset | `src/styles.css:649` | Reset and Copy used identical foreground, border, background and pointer cursor. | Reset now uses secondary text, the softer border and default cursor. Disabled hover/press feedback is excluded. Browser idle/hover styles match, while live Copy differs; confirmed reset disables it. |
| Medium `21e14b50` — hidden categories | `src/styles.css:465` | At 390 the row was 358px wide with 661px of content; Actions started at x=374.09, just beyond the clip edge, followed by invisible Data and Trust. | Removed scroll clipping, edge bleed and hidden scrollbar. All six pills wrap inside the card at every checked width. At 390, scroll/client width both 326px; all pill boxes remain inside the row. |
| Medium `57b5d331` — four weights | `src/styles.css:162`, `:282`, `:427` | Browser-computed weights were 400, 500, 600 and 650. | Replaced the three 650 declarations with 600. Computed set is now 400/500/600 at all five widths; hierarchy remains size-based. DESIGN.md updated. |
| Medium `9fe68053` — hero direction | `src/App.tsx:63` | Hero paragraph contained two sentences and measured 104px high at 390. | Kept the one-sentence product explanation with computed item count. Paragraph is 52px high at 390. |
| Medium `16594a81` — wrapped header | `src/components/Header.tsx:22` | At 390, header height was 113px; nav started on a second row at x=16, y=60. | Removed the redundant Checklist nav link while preserving the skip link and target. Header is 61px; nav occupies the right edge on the brand's row at 390. Natural wrap remains at 320. |
| Low `e36c7ef1` — clipped focus ring | `src/styles.css:465` | Tab to All showed 1px clipped from the top and bottom of the outline; overflow-y was auto. | Shared wrapping fix removes the clip; block padding is 4px. Measured clipping is 0px on both edges. Viewed focused screenshot with the entire outline visible. |
| Low `cfebd3ed` — orphan principle | `src/styles.css:838`, `:848` | At 768 Trust occupied only the left half of the last row. | Last card spans both columns between 40rem and 64rem, then returns to one cell in the five-column desktop row. Measured and viewed at 768 and 1280. |
| Low `961e3048` — voice aside | `src/components/Principles.tsx:9` | Source and browser paragraph contained “The good news:”. | Removed the aside; retained the explanation. Viewed the final paragraph in the tablet screenshot. |
| Low `53a9f3be` — relative social image URLs | `scripts/prerender.mjs:21`, `scripts/site-metadata.ts:3` | Both original and generic final export have `./og.png`. The source-level limitation reproduces; no live URL was available for a social validator. | Added tested publisher configuration to write absolute image URLs plus `og:url`/canonical in a configured build. The generic export cannot be given a correct absolute URL yet. This is disputed only as a demand for a guessed URL before hosting: the publication limitation remains and is reported in README and handoff. |

The group of mobile fixes is intentional: wrapping all filters adds vertical space, while the shorter header and subline recover it. At 390×844 the first checkbox now occupies y=724.19–746.19, compared with y=730.19–752.19 before. Every category is visible without horizontal scrolling.

## Better Interface coverage

Read the pinned workflow, all six domain cores and the documentation method. Findings were corrected in existing components and tokens, without changing the product's visual direction.

| Domain | Coverage | Evidence and limits |
| --- | --- | --- |
| Accessibility | Checked for the changed scope | Full content in initial HTML; native labeled inputs/buttons; one h1 and main checked without scripts. Tab through header into category radio group, ArrowRight selection, Space checkbox toggle. Full category outline measured/viewed; native reset disabled semantics preserved. Forced-colors focus screenshot and reduced-motion checks. Screen reader, physical touch device, native 200% zoom and automated axe audit not performed. |
| Layout | Checked | Production export at 320×700, 390×844, 768×1024, 1280×900 and 1440×900. No document overflow; every category inside its row. Mobile first checkbox, one-row header at 390, tablet final card span and desktop five-card row measured. Screenshot inspection confirms wrapping and visible controls. RTL/pseudo-localization not performed; no localization supported. |
| Writing | Checked | Single-sentence product description, concise principles introduction, unchanged verb-first report actions, contextual form hint, meaningful empty state and denied-copy recovery. No new marketing copy. |
| Typography | Checked | Three computed weights and the existing six-size scale; unchanged 16px input, tabular numbers and heading hierarchy. Screenshots inspected at mobile/tablet/desktop. System fallback fonts used; Inter is not bundled. Safari/iPhone font metrics were not tested. |
| Colors | Checked for affected states | Existing semantic tokens reused for disabled controls. Canvas conversion of browser-computed colors measured WCAG contrast: body/page 16.34:1, secondary/page 6.47:1, disabled text/white 6.86:1, white/primary 6.57:1, selected pill 10.52:1, focus/white 17.32:1, status/white 12.31:1 and active control border/white 3.23:1. Disabled border is intentionally softer and is exempt from active-control contrast requirements. No new palette/theme. |
| UI | Checked | Disabled, hover, focus, checked, filtered-empty, copy success/failure, download and reset confirmation/cancellation exercised. In reduced motion, scrolling is auto and bar transition is 0s. Existing shape, icon and spacing tokens retained. No overlays/loading flow; those checks are not applicable. Animation playback at 10% speed not performed. |

## Commands and actual results

Environment: Node 22.23.3, npm 10.9.9, locked Vite 7.3.7 and Vitest 3.2.7. Build/tests run in the isolated copy described above; browser validation targets the copied repository export under `/preview/` using a static server owned and closed by the bounded verification script.

| Command | Result |
| --- | --- |
| `npm ci --no-audit --no-fund` | exit 0; 165 packages installed from the unchanged lockfile |
| `npm run typecheck` | exit 0; app/test and config TypeScript checks, no diagnostics |
| `npm run build` | exit 0; Vite build followed by prerender; warns that SITE_URL is unset |
| `npm test` | exit 0; 31 tests across five files |
| Configured `SITE_URL` build, then `npm test` | exit 0; all 31 tests pass with sitemap, robots directive and absolute metadata; only test-fixture outputs in `/tmp` |
| `node test/scratch/reproduce.mjs` | exit 0 before edits; reproduced all source/layout issues using original export |
| `node test/scratch/verify.mjs` | exit 0; final production layout, interactions, hydration reload and no-JS reading checks; 0 console errors and 0 failed resources |

Permanent tests: progress/report/storage (10), app interactions (8), static export/metadata (7), publication URL derivation (4), hydration (2). Hydration tests retain the original h1 DOM node, catch recoverable React errors and verify every storage write retains the saved data, including Strict Mode. Static-export tests assert all fifteen titles, explanations and instructions plus the rendered item inputs. Configured-output tests parse the sitemap as XML and check all public URLs agree. Test fixtures are explicitly synthetic test data, never a chosen hosting address.

Build output: final `dist/index.html` **17,382 bytes**, stylesheet **13,123 bytes**, application JS **239,044 bytes**; required icons and OG image remain bundled. Vite's own 2.35 kB HTML line describes the intermediate empty template, not the larger final prerendered output. The candidate submission contains 60 files totaling 1,600,465 bytes before compression (measured before this final documentation note), below the 8,388,608-byte cap. No dependency trees, caches, archives or symlinks are included; existing ignore rules were left unchanged. Runtime assets remain relative and were fetched successfully under `/preview/`. The delivered export is the unconfigured, portable build.

Initial local verification caught a JSX trailing comma while converting the entry point to a JSX variable; it was fixed before the passing typecheck. The first browser assertion read the asynchronous clipboard status too early; the test now waits for the actual status text before asserting. No product workaround was needed for that timing issue.

The MCP browser opened the original page once, then returned `Transport closed` for subsequent operations. The fallback was installed Playwright/Chromium in a bounded foreground script. Chromium needed temporary `XDG_CONFIG_HOME`/`XDG_CACHE_HOME` directories to avoid a crashpad initialization failure in this sandbox. No claim is made that the failed MCP session performed the final checks.

## Rendered evidence

Updated screenshots were opened and visually inspected:

- `docs/screenshots/mobile-390-first-screen.png` — product, all categories and first item.
- `docs/screenshots/mobile-320-first-screen.png` — narrow wrapping without page overflow.
- `docs/screenshots/tablet-768-first-screen.png` and `tablet-768-principles.png` — intermediate layout and full-row Trust card.
- `docs/screenshots/desktop-1280-first-screen.png` — sidebar/list desktop arrangement.
- `docs/screenshots/mobile-390-focus-category.png` and `mobile-390-focus-checkbox.png` — complete focus indicators.
- `docs/screenshots/mobile-390-report-disabled.png` — visibly inactive reset beside enabled controls.
- `docs/screenshots/mobile-390-empty-state.png` — filtered completion and recovery action.
- `docs/screenshots/mobile-390-focus-primary-button.png` and `mobile-390-forced-colors-focus.png` — button and forced-colors focus.
- `docs/screenshots/mobile-390-no-js.png` — readable static page and honest interaction limitation.

The 1440 screenshot is also retained; geometry was asserted at that width. Before/after metrics and original screenshots are scratch evidence only. No screenshot is a screen-reader session or a physical-device test.

## Completion and limitations

Code and local validation are complete for the reproduced rendering, interaction and design defects. The sitemap and absolute social-card deployment remain dependent on a real public address. Configure `SITE_URL` and rebuild before claiming those outputs are live. The [Sitemaps protocol](https://www.sitemaps.org/protocol.html) requires protocol-qualified locations; publishing a fabricated or relative page location would not fix the issue. [Open Graph](https://ogp.me/) defines canonical page and image URL metadata. For gateway subpaths, a host operator must also handle the origin-root robots policy.

All fifteen items remain a self-assessment of the visitor's site; the tool does not claim to have automatically passed its own checklist. With JavaScript disabled, reading and hash navigation work, while filtering, score updates, persistence and reports need JavaScript. The page says so. The first-screen criterion was checked at 390×844; shorter phone windows may require scrolling. The Download report card remains below the checklist on mobile, as in the accepted layout.

Unperformed: screen-reader/native-device tests, native browser zoom, RTL/pseudo-localization, Safari/Firefox, automated accessibility audit and live social validators. No network authority is implied by these worker-side tests.

Guidance attribution: Jakub Krehel's Better Interface, pinned commit `267330e1adfc66a718fb65fa6918c1f06d0a689e` (MIT), and Paul Bakaus's Impeccable documentation method, pinned commit `9d715cc4f5564a990ca8345abfdd5df6dc9b41c8` (Apache-2.0), as supplied by the assignment.
