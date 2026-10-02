import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { isTag, sortTags } from './lib/tags';
import { isTopic } from './lib/topics';

const tagSlug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Tags must be lowercase URL-safe slugs (e.g. "my-tag")')
  .refine(isTag, { error: (issue) => `Unknown tag "${issue.input}": add it to src/lib/tags.ts` });

// Sorted by display name so tags appear alphabetically everywhere
const tags = z.array(tagSlug).default([]).transform(sortTags);

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    tags,
    draft: z.boolean().default(false),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    // The heading the note is grouped under on the Notes page
    topic: z.string().refine(isTopic, { error: (issue) => `Unknown topic "${issue.input}": add it to src/lib/topics.ts` }),
    // Other terms readers might search for; each one is also a glossary entry
    aliases: z.array(z.string()).default([]),
    tags,
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
    appStore: z.url().optional(),
    playStore: z.url().optional(),
    tags,
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, notes, projects };
