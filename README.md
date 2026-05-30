# xaolonist.eth

A personal blog built with Gatsby 5 and styled-components. Content is authored in local Markdown files and deployed to Cloudflare Pages.

🌐 **[anh4gs.xyz](https://anh4gs.xyz)**

## Quick Start

```bash
yarn install      # Install dependencies (Yarn 4)
yarn dev          # Start dev server → http://localhost:8000
yarn build        # Production build → ./public
yarn typecheck    # TypeScript check
```

## Adding a New Post

Create a directory under `content/blog/<slug>/` with an `index.md` and a `cover.jpg`:

```
content/blog/my-new-post/
├── index.md
├── cover.jpg
└── images/        # (optional) inline images
```

See [CLAUDE.md](./CLAUDE.md) for the full frontmatter schema and conventions.

## Tech Stack

- **Framework**: [Gatsby 5](https://www.gatsbyjs.com/) (SSG)
- **Styling**: [styled-components](https://styled-components.com/)
- **Package Manager**: Yarn 4 (Berry)
- **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com/) (auto-deploys on push to `main`)

## Project Structure

```
content/blog/           # Markdown posts + images
src/pages/index.tsx     # Homepage — category "blog"
src/pages/dvvv.tsx      # Writing page — category "anh4gs"
src/templates/post.tsx  # Individual post template
src/components/         # Reusable components
gatsby-config.ts        # Gatsby plugin config
gatsby-node.ts          # Schema customization + page creation
```

## License

0BSD
