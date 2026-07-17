import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { spawn } from 'child_process';
import { randomUUID } from 'crypto';
import * as path from 'path';
import { AETHERY_SYSTEM_PROMPT } from './aethery-prompt';
import {
  MAX_CONCURRENT_TURNS,
  MAX_TURNS_PER_MESSAGE,
  SESSION_IDLE_TIMEOUT_MS,
  TURN_TIMEOUT_MS,
} from './types';

interface ChatSession {
  /** Session id from claude CLI — used with `--resume` on follow-up turns. */
  claudeSessionId: string | null;
  /** A turn is currently running for this chat — reject concurrent sends. */
  busy: boolean;
  idleTimer: ReturnType<typeof setTimeout> | null;
}

export interface TurnResult {
  chatId: string;
  exitCode: number;
  isError: boolean;
  durationMs: number;
  /** Final text from claude's `result` event (also streamed as deltas). */
  finalText: string;
}

export class TurnRejectedError extends Error {
  constructor(
    public readonly code: 'busy' | 'claude_error',
    message: string,
  ) {
    super(message);
  }
}

/**
 * Spawns the local `claude` CLI per chat turn, agent-bot style:
 * no long-lived process, conversation continuity via `claude --resume`.
 *
 * Differences from agent-bot's AiExecutorService (public-traffic hardening):
 * - NO `--dangerously-skip-permissions`; instead an explicit read-only
 *   allowlist (`Read,Grep,Glob`) — unlisted tools are auto-denied in -p mode
 * - `--output-format stream-json --include-partial-messages` so text deltas
 *   stream to the browser instead of arriving as one block
 * - `--max-turns` caps the agentic loop per message
 */
@Injectable()
export class ClaudeExecutorService implements OnModuleDestroy {
  private readonly logger = new Logger(ClaudeExecutorService.name);
  /** Repo root — claude runs here so CLAUDE.md + styleguide load naturally. */
  private readonly repoDir =
    process.env.BRAIN_REPO_DIR || path.resolve(__dirname, '..', '..', '..');
  private readonly claudeBin = process.env.CLAUDE_BIN || 'claude';
  /**
   * Default to standard-context sonnet: the CLI's default alias can resolve
   * to a 1M-context model that requires usage credits (API 429 without them).
   */
  private readonly model = process.env.BRAIN_CLAUDE_MODEL || 'sonnet';

  private readonly sessions = new Map<string, ChatSession>();
  private activeTurns = 0;

  onModuleDestroy() {
    for (const session of this.sessions.values()) {
      if (session.idleTimer) clearTimeout(session.idleTimer);
    }
    this.sessions.clear();
  }

  get activeCount(): number {
    return this.activeTurns;
  }

  /**
   * Run one chat turn, invoking `onDelta` for each streamed text fragment.
   * Resolves when claude's `result` event arrives or the process exits.
   */
  async streamTurn(
    chatId: string | undefined,
    message: string,
    onDelta: (text: string) => void,
  ): Promise<TurnResult> {
    if (this.activeTurns >= MAX_CONCURRENT_TURNS) {
      throw new TurnRejectedError('busy', 'All seats at the fire are taken');
    }

    let id = chatId && this.sessions.has(chatId) ? chatId : randomUUID();
    let session = this.sessions.get(id);
    if (!session) {
      session = { claudeSessionId: null, busy: false, idleTimer: null };
      this.sessions.set(id, session);
    }
    if (session.busy) {
      throw new TurnRejectedError('busy', 'Previous message is still being answered');
    }

    session.busy = true;
    this.activeTurns++;
    const startTime = Date.now();
    this.logger.log(
      `[chat:${id.slice(0, 8)}] turn start (resume=${session.claudeSessionId ? 'yes' : 'no'}): "${message.slice(0, 60)}"`,
    );

    try {
      const result = await this.runClaudeStream(
        message,
        session.claudeSessionId,
        onDelta,
      );
      if (result.claudeSessionId) session.claudeSessionId = result.claudeSessionId;

      const durationMs = Date.now() - startTime;
      this.logger.log(
        `[chat:${id.slice(0, 8)}] turn done: exit=${result.exitCode} error=${result.isError} ${durationMs}ms`,
      );
      return {
        chatId: id,
        exitCode: result.exitCode,
        isError: result.isError,
        durationMs,
        finalText: result.finalText,
      };
    } finally {
      session.busy = false;
      this.activeTurns--;
      this.resetIdleTimer(id);
    }
  }

  // ── claude CLI invocation ─────────────────────────────────────────────

  private runClaudeStream(
    prompt: string,
    claudeSessionId: string | null,
    onDelta: (text: string) => void,
  ): Promise<{
    claudeSessionId: string | null;
    exitCode: number;
    isError: boolean;
    finalText: string;
  }> {
    const args: string[] = [];
    if (claudeSessionId) args.push('--resume', claudeSessionId);
    args.push(
      '--print',
      '--verbose',
      '--output-format', 'stream-json',
      '--include-partial-messages',
      '--allowedTools', 'Read,Grep,Glob',
      '--max-turns', String(MAX_TURNS_PER_MESSAGE),
      '--append-system-prompt', AETHERY_SYSTEM_PROMPT,
    );
    if (this.model) args.push('--model', this.model);
    args.push(prompt);

    return new Promise((resolve, reject) => {
      let settled = false;
      let lineBuffer = '';
      let foundSessionId: string | null = claudeSessionId;
      let finalText = '';
      let isError = false;
      const stderrChunks: Buffer[] = [];

      const child = spawn(this.claudeBin, args, {
        cwd: this.repoDir,
        stdio: ['ignore', 'pipe', 'pipe'],
        env: { ...process.env, PATH: this.buildPath(), CI: 'true' },
      });

      const timer = setTimeout(() => {
        if (settled) return;
        settled = true;
        try {
          child.kill('SIGTERM');
          setTimeout(() => {
            try { child.kill('SIGKILL'); } catch { /* already dead */ }
          }, 2000);
        } catch { /* already dead */ }
        reject(new TurnRejectedError('claude_error', `Turn timed out after ${TURN_TIMEOUT_MS}ms`));
      }, TURN_TIMEOUT_MS);

      const handleEvent = (obj: any) => {
        if (typeof obj.session_id === 'string') foundSessionId = obj.session_id;

        // Partial text as claude writes (--include-partial-messages)
        if (obj.type === 'stream_event') {
          const ev = obj.event;
          if (
            ev?.type === 'content_block_delta' &&
            ev.delta?.type === 'text_delta' &&
            typeof ev.delta.text === 'string'
          ) {
            onDelta(ev.delta.text);
          }
          return;
        }

        if (obj.type === 'result') {
          if (typeof obj.result === 'string') finalText = obj.result;
          if (obj.is_error === true || obj.subtype !== 'success') isError = true;
        }
      };

      child.stdout.on('data', (chunk: Buffer) => {
        lineBuffer += chunk.toString('utf8');
        let idx: number;
        while ((idx = lineBuffer.indexOf('\n')) >= 0) {
          const line = lineBuffer.slice(0, idx).trim();
          lineBuffer = lineBuffer.slice(idx + 1);
          if (!line) continue;
          try {
            handleEvent(JSON.parse(line));
          } catch { /* skip non-JSON lines */ }
        }
      });

      child.stderr.on('data', (chunk: Buffer) => stderrChunks.push(chunk));

      child.on('close', (code) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        const stderr = Buffer.concat(stderrChunks).toString('utf8');
        if (code !== 0 && !finalText) {
          this.logger.error(`claude exited ${code}: ${stderr.slice(0, 500)}`);
        }
        resolve({
          claudeSessionId: foundSessionId,
          exitCode: code ?? 1,
          isError: isError || (code !== 0 && !finalText),
          finalText,
        });
      });

      child.on('error', (err) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        reject(new TurnRejectedError('claude_error', err.message));
      });
    });
  }

  private resetIdleTimer(chatId: string) {
    const session = this.sessions.get(chatId);
    if (!session) return;
    if (session.idleTimer) clearTimeout(session.idleTimer);
    session.idleTimer = setTimeout(() => {
      this.logger.log(`[chat:${chatId.slice(0, 8)}] idle timeout, forgetting session`);
      this.sessions.delete(chatId);
    }, SESSION_IDLE_TIMEOUT_MS);
  }

  private buildPath(): string {
    const nvmBin = process.env.NVM_BIN || '';
    const home = process.env.HOME || '';
    const extraPaths = [
      nvmBin,
      home ? `${home}/.local/bin` : '',
      // NUC: claude/node live in the nvm bin dir (agent-bot does the same)
      '/home/djao/.nvm/versions/node/v24.14.1/bin',
      '/usr/local/bin',
      '/usr/bin',
    ].filter(Boolean);
    return [...extraPaths, process.env.PATH || ''].join(':');
  }
}
