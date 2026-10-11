export type CategoryId = 'structure' | 'content' | 'actions' | 'data' | 'trust';

export interface Category {
  id: CategoryId;
  name: string;
  summary: string;
}

export interface ChecklistItem {
  id: string;
  category: CategoryId;
  title: string;
  why: string;
  how: string;
}

export const categories: readonly Category[] = [
  {
    id: 'structure',
    name: 'Structure',
    summary: 'Markup an agent can walk without guessing.',
  },
  {
    id: 'content',
    name: 'Content',
    summary: 'Words that mean one thing, to a person or a parser.',
  },
  {
    id: 'actions',
    name: 'Actions',
    summary: 'Forms and buttons that state what they do and report what happened.',
  },
  {
    id: 'data',
    name: 'Data',
    summary: 'Facts the agent can read directly instead of scraping.',
  },
  {
    id: 'trust',
    name: 'Trust',
    summary: 'Clear limits, so automation knows where it may act.',
  },
];

export const items: readonly ChecklistItem[] = [
  {
    id: 'landmarks',
    category: 'structure',
    title: 'One main landmark and a heading outline',
    why: 'Agents and screen readers both navigate by landmarks and headings. A page without them is a wall of divs.',
    how: 'Use header, nav, main and footer. One h1, then h2 and h3 without skipping levels.',
  },
  {
    id: 'native-controls',
    category: 'structure',
    title: 'Native buttons and links for every action',
    why: 'A div with a click handler has no role, no name and no keyboard path, so an agent cannot tell it is interactive.',
    how: 'Use button for actions and a with href for navigation. Never attach onClick to a div or span.',
  },
  {
    id: 'stable-names',
    category: 'structure',
    title: 'Stable accessible names on controls',
    why: 'Agents locate controls by their accessible name. Icon-only buttons and generated class names give them nothing to hold on to.',
    how: 'Give every control visible text or an aria-label. Keep names stable across releases.',
  },
  {
    id: 'no-js-content',
    category: 'structure',
    title: 'Core content readable without client scripts',
    why: 'Many agents fetch HTML once. Content that only appears after a script runs is invisible to them.',
    how: 'Render the main content as HTML. Use scripts to enhance, not to reveal.',
  },
  {
    id: 'plain-copy',
    category: 'content',
    title: 'Plain, literal copy',
    why: 'Idioms, puns and marketing fog read as noise to a parser and to a tired reader alike.',
    how: 'Say what the thing is and what happens next. Delete words that do no work.',
  },
  {
    id: 'one-term',
    category: 'content',
    title: 'One term per concept',
    why: 'If the menu says Archive and the toast says Moved to storage, an agent cannot tell they are the same action.',
    how: 'Pick one word for each action and object. Use it everywhere, including errors and docs.',
  },
  {
    id: 'descriptive-links',
    category: 'content',
    title: 'Links that describe their destination',
    why: 'An agent, like a screen-reader user, often sees only the list of links. "Click here" says nothing.',
    how: 'Write "Read the pricing page", not "Learn more". Make every link text unique on the page.',
  },
  {
    id: 'labels',
    category: 'actions',
    title: 'Every field has a visible, bound label',
    why: 'A placeholder vanishes on input. Without a label an agent must guess what the field wants.',
    how: 'Use label with for, plus autocomplete, type and inputmode so the field states its format.',
  },
  {
    id: 'results',
    category: 'actions',
    title: 'Actions report their result in the page',
    why: 'If a submit changes nothing visible, an agent cannot know whether it worked, and may retry.',
    how: 'Show a status message in a live region, or navigate to a confirmation page with a clear heading.',
  },
  {
    id: 'errors',
    category: 'actions',
    title: 'Errors say how to fix, next to the field',
    why: '"Something went wrong" gives neither a person nor an agent a next step.',
    how: 'Write the fix as an instruction, mark the field aria-invalid and point aria-describedby at the message.',
  },
  {
    id: 'destructive',
    category: 'actions',
    title: 'Destructive actions confirm or undo',
    why: 'An agent acting on your behalf should not be able to delete something with a single ambiguous click.',
    how: 'Repeat the consequence in the confirm button, or offer an undo that stays until dismissed.',
  },
  {
    id: 'structured-data',
    category: 'data',
    title: 'Structured data for key facts',
    why: 'Prices, opening hours and product details are easier to read as data than to infer from layout.',
    how: 'Add JSON-LD for the page type. Keep it in sync with the visible text.',
  },
  {
    id: 'metadata',
    category: 'data',
    title: 'Title, description and Open Graph tags',
    why: 'The first thing an agent reads about a page is its head. A missing description means a guessed summary.',
    how: 'Set a title, a meta description, og:title, og:description and og:image with alt text.',
  },
  {
    id: 'robots',
    category: 'trust',
    title: 'Clear robots and sitemap rules',
    why: 'Agents check what they may read. Ambiguous rules lead to over-blocking or over-fetching.',
    how: 'Publish robots.txt and a sitemap. Say explicitly which paths automated readers may use.',
  },
  {
    id: 'rate-limits',
    category: 'trust',
    title: 'Documented limits and contact',
    why: 'An agent that hits an unexplained 429 cannot adapt. A documented limit lets it back off correctly.',
    how: 'Document rate limits and return Retry-After. Give a contact address for automated-access questions.',
  },
];

export const categoryById = (id: CategoryId): Category => {
  const match = categories.find((c) => c.id === id);
  if (!match) throw new Error(`Unknown category: ${id}`);
  return match;
};
