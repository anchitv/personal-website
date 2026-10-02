import { visit } from 'unist-util-visit';

const HEADING = /^h[2-6]$/;
const NOTE_LINK = /^\/notes\/([\w-]+)\/(#|$)/;
const POSTS = /\/src\/content\/blog\//;

// Records, for each note a post links to, the id of the heading above the
// post's first link to it (null before the first heading), so the note's
// "Mentioned in" list can link to that section. Pages read it back as
// remarkPluginFrontmatter.noteSections. Runs after rehypeHeadingIds, which
// gives each heading its id
export function rehypeNoteSections() {
  return function (tree, { path, data }) {
    if (!POSTS.test(path ?? '')) return;
    const sections = {};
    let heading = null;
    visit(tree, 'element', (node) => {
      if (HEADING.test(node.tagName) && node.properties.id) heading = node.properties.id;
      const noteId = node.tagName === 'a' && NOTE_LINK.exec(node.properties.href ?? '')?.[1];
      if (noteId && !(noteId in sections)) sections[noteId] = heading;
    });
    data.astro.frontmatter.noteSections = sections;
  };
}
