/**
 * Every tag the site uses. The key is the slug: it goes in frontmatter, URLs
 * (/tags/<slug>/) and filtering. The value is the name shown to readers.
 * A frontmatter tag missing from this list fails the build.
 */
export const TAGS = {
  'ai': 'AI',
  'alpha-beta-pruning': 'alpha-beta pruning',
  'android': 'Android',
  'artificial-intelligence': 'artificial intelligence',
  'astro': 'Astro',
  'c': 'C',
  'corenlp': 'CoreNLP',
  'craft': 'craft',
  'css': 'CSS',
  'dart': 'Dart',
  'data-structures': 'data structures',
  'distributed-systems': 'distributed systems',
  'dns': 'DNS',
  'elasticsearch': 'Elasticsearch',
  'email': 'email',
  'flutter': 'Flutter',
  'games': 'games',
  'homelab': 'homelab',
  'i3': 'i3',
  'ios': 'iOS',
  'jupyter': 'Jupyter',
  'linux': 'Linux',
  'markdown': 'Markdown',
  'minimax': 'minimax',
  'mobile': 'mobile',
  'networking': 'networking',
  'nlp': 'NLP',
  'openai-gym': 'OpenAI Gym',
  'pagerank': 'PageRank',
  'polybar': 'Polybar',
  'probability': 'probability',
  'prolog': 'Prolog',
  'python': 'Python',
  'pytorch': 'PyTorch',
  'reinforcement-learning': 'reinforcement learning',
  'satori': 'Satori',
  'scala': 'Scala',
  'search': 'search',
  'shell': 'shell',
  'sockets': 'sockets',
  'software': 'software',
  'spark': 'Spark',
  'tcp': 'TCP',
  'typescript': 'TypeScript',
  'udp': 'UDP',
  'university': 'university',
  'vim': 'Vim',
  'web': 'web',
  'writing': 'writing',
  'xml': 'XML',
  'zsh': 'Zsh',
} as const satisfies Record<string, string>;

export type Tag = keyof typeof TAGS;

export function isTag(tag: string): tag is Tag {
  return Object.hasOwn(TAGS, tag);
}

/** Display name for a tag slug. Slugs are validated against TAGS at build time. */
export function tagLabel(tag: string): string {
  return TAGS[tag as Tag];
}

/** Sort tag slugs by their display names. */
export function sortTags(tags: string[]): string[] {
  return [...tags].sort((a, b) => tagLabel(a).localeCompare(tagLabel(b), 'en', { sensitivity: 'base' }));
}
