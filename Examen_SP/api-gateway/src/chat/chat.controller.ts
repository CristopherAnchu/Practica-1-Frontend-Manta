import { Controller, Post, Body, Logger } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  private readonly logger = new Logger(ChatController.name);

  constructor(private readonly chatService: ChatService) {}

  @Post()
  async chat(@Body() body: { message: string }) {
    this.logger.log(`POST /chat - Mensaje: ${body.message}`);
    return await this.chatService.chat(body.message);
  }
}
