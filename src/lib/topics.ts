/**
 * Every note topic. The key is the slug: it goes in frontmatter
 * (`topic: <slug>`). The value is the heading shown to readers; the Notes page
 * lists topics A–Z by it. A frontmatter topic missing from this list fails the build.
 */
export const TOPICS = {
  'networking': 'Networking',
  'dns-email': 'DNS, domains and email',
  'servers': 'Servers and containers',
  'homelab': 'Homelab',
} as const satisfies Record<string, string>;

export type Topic = keyof typeof TOPICS;

export function isTopic(topic: string): topic is Topic {
  return Object.hasOwn(TOPICS, topic);
}
