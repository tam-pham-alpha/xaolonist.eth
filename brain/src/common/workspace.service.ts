import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { mkdtemp, rm } from 'fs/promises';
import * as os from 'os';
import * as path from 'path';

/**
 * Per-job scratch directory for tools that shell out to CLI binaries
 * (ImageMagick, ghostscript, …). Each job gets an isolated temp dir under the
 * OS tmpdir with `in/` and `out/` subfolders; call `cleanup()` in a `finally`
 * so nothing is left behind, even on error.
 */
export interface Workspace {
  id: string;
  /** Root scratch dir for this job. */
  dir: string;
  /** Where uploaded/source files are written. */
  inDir: string;
  /** Where processed results are written before zipping. */
  outDir: string;
}

@Injectable()
export class WorkspaceService {
  private readonly logger = new Logger(WorkspaceService.name);

  async create(prefix = 'xtool'): Promise<Workspace> {
    const id = randomUUID();
    const dir = await mkdtemp(path.join(os.tmpdir(), `${prefix}-`));
    const inDir = path.join(dir, 'in');
    const outDir = path.join(dir, 'out');
    const { mkdir } = await import('fs/promises');
    await mkdir(inDir, { recursive: true });
    await mkdir(outDir, { recursive: true });
    return { id, dir, inDir, outDir };
  }

  /** Best-effort recursive delete — never throws (cleanup must not mask errors). */
  async cleanup(ws: Workspace | null | undefined): Promise<void> {
    if (!ws) return;
    try {
      await rm(ws.dir, { recursive: true, force: true });
    } catch (err) {
      this.logger.warn(
        `failed to clean workspace ${ws.dir}: ${err instanceof Error ? err.message : err}`,
      );
    }
  }
}
