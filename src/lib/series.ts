/**
 * The colours a series can use. Each has a base and a hover shade for both
 * themes in src/styles/tokens.css (--color-series-<colour> and
 * --color-series-<colour>-hover), checked for contrast and for standing apart
 * from the site's own accents. More series than colours means reusing one;
 * the series name always shows next to the colour, so that stays clear.
 */
export const SERIES_COLORS = ['teal', 'violet', 'terracotta', 'orchid'] as const;

export type SeriesColor = (typeof SERIES_COLORS)[number];

/** A post split into sub-parts, which share its number: Part 7.1, 7.2 */
type Split = { readonly title: string; readonly parts: readonly string[] };

/**
 * Every blog series. The key is the slug: it's the folder its posts live in
 * (src/content/blog/<slug>/) and the /blog/?series=<slug> filter. `name` is
 * shown to readers and `color` is one of SERIES_COLORS. `parts` lists the
 * file names of the posts in reading order, and each part's number is its
 * place in the list. Only written posts are listed: add each one as you write
 * it. The build fails when this list and the series folder disagree (see
 * checkSeries).
 */
export const SERIES = {
  'homelab': {
    name: 'Homelab',
    color: 'teal',
    parts: ['what-is-a-homelab', 'networking-basics', 'setting-up-the-server', 'running-containers'],
  },
  'email': {
    name: 'Email',
    color: 'violet',
    parts: ['choosing-a-provider', 'setting-up-simplelogin'],
  },
} as const satisfies Record<string, { name: string; color: SeriesColor; parts: readonly (string | Split)[] }>;

// The build doesn't type-check, so a colour typo would otherwise pass silently
for (const [id, { color }] of Object.entries(SERIES)) {
  if (!(SERIES_COLORS as readonly string[]).includes(color)) {
    throw new Error(`Series "${id}" uses unknown colour "${color}": pick one of ${SERIES_COLORS.join(', ')}`);
  }
}

export type Series = keyof typeof SERIES;

export function isSeries(id: string): id is Series {
  return Object.hasOwn(SERIES, id);
}

/** Display name for a series slug. Slugs are validated against SERIES at build time. */
export function seriesName(id: string): string {
  return SERIES[id as Series].name;
}

/**
 * Inline style that paints an element in its series' colour: the accent for
 * text and links, the tag colour for filter buttons, and the surface colour
 * for tints and borders.
 */
export function seriesColors(id: string): string {
  const color = SERIES[id as Series].color;
  return `--color-accent: var(--color-series-${color}); --color-accent-hover: var(--color-series-${color}-hover); --color-tag: var(--color-series-${color}); --color-series-surface: var(--color-series-${color}-surface, var(--color-series-${color}));`;
}

export interface SeriesPart {
  /** "4", or "7.1" for a sub-part */
  number: string;
  /** File name in the series folder */
  slug: string;
  /** Collection id of the post: <series>/<slug> */
  post: string;
}

/** A part, or a split post's sub-parts under its title */
export type SeriesItem = SeriesPart | { number: string; title: string; parts: SeriesPart[] };

export interface SeriesOutline {
  items: SeriesItem[];
  /** Every part in reading order, sub-parts in place of their split post */
  parts: SeriesPart[];
}

/** A series in reading order, each part numbered from its place in the list */
export function seriesOutline(id: string): SeriesOutline {
  const toPart = (slug: string, number: string): SeriesPart => ({ number, slug, post: `${id}/${slug}` });
  const items = (SERIES[id as Series].parts as readonly (string | Split)[]).map((item, i): SeriesItem =>
    typeof item === 'object'
      ? { number: `${i + 1}`, title: item.title, parts: item.parts.map((slug, j) => toPart(slug, `${i + 1}.${j + 1}`)) }
      : toPart(item, `${i + 1}`),
  );
  return { items, parts: items.flatMap((item) => ('parts' in item ? item.parts : [item])) };
}

/** Where a post sits in its series */
export interface PostSeries {
  id: Series;
  /** "4", or "7.1" for a sub-part */
  number: string;
  /** Position in reading order, for sorting */
  order: number;
}

/** The series a post is part of, from its id (<series>/<slug>), if any */
export function postSeries(postId: string): PostSeries | undefined {
  const [id, slug] = postId.split('/');
  if (!slug || !isSeries(id)) return undefined;
  const outline = seriesOutline(id);
  const order = outline.parts.findIndex((part) => part.post === postId);
  return order === -1 ? undefined : { id, number: outline.parts[order].number, order };
}

/**
 * Fails the build when a series list and its folder disagree: a post in the
 * folder that isn't listed, a listed post that doesn't exist, or a file name
 * listed twice. Pass every post, drafts included. Posts aren't kept in git, so a checkout can have none of a
 * series' posts: missing ones only count when some of them are there.
 */
export function checkSeries(posts: { id: string }[]): void {
  const ids = new Set(posts.map((post) => post.id));
  for (const id of Object.keys(SERIES)) {
    const { parts } = seriesOutline(id);
    const where = `the ${id} series in src/lib/series.ts`;
    const hasPosts = parts.some((part) => ids.has(part.post));
    for (const [i, part] of parts.entries()) {
      if (parts.findIndex((other) => other.slug === part.slug) !== i) {
        throw new Error(`"${part.slug}" is listed twice in ${where}`);
      }
      if (hasPosts && !ids.has(part.post)) {
        throw new Error(`${where} lists "${part.slug}", but src/content/blog/${part.post}.md doesn't exist: add the post, or take it out of the list`);
      }
    }
    for (const post of posts) {
      if (post.id.startsWith(`${id}/`) && !parts.some((part) => part.post === post.id)) {
        throw new Error(`src/content/blog/${post.id}.md is in the ${id} folder but not in ${where}: add it where it belongs in the order`);
      }
    }
  }
}

/**
 * A mention of another part in a series post's Markdown: [[part:caddy]] for
 * "part 6", [[Part:caddy]] for "Part 6". src/remark-part-refs.mjs writes them
 * out in posts; writePartRefs does it where posts skip that pipeline
 */
export const PART_REF = /\[\[([Pp]art):([\w-]+)\]\]/g;

/**
 * A series post's Markdown with its part mentions written out, as a Markdown
 * link when `link` gives the part one, for places that render Markdown
 * without src/remark-part-refs.mjs (the RSS feed, note snippets). Mentions
 * that match no part stay as written; the post page fails the build on them
 */
export function writePartRefs(postId: string, markdown: string, link?: (part: SeriesPart) => string | undefined): string {
  const series = postSeries(postId);
  const parts = series ? seriesOutline(series.id).parts : [];
  return markdown.replace(PART_REF, (placeholder, word, slug) => {
    const part = parts.find((p) => p.slug === slug);
    if (!part) return placeholder;
    const href = link?.(part);
    return href ? `[${word} ${part.number}](${href})` : `${word} ${part.number}`;
  });
}

/** A post's title out of context (browser tab, feed, preview image): series parts lead with their number */
export function postTitle(post: { id: string; data: { title: string } }): string {
  const series = postSeries(post.id);
  return series ? `Part ${series.number}: ${post.data.title}` : post.data.title;
}

/** The label above a series post's title, e.g. "Homelab · Part 4" */
export function partLabel(series: PostSeries): string {
  return `${seriesName(series.id)} · Part ${series.number}`;
}
