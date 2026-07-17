/**
 * Cloudflare Worker for anh4gs.xyz.
 *
 * Static assets (the Astro build in dist/) are served by the assets binding.
 * `/api/*` is handled here — currently one route, `/api/aethery-chat`, which
 * proxies to the aethery brain on the NUC through a Cloudflare Tunnel and
 * streams the SSE response back to the browser.
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

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/')) {
      if (url.pathname === '/api/aethery-chat' && request.method === 'POST') {
        return handleChat(request, env);
      }
      return new Response(JSON.stringify({ error: 'not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
