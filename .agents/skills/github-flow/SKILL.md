---
name: github-flow
description: >-
  Handles all Git and GitHub operations for xaolonist.eth. Use when the user
  asks to commit, push, create a branch, open a PR, deploy, or do any
  version-control or release task on this project.
---

# GitHub Flow for xaolonist.eth

This project uses a **trunk-based / GitHub Flow** strategy. The `main` branch is always production — Cloudflare Pages auto-deploys on every push to `main`.

---

## Branch Conventions

| Type | Pattern | Example |
|---|---|---|
| New post (dvvv / blog) | `post/<slug>` | `post/thoi-gian-2` |
| Feature / UI change | `feat/<description>` | `feat/dark-nav-gradient` |
| Bug fix | `fix/<description>` | `fix/missing-cover-fallback` |
| Docs / config | `docs/<description>` | `docs/update-agents-md` |
| Chore / dependency | `chore/<description>` | `chore/upgrade-astro-5-8` |

> **Quick content changes** (single post, no code changes) may be committed directly to `main` without a branch.

---

## Commit Message Format

Follow **Conventional Commits**:

```
<type>(<scope>): <short summary>
```

**Types**: `feat`, `fix`, `docs`, `chore`, `style`, `refactor`, `perf`, `content`

**Scope** (optional but helpful): slug name, component name, or file area

### Examples

```bash
# New post
git commit -m "content(thoi-gian-2): add new dvvv post on solitude"

# UI tweak
git commit -m "feat(navbar): add active link indicator"

# Bug fix
git commit -m "fix(cover): handle missing cover image gracefully"

# Dependency / config
git commit -m "chore: upgrade astro to 5.8.0"

# Docs only
git commit -m "docs: add github-flow skill to .agents/skills"
```

---

## Standard Workflow

### 1. Direct push to `main` (simple content or docs changes)

```bash
git add <files>
git commit -m "<type>(<scope>): <summary>"
git push origin main
```

### 2. Branch → PR → Merge (code changes, new features, multi-file refactors)

```bash
# Create branch
git checkout -b feat/my-feature

# Work, then stage and commit
git add <files>
git commit -m "feat(scope): description"

# Push branch
git push -u origin feat/my-feature

# Open PR via GitHub CLI (optional)
gh pr create --title "feat: my feature" --body "Description of changes" --base main

# After review/approval, merge (squash preferred for features)
gh pr merge --squash
```

---

## Deployment

- **Auto-deploy**: Every push to `main` triggers a Cloudflare Pages build automatically — no manual step needed
- **Manual deploy** (force-build without a code change):
  ```bash
  yarn deploy   # astro build && wrangler deploy
  ```
- **Check build status**: Visit the Cloudflare Pages dashboard or run:
  ```bash
  wrangler pages deployment list
  ```

---

## What NOT to do

- ❌ Do NOT push broken builds to `main` — run `yarn build` locally first if you changed any Astro/config files
- ❌ Do NOT commit `dist/`, `.astro/`, or `node_modules/` — all are in `.gitignore`
- ❌ Do NOT run `yarn clean` before every build — incremental builds are fast (~7s)
- ❌ Do NOT force-push to `main` (`git push --force`) without explicit user confirmation

---

## Useful Git Commands

```bash
git status                        # Check working tree
git log --oneline -10             # Last 10 commits
git diff --staged                 # Review staged changes before commit
git stash                         # Stash uncommitted work temporarily
git stash pop                     # Restore stashed work
gh pr list                        # List open PRs
gh pr view --web                  # Open current PR in browser
```
