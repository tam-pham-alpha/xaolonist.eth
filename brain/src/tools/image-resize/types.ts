/**
 * Contract + tunables for the batch image-resize tool.
 *
 * The browser sends a multipart form: N image files plus an `options` field
 * carrying a JSON-encoded {@link ResizeOptions}. The brain resizes each file
 * with ImageMagick and streams back a single zip.
 */

/** How the target size is interpreted. Aspect ratio is always preserved. */
export type ResizeMode =
  | 'percent' // scale by `percent` (e.g. 50 → half)
  | 'width' // fix width to `width`px, height auto
  | 'height' // fix height to `height`px, width auto
  | 'fit'; // fit inside `width`×`height` box

/** Output container. `keep` re-encodes to each file's original format. */
export type OutputFormat = 'keep' | 'jpeg' | 'png' | 'webp';

export interface ResizeOptions {
  mode: ResizeMode;
  /** 1–1000, used by mode `percent`. */
  percent?: number;
  /** target px, used by modes `width` | `fit`. */
  width?: number;
  /** target px, used by modes `height` | `fit`. */
  height?: number;
  format: OutputFormat;
  /** 1–100, applies to jpeg/webp. */
  quality?: number;
  /** When true, images smaller than the target are left unchanged (no upscaling). */
  noUpscale?: boolean;
}

// ── Limits (mirrored on the CF Worker for early rejection) ──────────────────

export const MAX_FILES = Number(process.env.TOOL_IMG_MAX_FILES || 30);
/** Per-file byte cap. */
export const MAX_FILE_BYTES = Number(process.env.TOOL_IMG_MAX_FILE_BYTES || 15 * 1024 * 1024);
/** Total request byte cap (also enforced at the edge via Content-Length). */
export const MAX_TOTAL_BYTES = Number(process.env.TOOL_IMG_MAX_TOTAL_BYTES || 25 * 1024 * 1024);
/** Largest allowed target dimension in px. */
export const MAX_DIMENSION = 10_000;
/** Per-file ImageMagick wall-clock limit. */
export const PER_FILE_TIMEOUT_MS = Number(process.env.TOOL_IMG_TIMEOUT_MS || 30_000);
/** Sliding-window request budget per client IP. */
export const RATE_LIMIT_PER_HOUR = Number(process.env.TOOL_IMG_RATE_LIMIT_PER_HOUR || 30);

/** Accepted input MIME types. */
export const ACCEPTED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/tiff',
  'image/bmp',
  'image/avif',
  'image/heic',
  'image/heif',
]);

export const FORMAT_EXT: Record<Exclude<OutputFormat, 'keep'>, string> = {
  jpeg: 'jpg',
  png: 'png',
  webp: 'webp',
};

export interface ResizeItemResult {
  name: string;
  ok: boolean;
  error?: string;
}
