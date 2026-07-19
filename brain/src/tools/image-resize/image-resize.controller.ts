import {
  Body,
  Controller,
  Headers,
  Logger,
  Post,
  Req,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import type { Request, Response } from 'express';
import archiver from 'archiver';
import { isAuthorized } from '../../common/brain-auth';
import { RateLimitService } from '../../common/rate-limit.service';
import { WorkspaceService } from '../../common/workspace.service';
import { BadOptionsError, ImageResizeService, UploadFile } from './image-resize.service';
import {
  ACCEPTED_MIME,
  MAX_FILE_BYTES,
  MAX_FILES,
  RATE_LIMIT_PER_HOUR,
  ResizeOptions,
} from './types';

@Controller('tools/image-resize')
export class ImageResizeController {
  private readonly logger = new Logger(ImageResizeController.name);

  constructor(
    private readonly resizer: ImageResizeService,
    private readonly workspace: WorkspaceService,
    private readonly rateLimit: RateLimitService,
  ) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', MAX_FILES, {
      limits: { fileSize: MAX_FILE_BYTES, files: MAX_FILES },
    }),
  )
  async resize(
    @UploadedFiles() files: Array<Express.Multer.File> | undefined,
    @Body('options') optionsRaw: string | undefined,
    @Req() req: Request,
    @Res() res: Response,
    @Headers('x-brain-secret') brainSecret?: string,
    @Headers('x-client-ip') clientIp?: string,
  ) {
    if (!isAuthorized(brainSecret)) {
      return json(res, 401, { error: 'unauthorized' });
    }

    const ip = clientIp || req.ip || 'unknown';
    if (!this.rateLimit.consume(`image-resize:${ip}`, RATE_LIMIT_PER_HOUR)) {
      return json(res, 429, { error: 'rate_limited', message: 'Too many requests this hour' });
    }

    if (!files || files.length === 0) {
      return json(res, 400, { error: 'bad_request', message: 'No files uploaded' });
    }

    const accepted = files.filter((f) => ACCEPTED_MIME.has(f.mimetype));
    if (accepted.length === 0) {
      return json(res, 400, { error: 'bad_request', message: 'No supported image files' });
    }

    let options: ResizeOptions;
    try {
      options = JSON.parse(optionsRaw || '{}');
    } catch {
      return json(res, 400, { error: 'bad_request', message: 'Invalid options JSON' });
    }

    const ws = await this.workspace.create('img-resize');
    try {
      const results = await this.resizer.resizeAll(accepted as UploadFile[], options, ws);
      const succeeded = results.filter((r) => r.ok);
      if (succeeded.length === 0) {
        return json(res, 422, {
          error: 'all_failed',
          message: 'Every image failed to process',
          results,
        });
      }

      // Summary header so the UI can surface per-file failures alongside the zip
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="resized-images.zip"');
      res.setHeader('X-Tool-Result', encodeURIComponent(JSON.stringify(results)));
      res.setHeader('Access-Control-Expose-Headers', 'X-Tool-Result');

      await this.streamZip(res, ws.outDir, succeeded.map((r) => r.name));
      this.logger.log(
        `[image-resize] ${succeeded.length}/${results.length} ok for ${ip.slice(0, 15)}`,
      );
    } catch (err) {
      if (err instanceof BadOptionsError) {
        return json(res, 400, { error: 'bad_request', message: err.message });
      }
      this.logger.error(`image-resize failed: ${err instanceof Error ? err.message : err}`);
      if (!res.headersSent) return json(res, 500, { error: 'internal', message: 'Resize failed' });
      res.end();
    } finally {
      await this.workspace.cleanup(ws);
    }
  }

  /** Zip the named files from `dir` straight into the response stream. */
  private streamZip(res: Response, dir: string, names: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const archive = archiver('zip', { zlib: { level: 6 } });
      archive.on('warning', (err) => this.logger.warn(`archiver: ${err.message}`));
      archive.on('error', reject);
      // The response finishing (or the client aborting) ends the job either way
      res.on('close', () => resolve());
      archive.on('end', () => resolve());

      archive.pipe(res);
      for (const name of names) {
        archive.file(`${dir}/${name}`, { name });
      }
      void archive.finalize();
    });
  }
}

function json(res: Response, status: number, body: unknown): void {
  res.status(status).setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(body));
}
