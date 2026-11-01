import { existsSync, readFileSync } from 'node:fs';
import { SKIP, visit } from 'unist-util-visit';
import { PART_REF, SERIES, partName, postId, seriesOutline } from './lib/series.ts';

// A post's file in src/content/blog, from its path
const BLOG_FILE = /\/src\/content\/blog\/(.+\.md)$/;

/**
 * Every series part's number and topic, its place in reading order, and its link once
 * published (drafts have none), by series and name: the options for
 * remarkPartRefs. Given to it as options rather than read inside it, so
 * they're part of Astro's config digest: a change to a series list, or a part
 * getting published, re-renders the posts instead of leaving cached numbers
 * behind
 */
export function partRefs() {
  return Object.fromEntries(
    Object.keys(SERIES).map((id) => [
      id,
      Object.fromEntries(
        seriesOutline(id).parts.map((part, order) => {
          const file = `src/content/blog/${part.file}`;
          const published = existsSync(file) && !/^draft:\s*true\s*$/m.test(readFileSync(file, 'utf8'));
          return [part.slug, { number: part.number, topic: part.topic, order, href: published ? `/blog/${part.post}/` : null }];
        }),
      ),
    ]),
  );
}

/**
 * Turns [[part:caddy]] in a series post into "part 6", linked once that part
 * is published; [[Part:caddy]] gives "Part 6". A part in another topic gets
 * its topic too: "Foundations part 4" (see partName). A post only refers back: the
 * name (its file name without the number) must be an earlier part of the post's own series. Any other
 * placeholder stays as written and goes in frontmatter.partRefErrors, which
 * the blog post page fails the build on (a throw here would only be logged)
 */
export function remarkPartRefs(refs) {
  return function (tree, file) {
    const [, path = ''] = BLOG_FILE.exec(file.path ?? '') ?? [];
    const [series, slug] = postId(path).split('/');
    const current = refs[series]?.[slug];
    const errors = [];
    visit(tree, 'text', (node, index, parent) => {
      const nodes = [];
      let last = 0;
      for (const match of node.value.matchAll(PART_REF)) {
        const [placeholder, word, target] = match;
        const ref = refs[series]?.[target];
        if (!ref || !current || ref.order >= current.order) {
          errors.push(placeholder);
          continue;
        }
        const text = { type: 'text', value: partName(word, ref, current.topic) };
        nodes.push({ type: 'text', value: node.value.slice(last, match.index) });
        nodes.push(ref.href ? { type: 'link', url: ref.href, children: [text] } : text);
        last = match.index + placeholder.length;
      }
      if (last === 0) return;
      nodes.push({ type: 'text', value: node.value.slice(last) });
      const kept = nodes.filter((n) => n.type !== 'text' || n.value);
      parent.children.splice(index, 1, ...kept);
      return [SKIP, index + kept.length];
    });
    if (errors.length > 0) file.data.astro.frontmatter.partRefErrors = errors;
  };
}
