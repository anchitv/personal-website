import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
import type { APIContext } from 'astro';
import { postTitle, writePartRefs } from '../lib/series';

// @astrojs/rss requires pre-rendered HTML, so we use MarkdownIt instead of
// Astro's render pipeline. This means Shiki syntax highlighting and remark
// plugins are not applied in RSS content — a known limitation.
const parser = new MarkdownIt();

function stripFrontmatter(body: string): string {
  return body.replace(/^---[\s\S]*?---\s*/, '');
}

export async function GET(context: APIContext) {
  const [posts, notes] = await Promise.all([
    getCollection('blog', ({ data }) => !data.draft),
    getCollection('notes', ({ data }) => !data.draft),
  ]);

  // remark-part-refs doesn't run here either, so part mentions get written out
  // first, linked when the part is published
  const published = new Set(posts.map((post) => post.id));
  const partLink = (part: { post: string }) => (published.has(part.post) ? `/blog/${part.post}/` : undefined);

  const blogItems = posts.map((post) => ({
    title: postTitle(post),
    pubDate: post.data.date,
    description: post.data.description,
    link: `/blog/${post.id}/`,
    content: sanitizeHtml(parser.render(writePartRefs(post.id, stripFrontmatter(post.body ?? ''), partLink)), {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
    }),
  }));

  const noteItems = notes.map((note) => ({
    title: note.data.title,
    pubDate: note.data.date,
    description: note.data.description ?? note.data.title,
    link: `/notes/${note.id}/`,
    content: sanitizeHtml(parser.render(stripFrontmatter(note.body ?? '')), {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
    }),
  }));

  const allItems = [...blogItems, ...noteItems].sort(
    (a, b) => b.pubDate.valueOf() - a.pubDate.valueOf()
  );

  return rss({
    title: 'Anchit Verma',
    description: 'Writing about software, ideas and the things I\'m building.',
    site: context.site!,
    items: allItems,
    // atom:link rel="self" tells feed readers the feed's own canonical URL
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    customData: `<language>en-us</language><atom:link href="${new URL('/rss.xml', context.site)}" rel="self" type="application/rss+xml"/>`,
  });
}
