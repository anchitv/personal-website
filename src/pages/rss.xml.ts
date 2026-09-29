import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
import type { APIContext } from 'astro';

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

  const blogItems = posts.map((post) => ({
    title: post.data.title,
    pubDate: post.data.date,
    description: post.data.description,
    link: `/blog/${post.id}/`,
    content: sanitizeHtml(parser.render(stripFrontmatter(post.body ?? '')), {
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
    customData: '<language>en-us</language>',
  });
}
