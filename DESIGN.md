# Agent Ready design system

This documents the design as implemented in the final source. Every value below is read from `src/styles.css` (tokens and component styles), `index.html` (document head) and the components in `src/components/`. Rendered checks were made in headless Chromium against the committed `dist/` export at 320, 390, 768, 1280 and 1440 CSS pixels wide; see `docs/validation.md`.

## Overview

Agent Ready is a single-page checklist tool for web developers and product teams. The visual character is calm and utilitarian: a warm off-white page, white cards with a hairline shadow, one deep green accent used only for the primary action, progress and selected state, and a system sans-serif stack. Hierarchy comes from size and weight, not from color. Density is moderate: 16px body text, 44px buttons and inputs, 40px category pills, 16px card padding on small screens and 24px from 40rem.

System-wide rules: the two-tier color tokens, the six-step type scale, the spacing steps, the card and button components, and the focus treatment. Page-specific arrangements: the hero (headline plus one line), the side panel plus item list grid, and the five-column principles grid.

## Colors

Defined in `src/styles.css` under `:root`, in `oklch()`. Primitives are named by hue (`--sand-*`, `--green-*`, `--white`) and are never used directly in components. Components reference the semantic tokens only.

| Semantic token | Primitive | Value | Job |
| --- | --- | --- | --- |
| `--color-bg-page` | `--sand-50` | `oklch(98% 0.004 85)` | page background |
| `--color-bg-surface` | `--white` | `oklch(100% 0 0)` | cards, inputs, buttons, pills |
| `--color-bg-subtle` | `--sand-100` | `oklch(95.5% 0.006 85)` | progress-bar track |
| `--color-bg-hover` | `--sand-100` | `oklch(95.5% 0.006 85)` | hover on neutral buttons, nav links, pills |
| `--color-border` | `--sand-200` | `oklch(90% 0.008 85)` | section dividers, header and footer rules |
| `--color-border-strong` | `--sand-300` | `oklch(65% 0.012 85)` | control borders: buttons, inputs, pills |
| `--color-text` | `--sand-900` | `oklch(22% 0.014 85)` | headings, body, item titles |
| `--color-text-secondary` | `--sand-600` | `oklch(47% 0.012 85)` | descriptions, captions, nav links, counts |
| `--color-text-on-accent` | `--white` | `oklch(100% 0 0)` | text on the filled primary button |
| `--color-accent-solid` | `--green-600` | `oklch(47% 0.09 155)` | primary button fill, progress bar, checkbox `accent-color` |
| `--color-accent-solid-hover` | `--green-700` | `oklch(40% 0.085 155)` | primary button hover |
| `--color-accent-bg` | `--green-100` | `oklch(94% 0.045 155)` | selected pill background, text selection |
| `--color-accent-text` | `--green-800` | `oklch(32% 0.07 155)` | selected pill text and border, status messages, "Done" suffix |
| `--color-focus` | `--sand-900` | `oklch(22% 0.014 85)` | focus ring |

Rules: one filled action per view (the Download report button). The green hue means "progress or selected"; it is never used on static decoration. There is no dark theme and no status ramp other than the accent; do not add one without a role that consumes it. Chroma on the green ramp is kept inside the sRGB gamut, so the values render identically on sRGB and P3 displays.

Measured contrast (WCAG 2, computed from the rendered sRGB pixels in Chromium, see `docs/validation.md`): text on page 16.3:1, secondary text on page 6.5:1 and on surface 6.9:1, white on the primary button 6.6:1, selected pill text on its background 10.5:1, status text on surface 12.3:1. The strong control border on white measures 3.2:1 from the declared tokens.

## Typography

Font: `--font-sans: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`. No font files are bundled; the page uses whichever of these the device has. Weights used: 400 (body), 500 (pill labels, field labels, Done suffix), 600 (headings, brand, score value, buttons, item titles, card titles, strong). Font smoothing is set once on `html`.

Six sizes, one scale (`src/styles.css`):

| Token | Size | Used for |
| --- | --- | --- |
| `--text-xs` | 13px | item category caption, pill counts, field hint, principle counts |
| `--text-sm` | 15px | nav links, buttons, pills, card titles, item body copy, status, footer |
| `--text-md` | 16px | body, item titles, the Site name input (16px keeps iOS from zooming) |
| `--text-lg` | 20px | `h3`, hero subline |
| `--text-xl` | 26px | `h2`, score value |
| `--text-2xl` | 36px, 44px from 48rem | `h1` |

Line heights: `--leading-tight` 1.1 for `h1`/`h2` and the score value, `--leading-snug` 1.3 for `h3`, item titles and the hero subline, `--leading-body` 1.55 for everything else. Letter-spacing: `-0.02em` on `h1`, `-0.01em` on `h2` and the score value, none elsewhere. Headings use `text-wrap: balance`; paragraphs use `text-wrap: pretty` and cap at `--measure: 65ch`. Counters (score, "Showing x of y", pill counts) use `font-variant-numeric: tabular-nums`. The hero `h1` is capped at 18ch and the subline at 42ch.

## Layout

Spacing steps: `--space-1` 4px, `-2` 8px, `-3` 12px, `-4` 16px, `-5` 24px, `-6` 32px, `-7` 48px, `-8` 64px. Within a group use 8 to 12px; between groups 24px or more.

Container: `.container` is 100% wide up to `--container: 72rem` (1152px), centered, with `--gutter` 16px of inline padding, 24px from 40rem. Sections (`.section`) have 48px of block padding and a 1px `--color-border` rule between them. All direction-dependent properties are logical (`inline-size`, `margin-inline`, `padding-block`).

Breakpoints come from the content, in rem:

- 40rem (640px): card padding grows to 24px, gutter to 24px, the principles grid becomes two columns, with the final Trust card spanning both.
- 48rem (768px): `h1` grows to 44px, hero padding grows.
- 56rem (896px): the checklist becomes a two-column grid, `17rem minmax(0, 1fr)`, with the score and filter panel at top-left, the report card below it, and the items on the right (`grid-template-areas` in `.checklist`). Report actions stack vertically. Category pills continue to wrap within the sidebar.
- 64rem (1024px): the principles grid becomes five columns and the final card returns to a single column.

Mobile order (below 56rem): hero, progress card, category card, item list, report card, principles, about. This keeps the first checklist item on the first screen at 390 wide (its checkbox bottom measured at 746px of an 844px viewport). Category pills wrap at every width, with 4px of block padding and visible overflow to preserve the complete focus ring. All six options are visible at 390px. The header has two utility links and stays on one row at 390px; it wraps naturally at 320px.

Overflow: no horizontal overflow at 320, 390, 768, 1280 or 1440 (measured). Text containers have no fixed heights.

## Elevation and depth

Flat, with one treatment: `--shadow-surface: 0 0 0 1px oklch(0 0 0 / 0.06), 0 1px 2px oklch(0 0 0 / 0.04)` on `.card`, `.item`, `.empty` and the skip link. It is a shadow used as a border so cards sit on the page without a hard line. Structural separators use real 1px `--color-border` rules (header, footer, between sections). Controls use real 1px `--color-border-strong` borders because they communicate state. There are no overlays, modals or z-stacked layers other than the skip link.

## Shapes

- `--radius-sm` 6px: checkbox inputs.
- `--radius-md` 10px: buttons, the text input, nav link hover, skip link.
- `--radius-lg` 16px: cards, items, empty state.
- `--radius-pill` 999px: category pills, the progress bar.

Rounded elements are not nested inside each other except buttons inside cards, where the 16px card padding keeps them visually separate.

## Components

All components are React function components with no exported props API beyond what is listed; they are patterns to copy within this site rather than a library.

**Button** (`.button`, `.button-primary` in `src/styles.css`; used in `src/components/ReportActions.tsx` and `ItemList.tsx`). 44px tall, 15px/600 text, 10px radius. Neutral: white surface with a strong border, hover tints to `--color-bg-hover` (hover gated with `@media (hover: hover)`). Primary: `--color-accent-solid` fill, white text, darker fill on hover. Press feedback is `scale: 0.96`, only under `prefers-reduced-motion: no-preference`. Transitions name their properties (`background-color, border-color, color, scale`) at 150ms with `cubic-bezier(0.2, 0, 0, 1)`. Native `disabled` is used for "Reset progress" when there is nothing to reset. Disabled buttons use `--color-text-secondary`, `--color-border` and `cursor: default`; hover tint and press scaling apply only to enabled buttons. Labels are verb-first: Download report, Copy report, Reset progress, Clear all progress, Cancel, Show all items.

**Card** (`.card`). White surface, 16px radius, shadow-as-border, 16px padding (24px from 40rem). `.card-title` is a 15px/600 secondary-colored heading-like label.

**Score** (`src/components/Score.tsx`). "N of 15 done" in `--text-xl`/600 plus a percentage, inside a `role="status"` paragraph so updates are announced politely. The bar below is decorative (`aria-hidden`), filled with `--color-accent-solid`, animated only under no-preference. In forced-colors mode the bar gets a `CanvasText` border and fill.

**Category pill** (`.pill` in `src/components/Filters.tsx`). A native radio input stretched invisibly over a label, so the whole pill is the target and arrow keys move between options. Selected: `--color-accent-bg` background, `--color-accent-text` text and border, weight 600, and a check glyph drawn with a CSS mask so the state does not depend on color. Focus ring is drawn on the pill via `:has(input:focus-visible)`. `.filter-options` wraps and has no scroll clipping, so the full 2px ring and 2px offset remain visible.

**Switch** (`.switch`). A native checkbox with `accent-color` and its label text in one 44px-tall label.

**Field** (`.field` in `ReportActions.tsx`). Visible label above a 44px input with 16px text, placeholder as an example (`example.com`), a hint below linked with `aria-describedby`, `autocomplete="organization"`.

**Checklist item** (`.item` in `src/components/ItemList.tsx`). A card-styled `li` in a two-column grid: a 44px label wrapping a 22px native checkbox, then the title label, a category caption, the "why" paragraph (secondary text, referenced by `aria-describedby`) and a "How:" line in primary text. Ticked items add `.item-done`, which dims the title and appends " · Done" as a text cue.

**Empty state** (`.empty`). A card with a bold one-line heading, a sentence saying what to do, and a "Show all items" button that clears both filters.

**Status line** (`.status`). A polite `role="status"` paragraph with a reserved minimum height, so copied, downloaded, reset and confirmation messages do not shift the layout.

**Header and nav** (`src/components/Header.tsx`). Brand mark plus "Agent Ready" link to `#top`, and a `nav` labeled "Site" with two hash links (Principles and About) styled as 44px pill-shaped links in secondary color. A "Skip to checklist" link is the first focusable element.

**Focus**: `:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 2px }` everywhere; verified visible on the page background, white surface, the selected pill and the filled primary button. No `outline: none` anywhere.

**Motion**: only color transitions (150ms) and the two no-preference opt-ins above. `scroll-behavior: smooth` is turned off under reduced motion.

## Do's and don'ts

- Start a new page from `Header`, a `.container.hero` with an `h1` of six words or fewer and one plain line, then `.section` blocks. Keep one `h1`, one `main`, and descending heading levels.
- Use `.button-primary` on exactly one action per view; everything else is `.button`.
- Use semantic tokens only. If a new role appears (for example an error color), add a primitive and a semantic token in `src/styles.css`; do not reuse `--color-border` for text or `--color-accent-text` for a non-selected label.
- Pick sizes from the six-step scale and spacing from `--space-*`. Do not add a seventh text size.
- Keep inputs at `--text-md` (16px) so mobile Safari does not zoom.
- Every control needs a visible label or `aria-label`, a 44px target (via its label if the control is small), and must be a native `button`, `a[href]` or `input`.
- Any new motion goes inside `@media (prefers-reduced-motion: no-preference)` and names its properties.
- Keep the site a single page with hash links and relative asset URLs. Do not add client-side routes that need server rewrites.

The production page is prerendered by `scripts/prerender.mjs`; `src/main.tsx` hydrates it. `App` uses a deterministic empty initial state, restores browser storage in an effect and then enables saving. Its `noscript` message explains the limits of the readable HTML-only version. JSON-LD lives in `index.html`; optional public-address metadata is generated using `SITE_URL`.

Recipe for one more page: copy `index.html`, point it at a new entry that renders `Header`, a hero section, your content in `.section .container` blocks and the footer from `App.tsx`; add it to `vite.config.ts` `build.rollupOptions.input`; extend the prerender script to write that page's markup; reuse `.card`, `.button`, `.field` and the tokens; rebuild and commit `dist/`.
