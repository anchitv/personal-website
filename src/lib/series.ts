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
/** Consecutive parts under a heading, e.g. Foundations for parts 1 to 4. Numbers run on across topics */
type Topic = { readonly topic: string; readonly parts: readonly (string | Split)[] };

/**
 * Every blog series. The key is the slug: it's the folder its posts live in
 * (src/content/blog/<slug>/) and the /blog/?series=<slug> filter. `name` is
 * shown to readers and `color` is one of SERIES_COLORS. `parts` lists the
 * file names of the posts in reading order, and each part's number is its
 * place in the list. Wrap consecutive parts in { topic, parts } to give them
 * a heading. Only written posts are listed: add each one as you write it. The
 * build fails when this list and the series folder disagree (see
 * checkSeries).
 */
export const SERIES = {
  'homelab': {
    name: 'Homelab',
    color: 'teal',
    parts: [
      {
        topic: 'Foundations',
        parts: ['what-is-a-homelab', 'networking-basics', 'setting-up-the-server', 'running-containers'],
      },
    ],
  },
  'email': {
    name: 'Email',
    color: 'violet',
    parts: ['choosing-a-provider', 'setting-up-simplelogin'],
  },
} as const satisfies Record<string, { name: string; color: SeriesColor; parts: readonly (string | Split | Topic)[] }>;

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
  /** Heading of the parts it's grouped with, if any */
  topic?: string;
}

/** A part, or a split post's sub-parts under its title */
export type SeriesItem = SeriesPart | { number: string; title: string; topic?: string; parts: SeriesPart[] };

export interface SeriesOutline {
  items: SeriesItem[];
  /** Every part in reading order, sub-parts in place of their split post */
  parts: SeriesPart[];
}

/** A series in reading order, each part numbered from its place in the list */
export function seriesOutline(id: string): SeriesOutline {
  // Topics don't take a number: each part in one gets its topic instead
  const entries = (SERIES[id as Series].parts as readonly (string | Split | Topic)[]).flatMap(
    (entry): { item: string | Split; topic?: string }[] =>
      typeof entry === 'object' && 'topic' in entry
        ? entry.parts.map((item) => ({ item, topic: entry.topic }))
        : [{ item: entry }],
  );
  const toPart = (slug: string, number: string, topic?: string): SeriesPart => ({ number, slug, post: `${id}/${slug}`, topic });
  const items = entries.map(({ item, topic }, i): SeriesItem =>
    typeof item === 'object'
      ? { number: `${i + 1}`, title: item.title, topic, parts: item.parts.map((slug, j) => toPart(slug, `${i + 1}.${j + 1}`, topic)) }
      : toPart(item, `${i + 1}`, topic),
  );
  return { items, parts: items.flatMap((item) => ('parts' in item ? item.parts : [item])) };
}

/** Where a post sits in its series */
export interface PostSeries {
  id: Series;
  /** "4", or "7.1" for a sub-part */
  number: string;
  /** Heading of the parts it's grouped with, if any */
  topic?: string;
  /** Position in reading order, for sorting */
  order: number;
}

/** The series a post is part of, from its id (<series>/<slug>), if any */
export function postSeries(postId: string): PostSeries | undefined {
  const [id, slug] = postId.split('/');
  if (!slug || !isSeries(id)) return undefined;
  const outline = seriesOutline(id);
  const order = outline.parts.findIndex((part) => part.post === postId);
  if (order === -1) return undefined;
  const { number, topic } = outline.parts[order];
  return { id, number, topic, order };
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

/** A topic in URLs, e.g. "foundations" in /blog/?series=homelab&topic=foundations */
export function topicId(topic: string): string {
  return topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/** One step of the label above a series post's title; the part has no link */
export interface PartCrumb {
  text: string;
  href?: string;
}

/**
 * The label above a series post's title, step by step: the series and its
 * topic, each linking to the blog filtered to it, then the part
 */
export function partCrumbs(series: PostSeries): PartCrumb[] {
  const filter = `/blog/?series=${series.id}`;
  return [
    { text: seriesName(series.id), href: filter },
    ...(series.topic ? [{ text: series.topic, href: `${filter}&topic=${topicId(series.topic)}` }] : []),
    { text: `Part ${series.number}` },
  ];
}

/** The label as plain text, where it sits inside a link to the post: "Homelab · Foundations · Part 4" */
export function partLabel(series: PostSeries): string {
  return partCrumbs(series)
    .map((crumb) => crumb.text)
    .join(' · ');
}

interface DatedEntry {
  id: string;
  data: { date: Date };
}

/**
 * The newest posts for a short list, newest first. Each series shows once, as
 * its newest part, so one series can't fill the list; if that leaves fewer
 * than `count` posts, more parts of the same series fill the gaps.
 */
export function latestPostsPerSeries<T extends DatedEntry>(posts: T[], count: number): T[] {
  // On the same day, the later part counts as newer
  const newestFirst = (a: T, b: T) =>
    b.data.date.valueOf() - a.data.date.valueOf() || (postSeries(b.id)?.order ?? 0) - (postSeries(a.id)?.order ?? 0);
  const sorted = [...posts].sort(newestFirst);

  const shownSeries = new Set<string>();
  const picked = sorted
    .filter((post) => {
      const id = postSeries(post.id)?.id;
      if (!id) return true;
      if (shownSeries.has(id)) return false;
      shownSeries.add(id);
      return true;
    })
    .slice(0, count);
  const fillers = sorted.filter((post) => !picked.includes(post)).slice(0, count - picked.length);

  return [...picked, ...fillers].sort(newestFirst);
}
