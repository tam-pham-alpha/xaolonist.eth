---
slug: "notion-to-markdown-cloudflare-pages"
title: "Migrating from Notion API to Markdown & Cloudflare Pages"
summary: "Hey, it's him again, and recently he decided to make a major migration for his blog: moving from Notion API to local Markdown files and deploying to Cloudflare Pages"
author: "Tam Pham"
cowriter: "@aethery"
category: "forge"
status: "published"
date: "2026-05-30"
cover: "./cover.png"
lang: "en"
---

Hey, it's him again, and recently he decided to make a major migration for his blog: moving from Notion API to local Markdown files and deploying to Cloudflare Pages.

Previously, he loved using Notion as a CMS because it was convenient, visual, and had a smooth drag-and-drop interface. However, over time, the Notion API began to show frustrating limitations: slow query speeds, occasional rate limits, and having to wait to fetch data over the network every time the blog rebuilt, which took a lot of time.

Therefore, he decided to switch to a traditional, pure SSG (Static Site Generation) solution: writing Markdown and storing it in the GitHub repository [tam-pham-alpha/xaolonist.eth](https://github.com/tam-pham-alpha/xaolonist.eth). Partly to save on Notion's monthly subscription fee, but the bigger reason was the flexibility and the ability to leverage AI's power to publish new posts, which is much more convenient and flexible than the traditional Notion workflow. Here is a summary of the steps he took to complete this migration.

### Step 1: Export data from Notion
First, he exported the entire post database from Notion as Markdown & CSV. Notion compresses all posts into a `.zip` file containing `.md` files along with the accompanying images folder.

### Step 2: Write a conversion script and standardize the structure
The Markdown exported from Notion had rather messy frontmatter that wasn't immediately compatible with Gatsby. He wrote a short Node.js script to:
1. Read all exported `.md` files.
2. Re-parse the metadata (slug, title, date, category, status...) and overwrite it into standard blog frontmatter.
3. Move attached images to the correct `content/blog/<slug>/images/` folder or save as `cover.jpg` in the post directory.
4. Change image paths in the markdown body to matching relative paths.

### Step 3: Configure the Gatsby build
Once all posts were organized locally under the structure:
```
content/blog/<slug>/
├── index.md
└── cover.jpg
```
He used `gatsby-source-filesystem` along with `gatsby-transformer-remark` to let Gatsby automatically scan and create nodes for these Markdown files. Querying via GraphQL now happens entirely locally, reducing build time from nearly 1 minute to less than 7 seconds.

### Step 4: Deploy to Cloudflare Pages & Workers Static Assets
Finally, he switched completely to Cloudflare Workers Static Assets combined with Wrangler for the fastest deployment:
1. Configure `wrangler.jsonc` to point the static assets directory directly to the compiled `public` folder
2. Update the deploy script in `package.json` to utilize `wrangler deploy`
3. Execute the build and deploy processes directly from local or via GitHub Actions CI/CD pipeline

Now, building the application takes a mere 20 seconds, and deploying it to Cloudflare's global edge network takes only 16 seconds. The entire workflow is fast, lightweight, and fully automated

This migration helped him realize that sometimes the complexity of cloud APIs or databases doesn't offer as much value as the simplicity and reliability of static files (plain text). Having complete ownership of his content as physical files on his personal computer brings true peace of mind.

*❤️ cowriter aethery*
