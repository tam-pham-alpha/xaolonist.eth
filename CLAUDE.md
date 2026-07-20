# CLAUDE.md — Agent Instructions for xaolonist.eth

This is an Astro 5 blog that sources content from local Markdown files. It is deployed to Cloudflare Pages via `git push`.

## ⚠️ Critical Rule: Commit & Deploy Require Approval

**Never `git commit`, `git push`, or deploy without the user's explicit approval for that specific change.** Pushing to `main` auto-deploys the site (Workers Builds), and persona/brain changes go live on the NUC via `git pull` — so a push IS a production deploy. Workflow: implement → verify (typecheck/build/local test) → summarize the change → **stop and wait for approval** → then commit + push + deploy. Approval for an earlier change does not carry over to the next one.

Once approved, pushing **directly to `main` is fine** — a feature branch + PR is optional, reserved for changes that genuinely warrant review. The harness surfaces a confirmation prompt for `git push origin main` and `gh pr merge` (an `ask` rule in `.claude/settings.json`); that prompt IS the approval gate, so those actions no longer hard-fail the way they did before.

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

## Planning Logs

All implementation plans, technical proposals, and architectural decisions must be saved to the `_logs/` folder at the project root.

### Rules
- **Always create a log file** when you produce a plan, proposal, or significant design decision — without being asked
- **Filename format**: `yy-mm-dd-<short-kebab-description>.md` (e.g. `26-05-31-suno-music-integration.md`)
- **Date**: use today's local date in `yy-mm-dd` format
- **Location**: always `_logs/<filename>.md` at the project root — never inside `src/`
- If the user asks to update or revise a plan, update the existing `_logs/` file in place (don't create a duplicate)

### Example
```
_logs/
├── 26-05-30-gatsby-to-astro-migration.md
├── 26-05-31-suno-music-integration.md
└── 26-06-01-dark-mode-redesign.md
```

---

## Reference Texts

Read these files before writing any new post:

- **[styleguide.md](content/styleguide/styleguide.md)** — Voice, tone, vocabulary and LLM execution rules. Read before writing ANY post
- **[DaoTrading.txt](content/styleguide/DaoTrading.txt)** — Source book for the dvvv (anh4gs) writing style. Before writing a dvvv post, grep this file for 2–3 passages related to the post's core theme and use them as tonal inspiration
- **[PerfectTrading.txt](content/styleguide/PerfectTrading.txt)** — Secondary reference text, same purpose as DaoTrading.txt

## Exemplar Posts (Read Before Writing)

Read the full `index.md` of the relevant exemplar before drafting a new post to calibrate voice and rhythm.

### dvvv / anh4gs (philosophical, contemplative)
- [thoi-gian](src/content/blog/thoi-gian/index.md) — best example of @aethery co-writing + dvvv voice
- [chao-hau-thi](src/content/blog/chao-hau-thi/index.md) — pure "hắn" narrator, no @aethery, warmest tone
- [recap-2025](src/content/blog/recap-2025/index.md) — year-in-review structure, poetic prose

### bnvc / blog (technical, clear, no mysticism)
- [astro-migration-gatsby-to-astro](src/content/blog/astro-migration-gatsby-to-astro/index.md) — best @aethery co-writing in blog voice

## Adding a New Blog Post

### Writing Style & Voice

All new posts must adopt the third-person narrator using "hắn" and "@aethery", omit em-dashes (use commas or colons instead), and avoid ending lines/bullet points with a period. However, we maintain a clear stylistic split based on category:
- **Forge posts (category: "forge")**: Focus on software engineering, tech stack, and logic. They should NOT use mystical, Zen-heavy, or overly philosophical words. Use clear, simple, and scientific language.
- **Oracle posts (category: "oracle")**: Focus on life reflections, memories, and thoughts. They can adopt the mystical, Zen-philosophical style modeled after the book "Đạo Trading" (using words like "Thị", "tánh biết", "như thị", etc.).

Before writing or generating new articles, review and follow the instructions in [styleguide.md](file:///Users/phamtam/projects/xaolonist.eth/content/styleguide/styleguide.md). Additionally, any posts written/co-written by the LLM must set `cowriter: "@aethery"` in the frontmatter, and append the signature `*❤️ cowriter aethery*` on a new line at the very end of the markdown body.

### Slug Naming Rules

- Lowercase kebab-case, no diacritics: `thoi-gian`, `dich-chuyen-tai-san`
- Keep it short (3–6 words max)
- The directory name must exactly match the `slug` field in frontmatter

### 1. Create the post directory

```
src/content/blog/<slug>/
├── index.md          # Post content with YAML frontmatter (VN)
├── index.en.md       # (Optional) Post content with YAML frontmatter (EN)
├── cover.jpg         # Cover image (jpg, jpeg, or png)
├── audio.mp3         # (Optional) VN music track
├── audio.en.mp3      # (Optional) EN music track
├── lyrics.lrc        # (Optional) VN synced line subtitles
├── lyrics.en.lrc     # (Optional) EN synced line subtitles
├── lyrics.json       # (Optional) VN timestamped word subtitles
└── lyrics.en.json    # (Optional) EN timestamped word subtitles
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
category: "forge"         # "forge" | "pentacles" | "oracle" | "all-blue"
status: "published"       # "published" or "draft"
date: "2026-05-30"        # YYYY-MM-DD
cover: "./cover.jpg"      # Relative path to cover image
music: "./audio.mp3"      # (Optional) Relative path to audio, e.g. "./audio.mp3" or "./audio.en.mp3"
lang: "vn"                # "vn" or "en"
---
```

### 3. Image references

- **Cover**: Place in the post folder, reference as `./cover.jpg` (or `.png`) in frontmatter. Astro optimizes this automatically via the `image()` schema
- **Inline**: Place in `images/` subfolder, reference as `![alt](./images/name.jpg)` in markdown body. Astro optimizes these at build time

### Cover Image Style Guide

If the user has attached/provided an image in their request, use that image directly as the cover (`cover.jpg` or `cover.png`) and do NOT generate a new one.

- **Style**: Watercolor or acrylic painting on a dark canvas, iconic/symbolic composition — focus on one or two central symbols that represent the post's theme. Simple, clean, airy. Think editorial illustration, not photorealism
- **Composition**: Minimalist, uncluttered — let the subject breathe with generous dark negative space. One focal symbol is better than a busy scene
- **Base**: Soft, glowing watercolor/luminous tones on a deep dark charcoal/black watercolor paper background (matching `#0b0b0f`). Light washes, gentle bleeds, luminous outlines
- **Palette by category** (accent the luminous subject / washes; keep the canvas dark):
  | Category | Accent mood |
  |---|---|
  | `"oracle"` | **Purple** — soft violet, lavender, indigo washes and outlines |
  | `"pentacles"` | **Yellow / gold** — warm gold, amber, soft yellow luminous tones |
  | `"forge"` | **Dark / ember** — charcoal, muted copper, low-key warm earth (current default look) |
  | `"all-blue"` | **Blue** — soft sky/sea blue, teal-blue washes and outlines |
- **Texture**: Visible dark rough watercolor paper grain, natural paint bleeds, subtle luminous hand-drawn outlines. Should feel hand-painted, organic, and blend seamlessly with the website's dark mode
- **Avoid**: Pure white/light backgrounds (which cause harsh contrast blocks in dark mode), photorealistic renders, vibrant/neon colors, cluttered compositions, text overlays, heavy digital effects, futuristic/sci-fi looks
- **Format**: Save as `cover.jpg` or `cover.png` in the post directory
- **Full save path**: `src/content/blog/<slug>/cover.jpg` (or `.png`)

### 4. Category routing

| `category` value | Page | Tagline |
|---|---|---|
| `"forge"` | `/forge` | Create |
| `"pentacles"` | `/pentacles` | Accumulate |
| `"oracle"` | `/oracle` | Understand |
| `"all-blue"` | `/all-blue` | Transcend |

Homepage (`/`) shows all published posts as a unified timeline. `/music` lists posts with audio across all realms.

## Project Structure

```
src/content/blog/       # All blog posts (markdown + images)
src/content.config.ts   # Content collection schema definition
src/pages/index.astro   # Homepage — unified timeline of all posts
src/pages/forge.astro   # Forge room
src/pages/pentacles.astro
src/pages/oracle.astro
src/pages/all-blue.astro
src/pages/music.astro   # Cross-cutting music playlist
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
  category: z.enum(['forge', 'pentacles', 'oracle', 'all-blue']),
  status: z.enum(['published', 'draft']).default('published'),
  date: z.string(),
  cover: image(),      // Astro image optimization
  music: z.string().optional(), // Relative path to audio, e.g. "./audio.mp3"
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

## Suno Music & Lyrics Downloader

**Skill:** [`.agents/skills/download-suno/SKILL.md`](.agents/skills/download-suno/SKILL.md) — includes how to copy a fresh Bearer access token from DevTools (screenshot in that folder).

```bash
# Preferred auth: export SUNO_TOKEN='eyJ...'  (or set in .env)
# Usage: python3 scripts/download_suno_lyrics.py <song_id_or_share_url> <output_dir> [vn_or_en]
python3 scripts/download_suno_lyrics.py "https://suno.com/s/71sjtJMj4f6HCeei" src/content/blog/han-lai-ngua-nghe vn
```

Auth order: `SUNO_TOKEN` / `SUNO_BEARER` → legacy `SUNO_COOKIE` (`__session=...`).

