import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { FontaineTransform } from 'fontaine';
import { remarkReadingTime } from './src/remark-reading-time.mjs';

export default defineConfig({
  site: 'https://anchit.me',
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (page) => !page.includes('/search/') })],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'rose-pine-dawn',
        dark: 'rose-pine-moon',
      },
      defaultColor: false,
    },
    remarkPlugins: [remarkReadingTime],
  },
  vite: {
    plugins: [
      FontaineTransform.vite({
        fallbacks: ['Georgia', 'Times New Roman', 'serif'],
        resolvePath: (id) => new URL(`./node_modules${id}`, import.meta.url),
      }),
    ],
  },
});
