import { Injectable } from '@nestjs/common';
import { RATE_LIMIT_PER_HOUR } from './types';

const WINDOW_MS = 60 * 60 * 1000;

/**
 * In-memory sliding-window rate limiter keyed by client IP.
 * Single-process brain on one NUC → no shared store needed.
 */
@Injectable()
export class RateLimitService {
  private readonly hits = new Map<string, number[]>();

  /** Returns true if this request is allowed (and records it). */
  consume(ip: string): boolean {
    const now = Date.now();
    const windowStart = now - WINDOW_MS;
    const recent = (this.hits.get(ip) || []).filter((t) => t > windowStart);
    if (recent.length >= RATE_LIMIT_PER_HOUR) {
      this.hits.set(ip, recent);
      return false;
    }
    recent.push(now);
    this.hits.set(ip, recent);

    // Opportunistic cleanup so the map doesn't grow unbounded
    if (this.hits.size > 5000) {
      for (const [key, times] of this.hits) {
        if (times.every((t) => t <= windowStart)) this.hits.delete(key);
      }
    }
    return true;
  }
}
