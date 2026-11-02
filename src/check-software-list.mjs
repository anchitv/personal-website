import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { unusedSoftware } from '../scripts/check-software-links.mjs';

/**
 * Fails the build when scripts/check-software-links.mjs lists software that
 * no post, note, project or the about page mentions, so the list holds only
 * what the site uses. A post brought in later adds its software back with it
 */
export function checkSoftwareList() {
  let content;
  let about;
  return {
    name: 'check-software-list',
    hooks: {
      'astro:config:done': ({ config }) => {
        content = fileURLToPath(new URL('src/content/', config.root));
        about = fileURLToPath(new URL('src/pages/about.astro', config.root));
      },
      'astro:build:start': () => {
        const pages = readdirSync(content, { recursive: true })
          .filter((file) => /^(blog|notes|projects)\/.+\.md$/.test(file))
          .map((file) => join(content, file));
        const unused = unusedSoftware([...pages, about]);
        if (unused.length) {
          throw new Error(`Software in scripts/check-software-links.mjs that no page mentions: ${unused.join(', ')}. Remove it from the list`);
        }
      },
    },
  };
}
