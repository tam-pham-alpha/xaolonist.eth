# Tools Platform — Architecture North-Star

> **Status: LIVE in production 26-07-19.** First tool (batch image-resizer) shipped via PR #4 — frontend+worker auto-deployed by Cloudflare Workers Builds on merge to `main`, brain deployed on the NUC with a portable ImageMagick AppImage. Verified end-to-end on `https://anh4gs.xyz/api/tools/image-resize`. This is the **evergreen direction doc** (`00-00-00` = not a dated log) for turning anh4gs.xyz into a host for many small utility tools. New tool plans should reference this and respect the tier boundaries below.
>
> Code landed: `brain/src/common/`, `brain/src/tools/image-resize/`, `worker/index.ts` (`/api/tools/:id`), `src/lib/tools.ts`, `src/pages/tools/`, `src/components/tools/ImageResizer.astro`.

## Goal

One site, many tiny tools — each solving a small daily annoyance fast, no login, no friction. Some are viral/free (QR, palette), some are the moat (image/PDF, AI wrappers, dev-infra tools that lean on the author's trading/low-latency background). The architecture must make **adding a tool cheap** while keeping heavy/native work isolated on the NUC.

## Core principle — 3-tier runtime model

The one decision that keeps dozens of tools from turning into chaos: **every tool declares where it runs** (`runtime` field in `src/lib/tools.ts`). That field alone decides the wiring.

| Tier | Runs on | Good for | Cost / limits |
|------|---------|----------|---------------|
| **`client`** | Browser (JS/WASM) | data never leaves the machine; infinite CDN scale | free, but no native binaries / big compute |
| **`edge`** | Cloudflare Worker | light network + logic, LLM API proxy | ~10ms CPU, no filesystem, no binaries |
| **`nuc`** | NestJS brain on the NUC | native binaries, filesystem, CLI, `claude` CLI | full power, single node → needs abuse gates |

### Roadmap mapped to tiers

- **`client`** — QR, Color Picker, Palette, Lorem, Markdown cleaner, Reading-time, JSON diff, Regex tester, Cron builder, SQL formatter, JWT debugger, Env comparer, Token calc, Timezone planner, SIP/FIRE/DCA/Currency/Portfolio calculators, Bill splitter, all checklists/trackers (localStorage), small Image compressor
- **`edge`** — Currency (live rates), Webhook replay, API history (+KV), SEO checker, thin LLM wrappers (call Anthropic API from the Worker)
- **`nuc`** — 🎯 **Batch Image Resizer**, PDF Merge/Compress, Background Remover, SVG Optimizer, and the "paste X → improve" family (Slack improver, PR explainer, meeting→action items, TL;DR, ATS score, flashcards…), plus the signature set: Architecture / Sequence / DAG visualizers, Market-Data Debugger

Strategy: ship `client` tools first for reach (zero cost, viral), invest `nuc` for the hard-to-copy moat.

## Architecture

```mermaid
flowchart LR
    subgraph Browser["🌐 Browser — anh4gs.xyz/tools/*"]
        REG["tool registry<br/>src/lib/tools.ts"]
        CT["client tools<br/>(JS / WASM)"]
        NT["nuc/edge tool UI<br/>(island: upload, options)"]
    end

    subgraph CF["☁️ Cloudflare Worker"]
        A["static assets (dist/)"]
        R["/api/tools/:id<br/>allow-list · size cap · inject secret"]
        ET["edge tools<br/>(future)"]
    end

    subgraph NUC["🏠 NUC — brain (NestJS, pm2)"]
        T["cloudflared tunnel<br/>brain.anh4gs.xyz"]
        COM["common/<br/>auth · rate-limit · workspace(temp+cleanup)"]
        IR["tools/image-resize<br/>→ spawn ImageMagick → zip"]
        CH["chat/ (aethery, unchanged)"]
    end

    CT -.-> A
    NT -- "multipart POST" --> R
    R -- "X-Brain-Secret, X-Client-IP" --> T
    T --> COM
    COM --> IR
    COM --> CH
    IR -- "application/zip" --> R --> NT
```

Key properties:

- **Same edge pattern as aethery chat** — the Worker is the gate (secret injection, IP forwarding, oversize rejection); the brain does the heavy work. Tools reuse the tunnel + secret that already exist.
- **Brain is now modular** — `common/` holds shared plumbing; each tool is a self-contained folder. Chat became "just another consumer" of `common/` without being touched.
- **Stateless per request** — a tool request creates a temp workspace, processes, streams the result, and cleans up in `finally`. No job store needed for fast tools (async job model is reserved for future heavy tools like video/bg-remove).

## Repo structure

```text
src/
  lib/tools.ts                      # registry: Tool[] { slug, runtime, category, status, cover, ... }
  pages/tools/
    index.astro                     # gallery — renders from registry; Layout cover = TOOLS_INDEX_COVER
    image-resizer.astro             # one page per tool (must set Layout cover)
  components/tools/
    ImageResizer.astro              # interactive island (dropzone, options, download zip)

public/images/tools/
  index.jpg                         # /tools gallery OG
  <slug>.jpg                        # per-tool OG (required for every live tool)

worker/index.ts                     # TOOL_ROUTES allow-list → proxy /api/tools/:id → brain

brain/src/
  common/
    brain-auth.ts                   # X-Brain-Secret check (shared)
    rate-limit.service.ts           # generic keyed sliding-window limiter
    workspace.service.ts            # per-job temp dir (in/ out/) + best-effort cleanup
  tools/
    tools.module.ts
    image-resize/
      types.ts                      # ResizeOptions + limits (mirrored on the Worker)
      image-resize.service.ts       # validate + spawn ImageMagick + geometry
      image-resize.controller.ts    # multipart in → zip out (+ X-Tool-Result summary)
  chat/                             # aethery — unchanged
```

## Adding a new tool

1. **Add a registry entry** in `src/lib/tools.ts` (`slug`, `runtime`, `category`, `status`, **`cover`**). The gallery picks it up automatically.
2. **Add an OG cover** at `public/images/tools/<slug>.jpg` (~1200×630, dark site aesthetic). Every live tool page **must** pass `cover={absoluteCover(tool.cover)}` to `Layout` (VN + EN). Gallery uses `TOOLS_INDEX_COVER` → `/images/tools/index.jpg`.
3. **Add the page** `src/pages/tools/<slug>.astro` (+ EN twin + an island component if interactive).
4. If `runtime: 'nuc'`:
   - add a controller/service under `brain/src/tools/<slug>/`, register in `tools.module.ts`;
   - allow-list the route in `worker/index.ts` `TOOL_ROUTES` (with its own `maxBytes`).
   - reuse `WorkspaceService` + `RateLimitService` from `common/`.
5. If `runtime: 'edge'`: handle it inside the Worker (no brain hop).
6. If `runtime: 'client'`: everything lives in the page/island — no backend.

## First vertical slice — batch image-resizer (`runtime: nuc`)

```mermaid
sequenceDiagram
    participant U as Visitor
    participant UI as ImageResizer island
    participant W as CF Worker
    participant B as Brain (NUC)
    participant IM as ImageMagick

    U->>UI: drop N images, pick options
    Note over UI: client pre-check — ≤30 files, ≤15MB/file, ≤25MB total, image/* only
    UI->>W: POST /api/tools/image-resize (multipart: files[] + options JSON)
    W->>W: reject if Content-Length > 25MB
    W->>B: forward + X-Brain-Secret, X-Client-IP
    B->>B: secret → rate limit (30/h/IP) → validate options
    B->>B: WorkspaceService.create() → write files to in/
    loop each file (sequential — NUC shared with trading stack)
        B->>IM: magick <in> -auto-orient -strip -resize <geom> [-quality q] <out>
        IM-->>B: resized file in out/
    end
    B->>B: archiver zip out/ → stream
    B-->>W: application/zip + X-Tool-Result (per-file ok/fail)
    W-->>UI: (pipe through)
    UI->>U: download resized-images.zip + "xong N ảnh ✓"
    Note over B: finally → WorkspaceService.cleanup() (always)
```

**Options:** mode `percent | width | height | fit`, format `keep | jpeg | png | webp`, quality (jpeg/webp), `noUpscale` (default on, appends `>` to geometry). JPEG target flattens alpha onto white.

**Abuse gates:** Turnstile-free for now; protected by edge size cap + per-IP rate limit + per-file ImageMagick resource limits (`-limit memory/map/disk/time`) against decompression bombs. Filenames sanitized; spawn uses an args array (no shell) → no injection.

**Verified locally (26-07-19)** against real ImageMagick 7.1.2:

- percent 50%: 400×300→200×150, 640×480→320×240; zip names correct
- fit 300×300 + →JPG: 640×480→300×225, alpha flattened
- width 800 + noUpscale on 400px image: stays 400×300
- error paths: percent 0 → 400, `.txt` → 400 "No supported image files", missing binary → clean 500 (no crash)
- workspace cleanup leaves no temp dirs

Brain typecheck + astro check/build + worker typecheck all pass.

## Cross-cutting concerns

- **Auth** — shared `X-Brain-Secret` injected by the Worker (dev bypasses when no secret set). Same model as chat.
- **Rate limit** — generic keyed limiter in `common/`; each tool namespaces its bucket (`"<tool>:<ip>"`) with its own hourly budget. Chat keeps its own copy (untouched).
- **Size caps** — declared once per tool: at the edge (`TOOL_ROUTES[id].maxBytes`, hard-enforced pre-brain) and in the brain (`MAX_FILE_BYTES`, `MAX_FILES`). Client mirrors them for instant UX feedback.
- **Cleanup** — every `nuc` tool wraps work in `try/finally` around `WorkspaceService.cleanup()`.
- **Monetization hook (future)** — the registry + per-IP metering already give the seams to gate free vs. paid later; not built yet.

## Deploy

Reuses the aethery pipeline (see `brain/README.md`), no new secrets:

- **Brain (NUC)** — `cd ~/prod/xaolonist.eth && git pull && yarn install && yarn workspace @xaolonist/brain build && pm2 restart aethery-brain`. **Plus one-time: ImageMagick.** The `djao` user has **no passwordless sudo**, so `apt-get` is not an option — instead a portable static AppImage is used (runs directly, no FUSE): `curl -fL https://github.com/ImageMagick/ImageMagick/releases/download/<ver>/ImageMagick-<ver>-gcc-x86_64.AppImage -o ~/.local/opt/im/magick && chmod +x ~/.local/opt/im/magick`, then `MAGICK_BIN=/home/djao/.local/opt/im/magick` in `brain/.env` (the service reads `MAGICK_BIN`, else falls back to `magick`→`convert` on PATH).
- **Worker + site** — `yarn deploy` (repo root) = `astro build && wrangler deploy`. Publishes `/tools/*` pages + `/api/tools/*` route.
- Order: brain first, then worker/site.

## Trade-offs accepted

- **Single node** — all `nuc` tools share one NUC (also running the trading stack + aethery). Sequential processing + rate limits + resource caps keep it polite. Scale-out is a later problem.
- **No async jobs yet** — fast tools answer in one request→response. Heavy tools (video, bg-remove) will need a job + progress-SSE abstraction; `common/` is where that lands.
- **Availability** — `nuc`/`edge` tools are down when the NUC/tunnel is down; `client` tools keep working (served from the edge). Discoverability: a `/tools` link should be added to the nav (Forge realm is the natural home) — not done yet.

## Open decisions / next

- [ ] Add `/tools` to `NavBar` (or surface under Forge)
- [x] EN mirrors for tool pages — `/en/tools`, `/en/tools/image-resizer` (component is bilingual via a `lang` prop; done 26-07-19)
- [ ] Turnstile on `nuc` tools if abuse shows up
- [ ] Job/progress abstraction before the first long-running tool
- [x] Second tool to validate the "add a tool" flow — **Timezone Planner** (`runtime: client`, `life`, featured) shipped 26-07-19; proves the client-only path (browser `Intl`/IANA TZDB, no worker/brain hop). See `_logs/26-07-19-timezone-planner.md`.
- [x] Third tool — **FIX Parser** (`runtime: client`, `finance`, featured) built 26-07-20; paste/drop FIX logs → timeline + tag detail, all in-browser. See `_logs/26-07-20-fix-parser.md`.
