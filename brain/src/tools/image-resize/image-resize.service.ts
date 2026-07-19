import { Injectable, Logger } from '@nestjs/common';
import { spawn } from 'child_process';
import { writeFile } from 'fs/promises';
import * as path from 'path';
import { WorkspaceService, Workspace } from '../../common/workspace.service';
import {
  FORMAT_EXT,
  MAX_DIMENSION,
  OutputFormat,
  PER_FILE_TIMEOUT_MS,
  ResizeItemResult,
  ResizeMode,
  ResizeOptions,
} from './types';

/** A single uploaded file as delivered by multer's memory storage. */
export interface UploadFile {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export class BadOptionsError extends Error {}

@Injectable()
export class ImageResizeService {
  private readonly logger = new Logger(ImageResizeService.name);
  /** Resolved ImageMagick binary (`magick` for IM7, `convert` for IM6). */
  private binary: string | null = null;

  constructor(private readonly workspace: WorkspaceService) {}

  /**
   * Resize every file into `ws.outDir`, preserving aspect ratio.
   * Returns per-file results; the caller zips `ws.outDir` and streams it.
   * Processes sequentially — the NUC is shared with the trading stack.
   */
  async resizeAll(
    files: UploadFile[],
    options: ResizeOptions,
    ws: Workspace,
  ): Promise<ResizeItemResult[]> {
    const opts = this.validate(options);
    const bin = await this.ensureBinary();
    const usedNames = new Set<string>();
    const results: ResizeItemResult[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const inExt = extFromName(file.originalname) || 'img';
      const inPath = path.join(ws.inDir, `${i}.${inExt}`);
      const outExt = opts.format === 'keep' ? inExt : FORMAT_EXT[opts.format];
      const outName = uniqueName(baseName(file.originalname), outExt, usedNames);
      const outPath = path.join(ws.outDir, outName);

      try {
        await writeFile(inPath, file.buffer);
        await this.runMagick(bin, inPath, outPath, opts);
        results.push({ name: outName, ok: true });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        this.logger.warn(`resize failed for "${file.originalname}": ${message}`);
        results.push({ name: file.originalname, ok: false, error: message });
      }
    }

    return results;
  }

  // ── validation ────────────────────────────────────────────────────────────

  private validate(o: ResizeOptions): ResizeOptions {
    const mode = o.mode;
    const dim = (v: unknown, label: string): number => {
      const n = Math.floor(Number(v));
      if (!Number.isFinite(n) || n < 1 || n > MAX_DIMENSION) {
        throw new BadOptionsError(`${label} must be between 1 and ${MAX_DIMENSION}`);
      }
      return n;
    };

    const out: ResizeOptions = {
      mode,
      format: (['keep', 'jpeg', 'png', 'webp'] as OutputFormat[]).includes(o.format)
        ? o.format
        : 'keep',
      noUpscale: o.noUpscale !== false, // default on
    };

    switch (mode) {
      case 'percent': {
        const p = Math.floor(Number(o.percent));
        if (!Number.isFinite(p) || p < 1 || p > 1000) {
          throw new BadOptionsError('percent must be between 1 and 1000');
        }
        out.percent = p;
        break;
      }
      case 'width':
        out.width = dim(o.width, 'width');
        break;
      case 'height':
        out.height = dim(o.height, 'height');
        break;
      case 'fit':
        out.width = dim(o.width, 'width');
        out.height = dim(o.height, 'height');
        break;
      default:
        throw new BadOptionsError(`unknown mode: ${mode as string}`);
    }

    if (o.quality != null) {
      const q = Math.floor(Number(o.quality));
      if (!Number.isFinite(q) || q < 1 || q > 100) {
        throw new BadOptionsError('quality must be between 1 and 100');
      }
      out.quality = q;
    }
    return out;
  }

  private geometry(o: ResizeOptions): string {
    const cap = o.noUpscale ? '>' : '';
    switch (o.mode) {
      case 'percent':
        return `${o.percent}%`;
      case 'width':
        return `${o.width}x${cap}`;
      case 'height':
        return `x${o.height}${cap}`;
      case 'fit':
        return `${o.width}x${o.height}${cap}`;
    }
  }

  // ── ImageMagick invocation ──────────────────────────────────────────────────

  private runMagick(
    bin: string,
    inPath: string,
    outPath: string,
    opts: ResizeOptions,
  ): Promise<void> {
    const timeoutSec = Math.ceil(PER_FILE_TIMEOUT_MS / 1000);
    const args: string[] = [
      // resource limits — guard against decompression bombs
      '-limit', 'memory', '256MiB',
      '-limit', 'map', '512MiB',
      '-limit', 'disk', '1GiB',
      '-limit', 'time', String(timeoutSec),
      inPath,
      '-auto-orient', // honor EXIF rotation, then drop it
      '-strip', // remove metadata (smaller + privacy)
      '-resize', this.geometry(opts),
    ];
    // Flatten transparency onto white when targeting JPEG (no alpha channel)
    if (opts.format === 'jpeg') args.push('-background', 'white', '-flatten');
    if (opts.quality != null) args.push('-quality', String(opts.quality));
    args.push(outPath);

    return new Promise((resolve, reject) => {
      let settled = false;
      const child = spawn(bin, args, {
        stdio: ['ignore', 'ignore', 'pipe'],
        env: { ...process.env, PATH: buildPath() },
      });
      const stderr: Buffer[] = [];

      const timer = setTimeout(() => {
        if (settled) return;
        settled = true;
        try {
          child.kill('SIGKILL');
        } catch {
          /* already dead */
        }
        reject(new Error(`timed out after ${PER_FILE_TIMEOUT_MS}ms`));
      }, PER_FILE_TIMEOUT_MS + 2000);

      child.stderr.on('data', (c: Buffer) => stderr.push(c));
      child.on('error', (err) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        reject(err);
      });
      child.on('close', (code) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        if (code === 0) return resolve();
        const msg = Buffer.concat(stderr).toString('utf8').trim().slice(0, 200);
        reject(new Error(msg || `imagemagick exited ${code}`));
      });
    });
  }

  /** Resolve and cache the ImageMagick binary, verifying it runs. */
  private async ensureBinary(): Promise<string> {
    if (this.binary) return this.binary;
    const candidates = [process.env.MAGICK_BIN, 'magick', 'convert'].filter(
      (b): b is string => !!b,
    );
    for (const bin of candidates) {
      if (await canRun(bin)) {
        this.binary = bin;
        this.logger.log(`using ImageMagick binary: ${bin}`);
        return bin;
      }
    }
    throw new Error(
      'ImageMagick not found on the brain (install `imagemagick`, or set MAGICK_BIN)',
    );
  }
}

// ── helpers ───────────────────────────────────────────────────────────────

function canRun(bin: string): Promise<boolean> {
  return new Promise((resolve) => {
    const child = spawn(bin, ['-version'], {
      stdio: 'ignore',
      env: { ...process.env, PATH: buildPath() },
    });
    child.on('error', () => resolve(false));
    child.on('close', (code) => resolve(code === 0));
  });
}

/** Sanitized base filename (no extension, no path), safe for disk + zip. */
function baseName(name: string): string {
  const base = name.split(/[\\/]/).pop() || 'image';
  const stem = base.replace(/\.[^.]+$/, '');
  const clean = stem.replace(/[^a-zA-Z0-9._-]+/g, '_').replace(/^[._]+/, '').slice(0, 80);
  return clean || 'image';
}

function extFromName(name: string): string | null {
  const m = /\.([a-zA-Z0-9]+)$/.exec(name);
  return m ? m[1].toLowerCase() : null;
}

function uniqueName(stem: string, ext: string, used: Set<string>): string {
  let candidate = `${stem}.${ext}`;
  let n = 1;
  while (used.has(candidate.toLowerCase())) {
    candidate = `${stem}-${n++}.${ext}`;
  }
  used.add(candidate.toLowerCase());
  return candidate;
}

/** Extend PATH so pm2-spawned brains find system binaries (mirrors claude executor). */
function buildPath(): string {
  const extra = [
    '/usr/local/bin',
    '/usr/bin',
    '/bin',
    '/opt/homebrew/bin', // mac dev
  ];
  return [...extra, process.env.PATH || ''].join(':');
}
