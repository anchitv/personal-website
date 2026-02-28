import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

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
      description: post.data.description,
      date: post.data.date.toISOString(),
      tags: post.data.tags,
      url: `/blog/${post.id}/`,
    })),
    ...notes.map((note) => ({
      type: 'note' as const,
      title: note.data.title,
      date: note.data.date.toISOString(),
      tags: note.data.tags,
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
  ];

  return new Response(JSON.stringify(entries), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
