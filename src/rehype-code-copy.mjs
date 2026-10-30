import { SKIP, visit } from 'unist-util-visit';

// Only posts and notes get the frame, as with heading links
const COPYABLE_CONTENT = /\/src\/content\/(blog|notes)\//;
// Languages not worth naming in the bar
const PLAIN = new Set(['text', 'txt', 'plaintext']);

// A 16px icon in the style of the site's others; shapes are [tag, attributes]
function icon(className, shapes) {
  return {
    type: 'element',
    tagName: 'svg',
    properties: {
      className: [className],
      width: 16,
      height: 16,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 2,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      ariaHidden: 'true',
    },
    children: shapes.map(([tagName, properties]) => ({ type: 'element', tagName, properties, children: [] })),
  };
}

const label = (className, value) => ({ type: 'element', tagName: 'span', properties: { className: [className] }, children: [{ type: 'text', value }] });

// Puts each code block in a frame, with a bar above it when there's a name
// to show: the file's, for a block with a title (set in astro.config.mjs), or
// else the language. A button in the code's top right corner copies it,
// showing a copy icon and a check once it's copied. CodeCopy.astro styles
// them and does the copying
export function rehypeCodeCopy() {
  return function (tree, file) {
    if (!COPYABLE_CONTENT.test(file.path ?? '')) return;
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'pre' || !parent || index === undefined) return;
      const title = node.properties.dataTitle;
      delete node.properties.dataTitle;
      const language = String(node.properties.dataLanguage ?? '');
      const name = title ? label('code-title', String(title)) : language && !PLAIN.has(language) ? label('code-lang', language) : null;
      const button = {
        type: 'element',
        tagName: 'button',
        properties: { type: 'button', className: ['code-copy'], ariaLabel: 'Copy code', title: 'Copy code' },
        children: [
          icon('code-copy-icon', [
            ['rect', { x: 9, y: 9, width: 13, height: 13, rx: 2, ry: 2 }],
            ['path', { d: 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' }],
          ]),
          icon('code-copied-icon', [['polyline', { points: '20 6 9 17 4 12' }]]),
        ],
      };
      parent.children[index] = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['code-block'] },
        children: [...(name ? [{ type: 'element', tagName: 'div', properties: { className: ['code-bar'] }, children: [name] }] : []), button, node],
      };
      // The block is wrapped; don't look inside it for more
      return SKIP;
    });
  };
}
