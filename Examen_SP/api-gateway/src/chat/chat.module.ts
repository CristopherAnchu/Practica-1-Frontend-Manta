import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { GeminiModule } from '../gemini/gemini.module';
import { McpClientModule } from '../mcp-client/mcp-client.module';

@Module({
  imports: [GeminiModule, McpClientModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
