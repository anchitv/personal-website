import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { rehypeHeadingIds, unified } from '@astrojs/markdown-remark';
import { FontaineTransform } from 'fontaine';
import { partRefs, remarkPartRefs } from './src/remark-part-refs.mjs';
import { remarkReadingTime } from './src/remark-reading-time.mjs';
import { rehypeCodeCopy } from './src/rehype-code-copy.mjs';
import { rehypeHeadingLinks } from './src/rehype-heading-links.mjs';
import { rehypeNoteSections } from './src/rehype-note-sections.mjs';

export default defineConfig({
  site: 'https://anchitverma.com',
  trailingSlash: 'always',
  // Astro 7's default also strips whitespace between tags, which joins
  // inline text to links (e.g. "by email:contact@…" on /about/)
  compressHTML: true,
  integrations: [sitemap({ filter: (page) => !page.includes('/search/') && !page.includes('/principles/') })],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light-default',
        dark: 'github-dark-default',
      },
      defaultColor: false,
      transformers: [
        {
          // A fence's title, as in ```yaml title="compose.yaml", for
          // src/rehype-code-copy.mjs to show in place of the language
          name: 'code-title',
          pre(node) {
            const title = this.options.meta?.__raw?.match(/title="([^"]+)"/)?.[1];
            if (title) node.properties.dataTitle = title;
          },
        },
        {
          // The light theme's comment grey is 3.9:1 on --color-code-bg, too
          // faint to read; GitHub's newer muted grey is 5.2:1
          name: 'darker-comments',
          span(node) {
            const { style } = node.properties;
            if (typeof style === 'string') node.properties.style = style.replace(/--shiki-light:#6e7781/i, '--shiki-light:#59636e');
          },
        },
      ],
    },
    processor: unified({
      // Part numbers first, so the read time counts them as written out
      remarkPlugins: [[remarkPartRefs, partRefs()], remarkReadingTime],
      // Astro adds heading ids after these plugins; run it first so the links have ids to point at
      rehypePlugins: [rehypeHeadingIds, rehypeHeadingLinks, rehypeNoteSections, rehypeCodeCopy],
    }),
  },
  vite: {
    plugins: [
      FontaineTransform.vite({
        // Per family: a plain array would give every font these serif metrics.
        // The rest resolve by category (JetBrains Mono: monospace; else sans-serif).
        fallbacks: { 'Crimson Pro Variable': ['Georgia', 'Times New Roman'] },
        resolvePath: (id) => new URL(`./node_modules${id}`, import.meta.url),
      }),
    ],
    ssr: {
      // Native addon; must not be bundled by Vite
      external: ['@resvg/resvg-js'],
    },
  },
});
