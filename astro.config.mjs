import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { remarkStripMissingImages } from './src/plugins/remark-strip-missing-images.mjs';

export default defineConfig({
  site: 'https://anh4gs.xyz',
  output: 'static',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        quality: 80,
      },
    },
  },
  markdown: {
    remarkPlugins: [remarkStripMissingImages],
  },
});
