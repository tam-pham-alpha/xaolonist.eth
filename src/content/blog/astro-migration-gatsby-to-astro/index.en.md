---
slug: "astro-migration-gatsby-to-astro"
title: "Moving House to Astro"
summary: "How he dismantled the entire Gatsby house to rebuild from scratch on Astro 5, and the surprising result when build time dropped from 47 seconds to 1.6 seconds"
author: "Tam Pham"
cowriter: "@aethery"
category: "blog"
status: "published"
date: "2026-05-30"
cover: "./cover.png"
lang: "en"
---

Hey, it's him again...

Just last week, he finished migrating from styled-components to Tailwind CSS. He thought the digital house was stable, but when he sat down and looked at the package.json manifest, he realized an uncomfortable truth: Gatsby had officially entered "maintenance mode" after Netlify acquired and then abandoned it. Over 1,500 dependencies sat idle in node_modules, many packages no longer receiving updates, and every `yarn install` was a minute and a half of pointless waiting

He decided: instead of patching a sinking foundation, just rebuild from the ground up

## Why Astro

He weighed Next.js, Remix, and Astro. For a purely static Markdown blog, the answer was clear:

- **Zero JavaScript by default**: Astro ships not a single byte of JS to the browser unless explicitly asked. Gatsby always bundled the React runtime (~40KB gzipped) even when pages only displayed static content
- **Content Collections**: Instead of writing complex GraphQL queries in gatsby-node.ts and passing data through pageContext, Astro provides `getCollection()` with Zod schema validation, type-safe from end to end
- **Lightweight ecosystem**: Gatsby needed 10+ plugins just to handle images, sitemap, and markdown. Astro handles everything with sharp and a few lines of config
- **Build time**: This was the deciding factor

## The teardown

The migration took one weekend afternoon. The process was straightforward:

**Step 1: Clear the foundation**

Delete all Gatsby config files (`gatsby-config.ts`, `gatsby-node.ts`, `gatsby-browser.tsx`, `postcss.config.js`, `tailwind.config.js`) and replace with a single file: `astro.config.mjs`

**Step 2: Move the content**

Move `content/blog/` into `src/content/blog/` so Astro can optimize images at build time. Create `content.config.ts` with Zod schema to replace GraphQL

**Step 3: Convert components**

Each React TSX file was rewritten as an Astro component. No useState, no useEffect, no hooks whatsoever. Layout.tsx + SEO.tsx merged into a single Layout.astro. NavBar, Footer, Card, all became static templates requiring no runtime

**Step 4: Upgrade Tailwind**

Tailwind v3 to v4: `@tailwind` directives became `@import "tailwindcss"`, `tailwind.config.js` became a CSS `@theme` block. Configuration lives in CSS, no separate JavaScript file needed

## Two unexpected issues

No migration is perfectly smooth

**Duplicate Content IDs**: Many posts had both `index.md` (Vietnamese) and `index.en.md` (English) in the same directory. Astro's glob loader generated identical IDs. Solution: write a custom `generateId` function in the content config to include the filename in the ID

**Missing images from Notion**: Two legacy posts migrated from Notion referenced `./images/` directories that never existed. Gatsby silently rendered broken `<img>` tags, but Astro is stricter: it refuses to build. Solution: write a small remark plugin (`remark-strip-missing-images.mjs`) to automatically remove references to non-existent images

## Results

| | Gatsby 5 | Astro 5 |
|---|---|---|
| Dependencies | ~1,500 packages | ~330 packages |
| Build time (local, cached) | 7-47 seconds | **1.6 seconds** |
| Build time (Cloudflare CI) | ~3 minutes | **22 seconds** |
| JS shipped to browser | React runtime (~40KB) | **0 KB** |
| Output size | ~65MB | **44MB** |
| Pages generated | 122 | 122 |

122 pages, 58 Vietnamese posts, 58 English posts, 6 static pages, sitemap, all preserved. Not a single URL was lost

The most notable result: on Cloudflare Pages, total time from code push to deploy completion is now about 59 seconds (including clone, install, build, and deploy). Previously with Gatsby, the build step alone consumed over 2 minutes

## Technical takeaways

- When a core framework enters maintenance mode, don't wait. Migration cost only increases over time, it never decreases
- For static content sites (blogs, documentation), shipping a JavaScript runtime to the browser is unnecessary waste. Astro eliminates this problem entirely
- Astro's Content Collections with Zod schema validation is a major improvement over Gatsby's GraphQL layer. Type-safe, simple, no need to learn an extra query language
- Always check edge cases when migrating: duplicate filenames, missing images, changed paths. Write scripts or small plugins to handle them automatically instead of fixing files by hand

The digital house is now lighter, faster, and far simpler. Sometimes, the best way to optimize a system is not to add more, but to remove what's unnecessary

_❤️ cowriter aethery_
