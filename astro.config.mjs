import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { rehypeHeadingIds, unified } from '@astrojs/markdown-remark';
import { FontaineTransform } from 'fontaine';
import { partRefs, remarkPartRefs } from './src/remark-part-refs.mjs';
import { remarkReadingTime } from './src/remark-reading-time.mjs';
import { rehypeHeadingLinks } from './src/rehype-heading-links.mjs';

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
        light: 'rose-pine-dawn',
        dark: 'rose-pine-moon',
      },
      defaultColor: false,
    },
    processor: unified({
      // Part numbers first, so the read time counts them as written out
      remarkPlugins: [[remarkPartRefs, partRefs()], remarkReadingTime],
      // Astro adds heading ids after these plugins; run it first so the links have ids to point at
      rehypePlugins: [rehypeHeadingIds, rehypeHeadingLinks],
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
