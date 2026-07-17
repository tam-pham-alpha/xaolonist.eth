import { Body, Controller, Get, Headers, Logger, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { ClaudeExecutorService, TurnRejectedError } from './claude-executor.service';
import { RateLimitService } from './rate-limit.service';
import { ChatEvent, ChatRequestBody, MAX_MESSAGE_CHARS } from './types';

@Controller()
export class ChatController {
  private readonly logger = new Logger(ChatController.name);
  private readonly secret = process.env.BRAIN_SECRET || '';

  constructor(
    private readonly executor: ClaudeExecutorService,
    private readonly rateLimit: RateLimitService,
  ) {}

  @Get('health')
  health() {
    return { ok: true, activeTurns: this.executor.activeCount };
  }

  @Post('chat')
  async chat(
    @Body() body: ChatRequestBody,
    @Req() req: Request,
    @Res() res: Response,
    @Headers('x-brain-secret') brainSecret?: string,
    @Headers('x-client-ip') clientIp?: string,
  ) {
    // SSE from the first byte so errors render in the same stream the UI reads
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    const send = (event: ChatEvent) => {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    };
    const end = () => res.end();

    if (this.secret && brainSecret !== this.secret) {
      send({ type: 'error', code: 'unauthorized', message: 'unauthorized' });
      return end();
    }

    const message = typeof body?.message === 'string' ? body.message.trim() : '';
    if (!message || message.length > MAX_MESSAGE_CHARS) {
      send({ type: 'error', code: 'bad_request', message: 'Message empty or too long' });
      return end();
    }

    const ip = clientIp || req.ip || 'unknown';
    if (!this.rateLimit.consume(ip)) {
      send({
        type: 'error',
        code: 'rate_limited',
        message: 'Too many messages this hour. The oracle needs silence between questions',
      });
      return end();
    }

    try {
      let deltasSent = 0;
      const result = await this.executor.streamTurn(body.chatId, message, (text) => {
        deltasSent++;
        send({ type: 'delta', text });
      });
      if (result.isError) {
        // finalText may carry an internal API error — log it, don't show visitors
        this.logger.error(`[chat] claude error result: ${result.finalText.slice(0, 300)}`);
        send({ type: 'error', code: 'claude_error', message: 'The oracle lost the thread' });
      } else {
        // Some paths (no partial-message support, synthetic replies) emit no
        // deltas — deliver the final text in one piece so the UI never blanks
        if (deltasSent === 0 && result.finalText) {
          send({ type: 'delta', text: result.finalText });
        }
        send({ type: 'done', chatId: result.chatId, durationMs: result.durationMs });
      }
    } catch (err) {
      if (err instanceof TurnRejectedError) {
        const code = err.code === 'busy' ? 'busy' : 'claude_error';
        send({ type: 'error', code, message: err.message });
      } else {
        this.logger.error(`chat turn failed: ${err instanceof Error ? err.message : err}`);
        send({ type: 'error', code: 'claude_error', message: 'The oracle lost the thread' });
      }
    }
    end();
  }
}
