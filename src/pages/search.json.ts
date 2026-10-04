import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { partCrumbs, partLabel, postSeries, seriesColors } from '../lib/series';

// A series post's label above its title, as in the blog list
function seriesLabel(id: string) {
  const series = postSeries(id);
  return series && { label: partLabel(series), crumbs: partCrumbs(series), style: seriesColors(series.id) };
}

export const GET: APIRoute = async () => {
  const [blog, notes, projects] = await Promise.all([
    getCollection('blog', ({ data }) => !data.draft),
    getCollection('notes', ({ data }) => !data.draft),
    getCollection('projects', ({ data }) => !data.draft),
  ]);

  const entries = [
    ...blog.map((post) => ({
      type: 'blog' as const,
      title: post.data.title,
      series: seriesLabel(post.id),
      description: post.data.description,
      date: post.data.date.toISOString(),
      tags: post.data.tags,
      url: `/blog/${post.id}/`,
    })),
    ...notes.map((note) => ({
      type: 'note' as const,
      title: note.data.title,
      description: note.data.description,
      date: note.data.date.toISOString(),
      tags: note.data.tags,
      aliases: note.data.aliases,
      url: `/notes/${note.id}/`,
    })),
    ...projects.map((project) => ({
      type: 'project' as const,
      title: project.data.title,
      description: project.data.description,
      date: project.data.date.toISOString(),
      tags: project.data.tags,
      url: `/projects/${project.id}/`,
    })),
    // Newest first; collection order isn't stable across Astro versions.
    // ISO date strings sort correctly as plain strings.
  ].sort((a, b) => b.date.localeCompare(a.date));

  return new Response(JSON.stringify(entries), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
