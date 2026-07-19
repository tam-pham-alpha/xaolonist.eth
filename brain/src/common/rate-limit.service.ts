import { Injectable } from '@nestjs/common';

const WINDOW_MS = 60 * 60 * 1000;

/**
 * Generic in-memory sliding-window rate limiter, keyed by an arbitrary string
 * (typically `"<bucket>:<ip>"`). Single-process brain on one NUC → no shared
 * store needed. The chat module keeps its own copy; this one serves tools so
 * each tool can carry its own hourly budget without touching chat limits.
 */
@Injectable()
export class RateLimitService {
  private readonly hits = new Map<string, number[]>();

  /** Returns true if this request is allowed (and records it). */
  consume(key: string, limitPerHour: number): boolean {
    const now = Date.now();
    const windowStart = now - WINDOW_MS;
    const recent = (this.hits.get(key) || []).filter((t) => t > windowStart);
    if (recent.length >= limitPerHour) {
      this.hits.set(key, recent);
      return false;
    }
    recent.push(now);
    this.hits.set(key, recent);

    // Opportunistic cleanup so the map doesn't grow unbounded
    if (this.hits.size > 5000) {
      for (const [k, times] of this.hits) {
        if (times.every((t) => t <= windowStart)) this.hits.delete(k);
      }
    }
    return true;
  }
}
