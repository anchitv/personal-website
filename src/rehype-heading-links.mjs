import { visit } from 'unist-util-visit';

const HEADING = /^h[2-6]$/;
// Only posts and notes get heading links; project pages keep plain headings
const LINKED_CONTENT = /\/src\/content\/(blog|notes)\//;

// Appends an empty link to each heading; HeadingLinks.astro draws its "#" in
// CSS, so the heading text Astro collects for the table of contents stays clean.
// Runs after rehypeHeadingIds, which gives each heading its id.
export function rehypeHeadingLinks() {
  return function (tree, file) {
    if (!LINKED_CONTENT.test(file.path ?? '')) return;
    visit(tree, 'element', (node) => {
      if (!HEADING.test(node.tagName) || !node.properties.id) return;
      node.children.push({
        type: 'element',
        tagName: 'a',
        properties: {
          className: ['heading-link'],
          href: `#${node.properties.id}`,
          ariaLabel: 'Copy link to this section',
        },
        children: [],
      });
    });
  };
}
