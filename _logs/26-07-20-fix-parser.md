# FIX Parser — client tool

> **Status: BUILT 26-07-20 — chờ QA + deploy.** Third tool; `runtime: 'client'`. References [`00-00-00-tools-platform-architecture.md`](./00-00-00-tools-platform-architecture.md). UX inspired by classic FIX log viewers (timeline + tag detail).

## Tier

| Field | Value |
|-------|--------|
| `runtime` | **`client`** |
| `category` | `finance` |
| `slug` | `fix-parser` |
| `status` | `live` |
| `featured` | `true` |

## MVP

1. Paste / load / drop FIX logs (SOH `\x01` or `|` delimited)
2. Process → timeline (Time, Sender, Message, ClOrdID, Side)
3. Click row → detail Tag / Name / Value
4. Sample data, Clear, search filter
5. VN + EN pages

## Files

- `src/lib/tools.ts` — registry
- `src/lib/fix-tags.ts` — common tag names
- `src/components/tools/FixParser.astro` — island
- `src/pages/tools/fix-parser.astro` + `en/`
