import { SKIP, visit } from 'unist-util-visit';

// Posts, notes and project pages, and the section each is in
const CONTENT = /\/src\/content\/(blog|notes|projects)\//;
const OWN_SITE = /^https?:\/\/(www\.)?anchitverma\.com(\/|$)/;
// The sections a link on the site can go to; anything else is another page
const SECTION = /^\/(blog|notes|projects)(\/|$)/;

const span = (className, children) => ({ type: 'element', tagName: 'span', properties: { className: [className] }, children });

// The last word (or element, like inline code) of a link goes in .link-end,
// which draws the icon after it, so the two never wrap onto separate lines
function wrapLastWord(link) {
  const last = link.children.at(-1);
  if (!last) return false;
  if (last.type !== 'text') {
    link.children[link.children.length - 1] = span('link-end', [last]);
    return true;
  }
  const at = last.value.trimEnd().lastIndexOf(' ') + 1;
  const end = span('link-end', [{ type: 'text', value: last.value.slice(at) }]);
  link.children.splice(-1, 1, ...(at > 0 ? [{ type: 'text', value: last.value.slice(0, at) }] : []), end);
  return true;
}

// Marks where a Markdown link goes, for its colour and the icon
// typography.css draws after it. A post, note or project gets its section
// (.link-blog, .link-notes, .link-projects) and another page of the site
// .link-page. Another site gets .link-external, with "(external site)" for
// screen readers. Elsewhere on the page gets .link-jump, with the section
// of the page it's on, and .link-jump-up when the target comes before the
// link. Raw HTML in a post is parsed only after this runs, so its links
// carry the same classes and spans themselves (see .compare). Runs after
// rehypeHeadingIds, so headings have their ids, and before
// rehypeHeadingLinks, whose "#" links aren't there yet
export function rehypeLinkKinds() {
  return function (tree, file) {
    const own = CONTENT.exec(file.path ?? '')?.[1];
    if (!own) return;
    // Ids passed so far, in page order: a "#" link to one of these points up
    const above = new Set();
    visit(tree, 'element', (node) => {
      if (node.properties.id) above.add(String(node.properties.id));
      // Heading text feeds the table of contents; keep it clean
      if (/^h[1-6]$/.test(node.tagName)) return SKIP;
      if (node.tagName !== 'a') return;
      const href = String(node.properties.href ?? '');
      // A full link to this site counts as a page on it
      const path = href.replace(OWN_SITE, '/');
      const external = /^https?:\/\//.test(path);
      const jump = href.startsWith('#') && !node.properties.dataFootnoteRef && !node.properties.dataFootnoteBackref;
      const page = path.startsWith('/') && !path.startsWith('//');
      if (!external && !jump && !page) return SKIP;
      // The icons hang off the last word, so a link with no text gets nothing
      if ((external || jump) && !wrapLastWord(node)) return SKIP;
      const up = jump && above.has(decodeURIComponent(href.slice(1)));
      const kind = external ? ['link-external'] : jump ? ['link-jump', ...(up ? ['link-jump-up'] : []), `link-${own}`] : [`link-${SECTION.exec(path)?.[1] ?? 'page'}`];
      node.properties.className = [...(node.properties.className ?? []), ...kind];
      if (external) node.children.push(span('visually-hidden', [{ type: 'text', value: ' (external site)' }]));
      return SKIP;
    });
  };
}
