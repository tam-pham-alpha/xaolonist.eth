# CLAUDE.md — Agent Instructions for xaolonist.eth

This is an Astro 5 blog that sources content from local Markdown files. It is deployed to Cloudflare Pages via `git push`.

## Tech Stack

- **Framework**: Astro 5 (SSG)
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/vite`)
- **Package Manager**: Yarn 4 (Berry) with `nodeLinker: node-modules`
- **Deployment**: Cloudflare Pages (auto-deploys on push to `main`)

## Key Commands

```bash
yarn dev          # Start local dev server at http://localhost:4321
yarn build        # Production build → ./dist
yarn clean        # Wipe dist and .astro
yarn typecheck    # TypeScript + Astro check
yarn deploy       # Build + deploy to Cloudflare via Wrangler
```

## Adding a New Blog Post

### Writing Style & Voice

All new posts must adopt the third-person narrator using "hắn" and "@aethery", omit em-dashes (use commas or colons instead), and avoid ending lines/bullet points with a period. However, we maintain a clear stylistic split based on category:
- **bnvc posts (category: "blog")**: Focus on software engineering, tech stack, and logic. They should NOT use mystical, Zen-heavy, or overly philosophical words. Use clear, simple, and scientific language.
- **dvvv posts (category: "anh4gs")**: Focus on life reflections, memories, and thoughts. They can adopt the mystical, Zen-philosophical style modeled after the book "Đạo Trading" (using words like "Thị", "tánh biết", "như thị", etc.).

Before writing or generating new articles, review and follow the instructions in [styleguide.md](file:///Users/phamtam/projects/xaolonist.eth/content/styleguide/styleguide.md). Additionally, any posts written/co-written by the LLM must set `cowriter: "@aethery"` in the frontmatter, and append the signature `*❤️ cowriter aethery*` on a new line at the very end of the markdown body.

### 1. Create the post directory

```
src/content/blog/<slug>/
├── index.md       # Post content with YAML frontmatter
├── cover.jpg      # Cover image (jpg, jpeg, or png)
└── images/        # (Optional) Inline images
    └── ...
```

### 2. Frontmatter format

Every `index.md` **must** start with this YAML block:

```yaml
---
slug: "my-post-slug"
title: "My Post Title"
summary: "A brief summary of the post."
author: "Tam Pham"
cowriter: "@aethery"      # (Optional) "@aethery" if co-written by LLM
category: "blog"          # "blog" → homepage, "anh4gs" → /dvvv/ page
status: "published"       # "published" or "draft"
date: "2026-05-30"        # YYYY-MM-DD
cover: "./cover.jpg"      # Relative path to cover image
lang: "vn"                # "vn" or "en"
---
```

### 3. Image references

- **Cover**: Place in the post folder, reference as `./cover.jpg` (or `.png`) in frontmatter. Astro optimizes this automatically via the `image()` schema
- **Inline**: Place in `images/` subfolder, reference as `![alt](./images/name.jpg)` in markdown body. Astro optimizes these at build time

### Cover Image Style Guide

If the user has attached/provided an image in their request, use that image directly as the cover (`cover.jpg` or `cover.png`) and do NOT generate a new one.

- **Style**: Simple, realistic, photographic feel — avoid overly digital or AI-looking renders. Prefer a 1950s cinematic film still aesthetic (vintage film grain, desaturated/faded color palettes, classic analog camera feel).
- **Themes to draw from**: Tarot cards, Harry Potter, Game of Thrones — mystical, earthy, cinematic
- **Tone**: Warm, moody, atmospheric, low-saturation (fewer/muted colors) — think candlelight, parchment, nature, medieval aesthetics
- **Avoid**: Vibrant/neon colors, futuristic/sci-fi looks, cluttered compositions, text overlays
- **Format**: Save as `cover.jpg` or `cover.png` in the post directory

### 4. Category routing

| `category` value | Page | Title |
|---|---|---|
| `"blog"` | `/` (index.astro) | "ban ngày viết code" |
| `"anh4gs"` | `/dvvv/` (dvvv.astro) | "đêm về viết văn" |

## Project Structure

```
src/content/blog/       # All blog posts (markdown + images)
src/content.config.ts   # Content collection schema definition
src/pages/index.astro   # Homepage — lists category="blog" posts
src/pages/dvvv.astro    # Writing page — lists category="anh4gs" posts
src/pages/aethery.astro # Aethery profile page
src/pages/blog/[slug].astro  # Individual post template (VN)
src/pages/en/           # English versions of all pages
src/layouts/Layout.astro # Main layout with SEO meta tags
src/components/         # Reusable components (Card, NavBar, Footer, etc.)
src/css/global.css      # Global styles with Tailwind v4 @theme config
src/plugins/            # Custom remark plugins
astro.config.mjs        # Astro configuration
public/                 # Static assets (images, CNAME, robots.txt)
```

## Content Collection Schema

Frontmatter fields are validated via Zod in `src/content.config.ts`:

```typescript
z.object({
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  author: z.string().default('Tam Pham'),
  cowriter: z.string().optional(),
  category: z.enum(['blog', 'anh4gs']),
  status: z.enum(['published', 'draft']).default('published'),
  date: z.string(),
  cover: image(),      // Astro image optimization
  lang: z.enum(['vn', 'en']).default('vn'),
})
```

## Important Notes

- **Do NOT use `env-cmd`** — no `.env` file is needed; all content is local
- **Do NOT run `yarn clean` before every build** — incremental builds are fast (~7s)
- **Cover image quality** is set to `80` in the image service config
- **Tailwind v4**: Config is in CSS (`@theme` block in `global.css`), NOT in `tailwind.config.js`
- **Build output** goes to `dist/` (not `public/`)
- **Static assets** go in `public/` (served as-is, not processed)
- **Missing image handling**: A custom remark plugin (`remark-strip-missing-images.mjs`) gracefully removes broken image references from legacy Notion-migrated posts
