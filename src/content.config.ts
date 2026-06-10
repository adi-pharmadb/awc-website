import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// SEO frontmatter — extracted from WordPress/Yoast, preserved verbatim.
const seoSchema = z.object({
  title: z.string(),
  description: z.string().default(''),
  slug: z.string(),
  path: z.string(),
  wpType: z.string(),
  wpId: z.number().optional(),
  pubDate: z.string().optional(),
  updatedDate: z.string().optional(),
  canonical: z.string(),
  robots: z.string().default('index, follow'),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().optional(),
  ogType: z.string().default('article'),
  draft: z.boolean().default(false),
});

const collection = (dir: string) =>
  defineCollection({
    loader: glob({ pattern: '**/*.md', base: `./src/content/${dir}` }),
    schema: seoSchema,
  });

export const collections = {
  blog: collection('blog'),
  pages: collection('pages'),
  services: collection('services'),
  doctors: collection('doctors'),
  products: collection('products'),
  testimonials: collection('testimonials'),
};
