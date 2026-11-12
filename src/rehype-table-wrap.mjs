import { visit, SKIP } from 'unist-util-visit';

const HEADING = /^h[2-6]$/;
// A table written as HTML: one block, from <table> to </table>
const RAW_TABLE = /^\s*<table\b[^>]*>[\s\S]*<\/table>\s*$/;
const RAW_LABEL = /^\s*<table\b[^>]*\baria-labelledby="([^"]*)"/;

// Puts every table in a post or note in a .table-wrap box, the one
// src/styles/tables.css styles. A table too wide for a phone scrolls inside
// it, so the page never scrolls sideways. The box takes tabindex="0",
// role="region" and a label, so keyboards can scroll it too: the table's own
// aria-labelledby, or else the heading above it, or else the page's title.
// A table written as HTML reaches this plugin as text, since Astro parses
// HTML in Markdown only after every plugin, so the box goes round its text.
// Runs after rehypeHeadingIds, which gives each heading its id
export function rehypeTableWrap() {
  return function (tree, { data }) {
    const title = data.astro?.frontmatter?.title;
    let heading = null;
    visit(tree, (node, index, parent) => {
      if (node.type === 'element' && HEADING.test(node.tagName) && node.properties.id) heading = node.properties.id;
      if (!parent) return;

      if (node.type === 'element' && node.tagName === 'table') {
        const label = node.properties.ariaLabelledBy?.join(' ') ?? heading;
        if (label) node.properties.ariaLabelledBy = [label];
        else if (title) node.properties.ariaLabel = title;
        parent.children[index] = {
          type: 'element',
          tagName: 'div',
          properties: { className: ['table-wrap'], tabIndex: 0, role: 'region', ...(label ? { ariaLabelledBy: [label] } : { ariaLabel: title }) },
          children: [node],
        };
        return SKIP;
      }

      if (node.type === 'raw' && RAW_TABLE.test(node.value)) {
        const label = RAW_LABEL.exec(node.value)?.[1] ?? heading;
        const name = label ? `aria-labelledby="${label}"` : `aria-label="${title.replaceAll('"', '&quot;')}"`;
        node.value = `<div class="table-wrap" tabindex="0" role="region" ${name}>\n${node.value.trim()}\n</div>`;
      }
    });
  };
}
