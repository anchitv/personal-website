import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const tagSlug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Tags must be lowercase URL-safe slugs (e.g. "my-tag")');

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    tags: z.array(tagSlug).default([]),
    draft: z.boolean().default(false),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    tags: z.array(tagSlug).default([]),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    status: z.enum(['active', 'archived', 'idea']),
    url: z.url().optional(),
    repo: z.url().optional(),
    tags: z.array(tagSlug).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, notes, projects };
