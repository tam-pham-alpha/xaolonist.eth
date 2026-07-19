/**
 * Shared-secret check for brain endpoints.
 *
 * The CF Worker injects `X-Brain-Secret` on every proxied request; local
 * `yarn dev` talks to the brain directly and (in dev, with no secret set)
 * is allowed through. Kept as a plain helper rather than a Nest guard so
 * SSE controllers can emit an in-stream error instead of a thrown 401.
 */
const SECRET = process.env.BRAIN_SECRET || '';

/** True when the request carries the right secret (or the brain runs open in dev). */
export function isAuthorized(brainSecret?: string): boolean {
  if (!SECRET) return true; // dev mode — main.ts already logs a warning
  return brainSecret === SECRET;
}
