// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// URL structure preserved 1:1 with the WordPress site (trailing-slash directories)
// so every backlink and indexed URL keeps working — no SEO equity lost.
export default defineConfig({
  site: 'https://www.ayurvedicwellnesscentre.com.au',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [sitemap()],
});
