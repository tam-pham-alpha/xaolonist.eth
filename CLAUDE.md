# CLAUDE.md — Agent Instructions for xaolonist.eth

This is a Gatsby 5 blog that sources content from local Markdown files. It is deployed to Cloudflare Pages via `git push`.

## Tech Stack

- **Framework**: Gatsby 5 (SSG)
- **Styling**: styled-components
- **Package Manager**: Yarn 4 (Berry) with `nodeLinker: node-modules`
- **Deployment**: Cloudflare Pages (auto-deploys on push to `main`)
- **Fallback deploy**: `surge ./public https://anh4gs.xyz`

## Key Commands

```bash
yarn dev          # Start local dev server at http://localhost:8000
yarn build        # Production build → ./public
yarn clean        # Wipe .cache and public (only if needed)
yarn typecheck    # TypeScript check
yarn deploy       # Manual deploy to Surge (fallback)
yarn release      # Build + deploy to Surge
```

## Adding a New Blog Post

### Writing Style & Voice

All new posts must adopt the unique writing style modeled after the book **"Đạo Trading"** (Zen, self-reflective, third-person narrator using "hắn" and "Thị"). Before writing or generating new articles, review and follow the instructions in [styleguide.md](file:///Users/phamtam/projects/xaolonist.eth/content/styleguide/styleguide.md).

### 1. Create the post directory

```
content/blog/<slug>/
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
category: "blog"          # "blog" → homepage, "anh4gs" → /dvvv/ page
status: "published"       # "published" or "draft"
date: "2026-05-30"        # YYYY-MM-DD
cover: "./cover.jpg"      # Relative path to cover image
lang: "vn"                # "vn" or "en"
---
```

### 3. Image references

- **Cover**: Place in the post folder, reference as `./cover.jpg` (or `.png`) in frontmatter
- **Inline**: Place in `images/` subfolder, reference as `![alt](./images/name.jpg)` in markdown body

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
| `"blog"` | `/` (index.tsx) | "ban ngày viết code" |
| `"anh4gs"` | `/dvvv/` (dvvv.tsx) | "đêm về viết văn" |

## Project Structure

```
content/blog/           # All blog posts (markdown + images)
src/pages/index.tsx     # Homepage — lists category="blog" posts
src/pages/dvvv.tsx      # Writing page — lists category="anh4gs" posts
src/templates/post.tsx  # Individual post template
src/components/         # Reusable components (Card, Layout, SEO, etc.)
gatsby-config.ts        # Gatsby plugins config
gatsby-node.ts          # Schema customization + page creation
```

## GraphQL Schema

Frontmatter fields are **flat strings** (not nested objects):

```graphql
frontmatter {
  slug        # String
  title       # String
  status      # String
  author      # String
  category    # String
  date        # String
  summary     # String
  lang        # String
  cover {     # File (resolved via @fileByRelativePath)
    childImageSharp { fluid { ... } }
  }
}
```

## Important Notes

- **Do NOT use `env-cmd`** — no `.env` file is needed; all content is local
- **Do NOT run `yarn clean` before every build** — Gatsby's incremental cache makes subsequent builds ~7s vs ~47s
- **Cover image quality** is set to `80` in GraphQL queries (not 100) to keep build output small (~65MB)
- The `gatsby-plugin-sharp` defaults use `formats: ["auto"]` and `breakpoints: [400, 800, 1200]`
