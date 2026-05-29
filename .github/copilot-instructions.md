# Copilot Instructions for xaolonist.eth

You are working on a Gatsby-based blog where posts are sourced from local Markdown files.

## 📝 Directory Structure

All posts must be placed in a separate subdirectory under `content/blog/` using this format:
```
content/blog/<slug>/
├── index.md           # Post content and metadata
├── cover.jpg          # (or .jpeg / .png) The cover image
└── images/            # (Optional) Subfolder for inline markdown images
    ├── image-1.png
    └── ...
```

## 🏷️ YAML Frontmatter Format

Every `index.md` file MUST have a valid YAML frontmatter block containing:

```yaml
---
slug: "my-new-post-slug"
title: "My New Post Title"
summary: "A brief one-sentence or two-sentence summary of the post."
author: "Tam Pham"              # Default/primary author
category: "blog"                # "blog" targets the home page (index.tsx / "ban ngày viết code")
                                # "anh4gs" targets the writing page (dvvv.tsx / "đêm về viết văn")
status: "published"             # "published" to show on the site, or "draft" to hide it
date: "May 29, 2026"            # Format: Month DD, YYYY or YYYY-MM-DD
cover: "./cover.jpg"            # Relative path to the cover image in the same directory
lang: "vn"                      # "vn" or "en"
---
```

## 🖼️ Handling Images

1. **Cover Image**:
   - Place the cover image file directly in the post's slug folder.
   - The `cover` field in frontmatter MUST be a relative path: `cover: "./cover.jpg"`.
2. **Inline Images**:
   - Place inline images in a subdirectory named `images/` inside the slug folder.
   - Reference inline images in the Markdown body using relative paths:
     `![Image Description](./images/image-name.jpg)`

## 🚀 Adding a New Post Workflow

1. Create a directory `content/blog/<your-slug>/`.
2. Place a cover image `cover.jpg` inside it.
3. Create `index.md` and define the YAML frontmatter.
4. If you have inline images, create `content/blog/<your-slug>/images/` and reference them relatively.
5. Verify:
   - Run typecheck: `yarn run typecheck`
   - Run Gatsby build: `yarn run build`
