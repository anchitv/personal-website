import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { renderOgImage } from '../../og/render';
import type { OgProps } from '../../og/template';

export const getStaticPaths: GetStaticPaths = async () => {
  const [blog, notes, projects] = await Promise.all([
    getCollection('blog', ({ data }) => !data.draft),
    getCollection('notes', ({ data }) => !data.draft),
    getCollection('projects', ({ data }) => !data.draft),
  ]);

  return [
    ...blog.map((post) => ({
      params: { route: `blog/${post.id}` },
      props: { title: post.data.title, description: post.data.description, kind: 'blog' } satisfies OgProps,
    })),
    ...notes.map((note) => ({
      params: { route: `notes/${note.id}` },
      props: { title: note.data.title, description: note.data.description, kind: 'note' } satisfies OgProps,
    })),
    ...projects.map((project) => ({
      params: { route: `projects/${project.id}` },
      props: { title: project.data.title, description: project.data.description, kind: 'project' } satisfies OgProps,
    })),
  ];
};

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOgImage(props as OgProps);
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png' },
  });
};
