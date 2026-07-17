/**
 * Types and tunables for the aethery chat brain.
 *
 * Modeled on djao-trading/agent-bot's discord-ai executor, adapted for
 * anonymous public web traffic: read-only tools, tighter limits.
 */

export interface ChatRequestBody {
  /** Server-issued chat id (uuid). Omit to start a new conversation. */
  chatId?: string;
  /** The visitor's message for this turn. */
  message: string;
}

/** SSE events streamed back to the browser (one JSON object per `data:` line). */
export type ChatEvent =
  | { type: 'delta'; text: string }
  | { type: 'done'; chatId: string; durationMs: number }
  | { type: 'error'; code: ChatErrorCode; message: string };

export type ChatErrorCode =
  | 'busy'
  | 'rate_limited'
  | 'bad_request'
  | 'unauthorized'
  | 'timeout'
  | 'claude_error';

/** Max parallel claude processes — each one is heavy on the NUC. */
export const MAX_CONCURRENT_TURNS = Number(process.env.BRAIN_MAX_CONCURRENT || 2);

/** Per-turn wall clock limit. Claude reading a few posts fits well under this. */
export const TURN_TIMEOUT_MS = Number(process.env.BRAIN_TURN_TIMEOUT_MS || 150_000);

/** Idle conversations are forgotten after this (claude session files remain on disk). */
export const SESSION_IDLE_TIMEOUT_MS = 30 * 60 * 1000;

/** Sliding-window rate limit per client IP. */
export const RATE_LIMIT_PER_HOUR = Number(process.env.BRAIN_RATE_LIMIT_PER_HOUR || 20);

/** Visitor message length cap. */
export const MAX_MESSAGE_CHARS = 2000;

/** Cap on claude's agentic loop per turn (reads + final answer). */
export const MAX_TURNS_PER_MESSAGE = 8;
