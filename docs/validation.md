# Validation record: Agent Ready

Date: 2026-10-11. Worker-side report for the final source and the committed `dist/` export. This is the worker's own record, not an independent certification.

## 1. Scope and assumptions

- Product: one page, `index.html` plus the React app in `src/`. Flows: tick items, filter by category, show only remaining, download report, copy report, two-step reset, persistence in local storage, in-page navigation via hash links and a skip link.
- Export: `dist/` built with `vite build`, `base: './'`. Served for review from a local static server under a `/preview/` subpath so relative URLs were exercised.
- Inferred choices: the brief ("good agentic website") named no product, so the site is a checklist tool about agent-readiness. Warm neutral palette with one green accent. System font stack, no bundled fonts. Light theme only. Content is original copy written for this site.
- Supported variants: light theme, reduced motion, forced colors (basic). Not supported: dark theme, localization, RTL.
- Exclusions: no backend, no analytics, no wallet. `og:image` is relative; see limitation.

## 2. Coverage by Better Interface domain

Without-a-browser checks were run on source; with-a-browser checks were run with a bounded Playwright script (`test/scratch/verify.mjs`, not shipped) driving headless Chromium 1246 against `dist/`.

| Domain | Status | Inspected | Not performed |
| --- | --- | --- | --- |
| Accessibility | Checked | Native `button`/`a`/`input` everywhere; every input has a bound label (0 unlabeled inputs, 0 unlabeled buttons, measured in-page); one `main`, one `h1`, nav labeled "Site", heading order H1 → H2 → H3 with no skips; skip link is first tab stop; Tab walked 12 stops with a 2px solid outline on each; Space toggles checkbox; focus ring screenshots on checkbox and filled button, plus forced-colors; `aria-describedby` on items and the site-name field; `role="status"` for score, counts and action messages; reduced-motion: bar transition duration 0s and `scroll-behavior` auto; hit areas: every link, button, pill and checkbox label ≥ 44px tall at 390 (the one script flag, the 23px-tall "Site name" text label, is a false positive: its input is 44px tall) | Screen-reader session; automated axe-style audit; native 200% zoom (narrow viewports used instead); physical touch device |
| Layout | Checked | Logical properties throughout; rem breakpoints at 40/48/56/64rem; DOM order matches reading order; no horizontal overflow at 320, 390, 768, 1280, 1440 (measured `scrollWidth`); first screen at 390×844 shows headline, subline, score and the first checklist checkbox (bottom at 752px); hidden pills peek past the card edge on mobile | RTL mirror; pseudo-localization |
| Writing | Checked (source) | Verb-first buttons; one term per concept ("report", "progress", "items"); sentence case; empty state names the cause and offers "Show all items"; confirmation repeats the consequence ("Clear all progress"); error copy for copy failure says what to do next; no "click here"; placeholders are examples | None required |
| Typography | Checked | Six distinct rendered sizes at 390 (13, 15, 16, 20, 26, 36px, measured); heading sizes descend (h1 36 > h2 26 > h3 20); input 16px; line-heights 1.1/1.3/1.55 unitless; `text-wrap: balance` on headings, `pretty` on paragraphs; measure 65ch; tabular numerals on counters; screenshots show no awkward wraps at 320, 390, 768, 1280 | Rendering with Inter (not installed on the review machine; Liberation Sans rendered) |
| Colors | Checked | Two-tier tokens in `oklch()`; all primitives verified inside the sRGB gamut by conversion; one filled action per view; green hue used only for accent roles; rendered pairs measured from canvas-resolved pixels in Chromium: text/page 16.34, secondary/page 6.47, secondary/surface 6.86, white/primary button 6.57, selected pill 10.52, status 12.31, nav link 6.47, field hint 6.86; control border/white 3.23 (declared tokens) | Dark theme (not implemented) |
| UI | Checked | Shadow-as-border on cards; radii 6/10/16/pill; transitions name exact properties at 150ms with `cubic-bezier(0.2, 0, 0, 1)`; press scale 0.96 gated by reduced motion; hover gated by `(hover: hover)`; icons use `currentColor`, 2px stroke beside 600 text; selected pill has a glyph cue in addition to color; empty, confirming, copied, downloaded, reset, disabled states all rendered | Animations replayed at 10% speed |

## 3. Findings and fixes

| # | Severity | Domain | Location | Evidence | Fix | Recheck |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | HIGH | Layout | `src/App.tsx:50` (original aside), `src/styles.css` `.checklist` | At 390×844 the first checkbox's bottom edge measured 1168px, below the 844px viewport, because the score, filter and report cards all stacked above the list | Split the side panel: score and filters stay above the list, the report card moves below it on small screens via `grid-template-areas`; hero padding reduced on mobile; filters become one scrolling row | Checkbox bottom now 752px; screenshot `docs/screenshots/mobile-390-first-screen.png` |
| 2 | MEDIUM | Colors | `src/styles.css` `--green-600/700/800` | Declared chroma 0.12/0.11/0.09 at those lightnesses converted outside the sRGB gamut, so browsers would clip the accent unpredictably | Chroma lowered to 0.09/0.085/0.07; all primitives now in gamut; favicon and OG image regenerated with the matching sRGB hex | Contrast remeasured, white on accent 6.57:1 |
| 3 | MEDIUM | Colors / Accessibility | `src/styles.css` `--sand-300` | Control border on white computed at 1.75:1, below the 3:1 non-text boundary target | Lightness lowered from 82% to 65% | 3.23:1 from declared tokens |
| 4 | MEDIUM | Accessibility | `src/components/ItemList.tsx:50` | Checkbox hit target was the 22px input; its 44px wrapper was a `span`, so the padding did nothing | Wrapper changed to an empty `label htmlFor` so the full 44px square toggles the item | Measured 44×44 labels at 390 |
| 5 | MEDIUM | Accessibility / UI | `src/styles.css` `.pill:has(input:checked)` | Selected category was shown by background and border color only; in the forced-colors screenshot the selection was invisible | Added a check glyph (CSS mask, `currentColor`) and weight 600 on the selected pill; forced-colors rules for the pill border and the progress bar | Glyph visible in `docs/screenshots/mobile-390-first-screen.png` |
| 6 | LOW | Accessibility | `src/components/Score.tsx`, `src/components/Filters.tsx` | Status text read as "1 of 15 done7%" and pill names as "All1/15" because flex gaps have no text space | Added a visually hidden ", " in the score line and a space before each pill count | Status now "1 of 15 done, 7%" in the recheck output |
| 7 | LOW | Typography | `src/styles.css` `.items-header h2` | The list heading rendered at 20px, the same size as the h3 principle names below it | Raised to `--text-xl` (26px) so h2 > h3 | Measured h2 26px |
| 8 | LOW | Tooling | `scripts/make-og.mjs` | First OG render fell back to a monospace face because none of the listed families existed on the build machine | Font stack changed to installed sans faces (Liberation Sans, FreeSans) with generic fallback | `public/og.png` inspected visually |

No open findings remain.

## 4. Verification

Commands, run from the repository root on the final source (Node 24.21.0, npm 11.19.0):

| Command | Exit | Output |
| --- | --- | --- |
| `npm run typecheck` | 0 | no diagnostics |
| `npm run build` | 0 | `dist/index.html` 1.95 kB, `dist/assets/index-*.css` 13.25 kB, `dist/assets/index-*.js` 238.91 kB (gzip 75.22 kB), built in about 2s |
| `npm run test` | 0 | 3 files, 22 tests passed (`tests/progress.test.ts` 10, `tests/app.test.tsx` 8, `tests/dist.test.ts` 4) |
| `node test/scratch/verify.mjs dist` | 0 | no HIGH findings; console errors: none; failed requests: none |

Interaction tests (jsdom, `tests/app.test.tsx`): render with 15 item checkboxes and the primary button; tick updates score and local storage; saved progress restores; category filter plus remaining-only reaches the empty state and "Show all items" recovers; download creates a `text/markdown` blob named `agent-ready-example-shop.md` containing the report; copy writes the report to the clipboard and announces it; reset requires confirmation, can be cancelled, then clears; landmarks and heading outline exist.

Browser run (headless Chromium, `dist/` under `/preview/`): viewports 390×844, 320×640, 768×1024, 1280×900, 1440×900. Interactions: tick (score "1 of 15 done, 7%"), Trust filter ("Showing 2 of 2"), complete category plus remaining-only (empty state shown), "Show all items" ("Showing 15 of 15"), real download event (`agent-ready-example-shop.md`, first line `# Agent Ready report: Example Shop`, ticked item present), two-step reset ("0 of 15 done, 0%"), reload persistence (checkbox and site name restored), 12-stop Tab walk with visible outlines, Space toggle, reduced-motion emulation, forced-colors emulation. Head values as parsed by the browser: title, description, `og:title`, `og:image` (`./og.png`) and favicon (`./favicon.svg`) present, and both relative assets fetched with HTTP 200 under the subpath.

Screenshots (CSS pixels): `docs/screenshots/mobile-390-first-screen.png`, `mobile-320-first-screen.png`, `tablet-768-first-screen.png`, `desktop-1280-first-screen.png`, `mobile-390-focus-checkbox.png`, `mobile-390-focus-primary-button.png`, `mobile-390-empty-state.png`, `mobile-390-forced-colors-focus.png`. Full-page captures at 320, 390 and 1280 are in the untracked `artifacts/screenshots/` directory.

## 5. Completion

Complete for the stated scope.

Remaining limitations:

- No screen-reader session, no automated accessibility audit tool, no physical device, no native 200% zoom, no RTL check.
- The hosted preview was a local static server inside one bounded command, because the browser tool could not open `file://` URLs and no tool-managed preview was provided in this session. The Playwright MCP tool was not used for the inspection; playwright-core from the installed MCP package was.
- `og:image` and `twitter:image` are relative URLs; most unfurlers need an absolute URL once the final address is known (noted in `README.md`).
- Inter is first in the font stack but not bundled; the review machine rendered Liberation Sans, so Inter-specific metrics were not observed.
- The page's main interaction, the checklist, is on the first screen at 390 wide; the filled "Download report" button is below it by design.
