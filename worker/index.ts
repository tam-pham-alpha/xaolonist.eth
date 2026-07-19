/**
 * Cloudflare Worker for anh4gs.xyz.
 *
 * Static assets (the Astro build in dist/) are served by the assets binding.
 * `/api/*` is handled here and proxied to the brain on the NUC through a
 * Cloudflare Tunnel:
 *   - `/api/aethery-chat`      → SSE chat (claude CLI)
 *   - `/api/tools/<tool-id>`   → utility tools (multipart in, binary/zip out)
 * The Worker is the edge gate: it injects the shared secret, forwards the
 * caller IP, and rejects oversized tool uploads before they reach the NUC.
 */

interface Env {
  ASSETS: Fetcher;
  /** Tunnel hostname of the brain, e.g. https://brain.anh4gs.xyz (var). */
  BRAIN_URL?: string;
  /** Shared secret the brain requires (wrangler secret put BRAIN_SECRET). */
  BRAIN_SECRET?: string;
  /** Turnstile secret key — when set, first messages must carry a token. */
  TURNSTILE_SECRET?: string;
}

/** Tools whose requests the Worker will forward to `<BRAIN_URL>/tools/<id>`. */
const TOOL_ROUTES: Record<string, { maxBytes: number }> = {
  'image-resize': { maxBytes: 25 * 1024 * 1024 },
};

interface ChatBody {
  chatId?: string;
  message?: string;
  turnstileToken?: string;
}

/** Errors are emitted in the same SSE shape the brain uses, so the chat UI has one parser. */
function sseError(code: string, message: string, status = 200): Response {
  const payload = `data: ${JSON.stringify({ type: 'error', code, message })}\n\n`;
  return new Response(payload, {
    status,
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
  });
}

async function verifyTurnstile(secret: string, token: string, ip: string | null): Promise<boolean> {
  const form = new FormData();
  form.append('secret', secret);
  form.append('response', token);
  if (ip) form.append('remoteip', ip);
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: form,
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

async function handleChat(request: Request, env: Env): Promise<Response> {
  if (!env.BRAIN_URL) {
    return sseError('offline', 'Brain is not configured');
  }

  let body: ChatBody;
  try {
    body = (await request.json()) as ChatBody;
  } catch {
    return sseError('bad_request', 'Invalid JSON body');
  }

  const clientIp = request.headers.get('CF-Connecting-IP');

  // Human check on the first message of a conversation only
  if (env.TURNSTILE_SECRET && !body.chatId) {
    const ok =
      typeof body.turnstileToken === 'string' &&
      (await verifyTurnstile(env.TURNSTILE_SECRET, body.turnstileToken, clientIp));
    if (!ok) {
      return sseError('turnstile', 'Human verification failed');
    }
  }

  try {
    const upstream = await fetch(`${env.BRAIN_URL.replace(/\/$/, '')}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Brain-Secret': env.BRAIN_SECRET || '',
        'X-Client-IP': clientIp || '',
      },
      body: JSON.stringify({ chatId: body.chatId, message: body.message }),
    });

    if (!upstream.ok || !upstream.body) {
      return sseError('offline', `Brain unreachable (${upstream.status})`);
    }

    return new Response(upstream.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
      },
    });
  } catch {
    return sseError('offline', 'Brain unreachable');
  }
}

function toolError(status: number, code: string, message: string): Response {
  return new Response(JSON.stringify({ error: code, message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Forward a tool request (multipart form) to `<BRAIN_URL>/tools/<id>` and
 * stream the brain's response (typically a zip) straight back. Enforces the
 * per-tool upload cap at the edge so oversized bodies never reach the NUC.
 */
async function handleTool(request: Request, env: Env, toolId: string): Promise<Response> {
  const route = TOOL_ROUTES[toolId];
  if (!route) return toolError(404, 'not_found', 'Unknown tool');
  if (!env.BRAIN_URL) return toolError(503, 'offline', 'Brain is not configured');

  const declared = Number(request.headers.get('Content-Length') || '0');
  if (declared > route.maxBytes) {
    return toolError(413, 'too_large', `Upload exceeds ${Math.round(route.maxBytes / 1024 / 1024)}MB`);
  }

  // Buffer the (capped) body so we can hard-enforce the size limit even when
  // Content-Length is absent/lying, and avoid streaming-body edge cases.
  const body = await request.arrayBuffer();
  if (body.byteLength > route.maxBytes) {
    return toolError(413, 'too_large', `Upload exceeds ${Math.round(route.maxBytes / 1024 / 1024)}MB`);
  }

  const clientIp = request.headers.get('CF-Connecting-IP');
  try {
    const upstream = await fetch(`${env.BRAIN_URL.replace(/\/$/, '')}/tools/${toolId}`, {
      method: 'POST',
      headers: {
        'Content-Type': request.headers.get('Content-Type') || 'application/octet-stream',
        'X-Brain-Secret': env.BRAIN_SECRET || '',
        'X-Client-IP': clientIp || '',
      },
      body,
    });

    // Pass through status + the headers the tool UI needs (zip + result summary)
    const headers = new Headers();
    for (const h of ['Content-Type', 'Content-Disposition', 'X-Tool-Result']) {
      const v = upstream.headers.get(h);
      if (v) headers.set(h, v);
    }
    headers.set('Access-Control-Expose-Headers', 'X-Tool-Result');
    headers.set('Cache-Control', 'no-store');
    return new Response(upstream.body, { status: upstream.status, headers });
  } catch {
    return toolError(502, 'offline', 'Brain unreachable');
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/')) {
      if (url.pathname === '/api/aethery-chat' && request.method === 'POST') {
        return handleChat(request, env);
      }
      const toolMatch = url.pathname.match(/^\/api\/tools\/([a-z0-9-]+)$/);
      if (toolMatch && request.method === 'POST') {
        return handleTool(request, env, toolMatch[1]);
      }
      return new Response(JSON.stringify({ error: 'not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
