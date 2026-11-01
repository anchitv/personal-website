const NOTES = /\/src\/content\/notes\//;
const HEADING = /^h[2-6]$/;

// A node's text as a reader sees it
const textOf = (node) => (node.type === 'text' ? node.value : (node.children ?? []).map(textOf).join(''));
const escape = (term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// Spaces collapsed and Markdown's curly quotes made straight, as terms are typed
const readable = (text) => text.replace(/\s+/g, ' ').replace(/[‘’]/g, "'").replace(/[“”]/g, '"');
// Whole words, ignoring case and a plural ending
const uses = (text, term) => new RegExp(`(?<![\\p{L}\\p{N}])${escape(term)}(?:e?s)?(?![\\p{L}\\p{N}])`, 'iu').test(text);

// Records, for each of a note's aliases, the id of the heading over the first
// section that uses it (a heading counts as part of its section), so its
// glossary entry can link there. It's null when the note's title, description
// or the text before its first heading uses it. A term the note doesn't use is
// left out, which the glossary page fails the build on. Pages read it back as
// remarkPluginFrontmatter.glossarySections. Runs after rehypeHeadingIds, which
// gives each heading its id, and before rehypeLinkKinds adds text for screen
// readers
export function rehypeGlossarySections() {
  return function (tree, { path, data }) {
    if (!NOTES.test(path ?? '')) return;
    const { title, description = '', aliases = [] } = data.astro.frontmatter;
    const sections = [{ id: null, text: `${title} ${description}` }];
    for (const node of tree.children) {
      if (node.type === 'element' && HEADING.test(node.tagName) && node.properties.id) sections.push({ id: node.properties.id, text: '' });
      sections.at(-1).text += ` ${textOf(node)}`;
    }
    const glossarySections = {};
    for (const term of aliases) {
      const section = sections.find(({ text }) => uses(readable(text), readable(term)));
      if (section) glossarySections[term] = section.id;
    }
    data.astro.frontmatter.glossarySections = glossarySections;
  };
}
