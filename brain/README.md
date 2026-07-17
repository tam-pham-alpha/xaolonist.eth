# Aethery Brain

Backend for the chat box on [/aethery](https://anh4gs.xyz/aethery). Runs on the NUC, spawns the locally installed `claude` CLI per chat turn (agent-bot pattern: no long-lived process, continuity via `claude --resume`), and streams SSE back through a Cloudflare Tunnel.

```text
Browser → /api/aethery-chat (CF Worker) → Cloudflare Tunnel → brain (:3123) → claude CLI
```

## Safety model

- claude runs with **read-only tools only** (`--allowedTools Read,Grep,Glob`), cwd = repo root, `--max-turns 8` — it can read oracle posts and grep `DaoTrading.txt`, nothing else. No `--dangerously-skip-permissions`
- Shared secret between Worker and brain (`BRAIN_SECRET`) — the tunnel hostname alone is not enough to reach claude
- Per-IP rate limit (default 20 msgs/hour) + concurrency cap (default 2 parallel claude processes) in the brain; optional Turnstile on the first message, verified in the Worker

## Local dev

```bash
yarn install                       # repo root — installs the brain workspace too
yarn workspace @xaolonist/brain build
node brain/dist/main.js            # listens on 127.0.0.1:3123, no secret in dev
yarn dev                           # astro dev on :4321 — the chat island calls localhost:3123 directly
```

Smoke test without the UI:

```bash
curl -N -X POST localhost:3123/chat \
  -H 'Content-Type: application/json' \
  -d '{"message":"hắn thường viết về điều gì?"}'
```

## NUC setup (one-time)

```bash
# 0. Login: `yarn login:nuc` (checkout lives at ~/prod/xaolonist.eth).
#    Non-interactive shells need: export PATH=$HOME/.nvm/versions/node/v24.14.1/bin:$PATH

# 1. In the existing checkout
cd ~/prod/xaolonist.eth
git pull
yarn install
yarn workspace @xaolonist/brain build
cp brain/.env.example brain/.env    # fill in BRAIN_SECRET (openssl rand -hex 32)

# 2. Start under pm2
pm2 start pm2/ecosystem.brain.config.js
pm2 save

# 3. Cloudflare Tunnel — DONE 26-07-17 (documented for reference)
# Installed WITHOUT sudo: binary at ~/.local/bin/cloudflared, runs under
# user-level pm2 (app "aethery-tunnel", persisted via pm2 save), not systemd.
#   cloudflared tunnel login                                  # browser auth
#   cloudflared tunnel create aethery-brain                   # id 8731e5e1-96d1-47f7-9f63-01fc467789c6
#   cloudflared tunnel route dns aethery-brain brain.anh4gs.xyz
#   ~/.cloudflared/config.yml → ingress brain.anh4gs.xyz → http://127.0.0.1:3123
#   pm2 start ~/.local/bin/cloudflared --name aethery-tunnel -- tunnel run aethery-brain
#   pm2 save

# 4. Worker secrets (from the dev machine, repo root)
wrangler secret put BRAIN_SECRET       # same value as brain/.env
wrangler secret put TURNSTILE_SECRET   # optional — enables human check
# Turnstile also needs PUBLIC_TURNSTILE_SITE_KEY at astro build time
```

`BRAIN_URL` (the tunnel hostname) is a plain var in `wrangler.jsonc`.

## Deploy updates

- **Site + Worker**: `yarn deploy` (repo root) — builds Astro and deploys Worker + assets
- **Brain**: on the NUC — `git pull && yarn install && yarn workspace @xaolonist/brain build && pm2 restart aethery-brain`

## Ops

```bash
pm2 logs aethery-brain
curl localhost:3123/health          # {"ok":true,"activeTurns":0}
```

Failure mode when the NUC or tunnel is down: the Worker answers with an SSE error event and the UI shows "nàng đang thiền, lát nữa quay lại nhé".
