import { Module } from '@nestjs/common';
import { RateLimitService } from '../common/rate-limit.service';
import { WorkspaceService } from '../common/workspace.service';
import { ImageResizeController } from './image-resize/image-resize.controller';
import { ImageResizeService } from './image-resize/image-resize.service';

/**
 * Utility tools that shell out to CLI binaries on the NUC.
 * Each tool = one controller + service under its own folder; shared plumbing
 * (rate limiting, scratch dirs, secret auth) lives in `../common`.
 */
@Module({
  controllers: [ImageResizeController],
  providers: [ImageResizeService, WorkspaceService, RateLimitService],
})
export class ToolsModule {}
