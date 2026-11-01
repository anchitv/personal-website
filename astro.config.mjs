import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { rehypeHeadingIds, unified } from '@astrojs/markdown-remark';
import { FontaineTransform } from 'fontaine';
import { partRefs, remarkPartRefs } from './src/remark-part-refs.mjs';
import { remarkReadingTime } from './src/remark-reading-time.mjs';
import { checkLinks } from './src/check-links.mjs';
import { checkSoftwareList } from './src/check-software-list.mjs';
import { rehypeCodeCopy } from './src/rehype-code-copy.mjs';
import { rehypeGlossarySections } from './src/rehype-glossary-sections.mjs';
import { rehypeHeadingLinks } from './src/rehype-heading-links.mjs';
import { rehypeLinkKinds } from './src/rehype-link-kinds.mjs';
import { rehypeNoteSections } from './src/rehype-note-sections.mjs';

export default defineConfig({
  site: 'https://anchitverma.com',
  trailingSlash: 'always',
  // Removed homelab posts, to what replaced them: networking basics became
  // notes, and setting up the server was dropped from the series
  redirects: {
    '/blog/homelab/networking-basics': '/notes/',
    '/blog/homelab/setting-up-the-server': '/blog/homelab/choosing-how-to-run/',
    '/notes/podman-restart': '/notes/rootless-podman/#keeping-containers-running',
    '/notes/rootless-ownership': '/notes/rootless-podman/#who-owns-the-files',
  },
  // Astro 7's default also strips whitespace between tags, which joins
  // inline text to links (e.g. "by email:contact@…" on /about/)
  compressHTML: true,
  integrations: [checkLinks(), checkSoftwareList(), sitemap({ filter: (page) => !page.includes('/search/') && !page.includes('/principles/') })],
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
      rehypePlugins: [rehypeHeadingIds, rehypeGlossarySections, rehypeLinkKinds, rehypeHeadingLinks, rehypeNoteSections, rehypeCodeCopy],
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
