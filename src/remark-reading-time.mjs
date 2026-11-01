import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';
import { visit } from 'unist-util-visit';

export function remarkReadingTime() {
  return function (tree, { data }) {
    // Raw HTML (a comparison table) counts its text, not its tags, nor the
    // text only screen readers get
    const htmlText = [];
    visit(tree, 'html', (node) => {
      htmlText.push(node.value.replace(/<span class="visually-hidden">[^<]*<\/span>/g, ' ').replace(/<[^>]*>/g, ' '));
    });
    const textOnPage = [toString(tree, { includeHtml: false }), ...htmlText].join(' ');
    const readingTime = getReadingTime(textOnPage);
    data.astro.frontmatter.minutesRead = readingTime.text;
  };
}
