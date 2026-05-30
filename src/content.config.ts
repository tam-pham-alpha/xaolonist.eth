import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({
    pattern: '**/[^_]*.md',
    base: './src/content/blog',
    generateId: ({ entry }) => {
      // entry is like "recap-2025/index.md" or "recap-2025/index.en.md"
      // Use the full path without extension to avoid duplicates
      return entry.replace(/\.md$/, '');
    },
  }),
  schema: ({ image }) =>
    z.object({
      slug: z.string(),
      title: z.string(),
      summary: z.string(),
      author: z.string().default('Tam Pham'),
      cowriter: z.string().optional(),
      category: z.enum(['blog', 'anh4gs']),
      status: z.enum(['published', 'draft']).default('published'),
      date: z.string(),
      cover: image(),
      lang: z.enum(['vn', 'en']).default('vn'),
    }),
});

export const collections = { blog };
