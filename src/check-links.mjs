import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OWN_SITE = /^https?:\/\/(www\.)?anchitverma\.com(?=\/|$)/;
const LINK = /<a\s(?:[^>]*?\s)?href="([^"]*)"/g;
const ID = /\sid="([^"]*)"/g;

/**
 * Fails the build when a link on the site goes to a page or section that
 * doesn't exist. It reads every built page: a link to this site must reach a
 * file in the build, so a link to a draft or a removed post fails, and a
 * #section must be an id on its page. Links to other sites aren't checked
 */
export function checkLinks() {
  return {
    name: 'check-links',
    hooks: {
      'astro:build:done': ({ dir }) => {
        const root = fileURLToPath(dir);
        // The built file a path is served from: the file itself or its folder's index.html
        const fileFor = (path) => [join(root, path), join(root, path, 'index.html')].find((file) => existsSync(file) && statSync(file).isFile());
        const ids = new Map();
        const idsOn = (file) => {
          if (!ids.has(file)) ids.set(file, new Set([...readFileSync(file, 'utf8').matchAll(ID)].map((m) => m[1])));
          return ids.get(file);
        };

        const broken = new Set();
        for (const page of readdirSync(root, { recursive: true }).filter((file) => file.endsWith('.html'))) {
          const pageUrl = `https://site/${page.replace(/(^|\/)index\.html$/, '$1')}`;
          const from = new URL(pageUrl).pathname;
          for (const [, href] of readFileSync(join(root, page), 'utf8').matchAll(LINK)) {
            const link = href.replace(OWN_SITE, '').replaceAll('&amp;', '&');
            if (!link.startsWith('#') && !(link.startsWith('/') && !link.startsWith('//'))) continue;
            const { pathname, hash } = new URL(link, pageUrl);
            const file = fileFor(decodeURIComponent(pathname));
            const id = decodeURIComponent(hash.slice(1));
            if (!file) broken.add(`${from} links to ${href}, which doesn't exist`);
            else if (id && file.endsWith('.html') && !idsOn(file).has(id)) broken.add(`${from} links to ${href}, but ${pathname} has no "${id}" section`);
          }
        }
        if (broken.size) throw new Error(`Links that go nowhere:\n${[...broken].join('\n')}`);
      },
    },
  };
}
