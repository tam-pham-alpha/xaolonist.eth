# Four-Realm Navigation — IA & Migration Plan

**Date:** 2026-07-12  
**Status:** Implemented

## Decision Summary

Replace the binary `blog` / `anh4gs` category split with four symbolic realms. Homepage becomes a unified timeline; each realm is a filterable room.

## Four Realms

| Emoji | Slug | Tagline | Meaning |
|---|---|---|---|
| ⚒️ | `forge` | Create | Tech, software, AI, systems, trading infrastructure — building capability |
| 🪙 | `pentacles` | Accumulate | Money, investing, crypto, economics, cash flow — material value |
| 🔮 | `oracle` | Understand | LLM dialogues, hypotheses, philosophy, strange questions — expanding cognition |
| 🌊 | `all-blue` | Transcend | Fiction, world building, narrative — convergence into a personal universe |

Arc: **Create → Accumulate → Understand → Transcend**

## Migration Mapping

| Old category | New category | Action |
|---|---|---|
| `blog` (bnvc) | `forge` | Bulk migrate all existing posts |
| `anh4gs` (dvvv) | `oracle` | Bulk migrate all existing posts |
| — | `pentacles` | New; assign posts individually over time |
| — | `all-blue` | New; assign posts individually over time |

## Unchanged / Cross-cutting

- **♪ m (music)** — stays as a cross-cutting filter (`data.music` present), not a realm
- **Voice/style rules** — bnvc writing style applies to Forge; dvvv/Oracle style applies to Oracle (styleguide unchanged, keyed by tone not slug)

## URL Structure

```
/                  → unified timeline (all published posts)
/forge             → Forge room
/pentacles         → Pentacles room
/oracle            → Oracle room
/all-blue          → All Blue room
/music             → posts with music (unchanged logic)

/en/...            → English mirrors
```

## Nav

```
⚒️ Forge | 🪙 Pentacles | 🔮 Oracle | 🌊 All Blue | ♪ m
```

Emoji shown in nav (desktop + mobile).

## Room Page Pattern

Each realm page has a header block at the top (like current bnvc/dvvv `h1` + optional description), explaining the realm's meaning before the card grid.

Example headers:
- **Forge** — "Create" + short blurb about building capability
- **Pentacles** — "Accumulate" + short blurb about material value
- **Oracle** — "Understand" + short blurb (replaces "đêm về viết văn" as page title, can keep Vietnamese subtitle)
- **All Blue** — "Transcend" + short blurb about world building

## Schema Change

```typescript
// src/content.config.ts
category: z.enum(['forge', 'pentacles', 'oracle', 'all-blue'])
```

## Implementation Checklist

1. Update `content.config.ts` enum
2. Bulk-rename frontmatter: `blog` → `forge`, `anh4gs` → `oracle` (all `index.md` + `index.en.md`)
3. Create realm pages: `forge.astro`, `pentacles.astro`, `oracle.astro`, `all-blue.astro` (+ EN)
4. Update homepage to show all published posts (no category filter)
5. Update `NavBar.astro` with four realms + music
6. Redirect or remove old routes: `/` was bnvc-only → now timeline; `/dvvv` → `/oracle`
7. Add redirects: `/dvvv` → `/oracle` (301 via `_redirects` or Cloudflare)
8. Update any hardcoded `category === 'blog'` / `'anh4gs'` references (music page, aethery, etc.)
9. Update CLAUDE.md / AGENTS.md category table

## Out of Scope (for now)

- Per-post assignment to `pentacles` / `all-blue` (manual, incremental)
- Realm-specific cover art or theming beyond header text
