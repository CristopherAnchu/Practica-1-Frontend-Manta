import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './chat/chat.module';
import { GeminiModule } from './gemini/gemini.module';
import { McpClientModule } from './mcp-client/mcp-client.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ChatModule,
    GeminiModule,
    McpClientModule,
  ],
})
export class AppModule {}
