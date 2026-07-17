import { Module } from '@nestjs/common';
import { ChatController } from './chat/chat.controller';
import { ClaudeExecutorService } from './chat/claude-executor.service';
import { RateLimitService } from './chat/rate-limit.service';

@Module({
  controllers: [ChatController],
  providers: [ClaudeExecutorService, RateLimitService],
})
export class AppModule {}
