/**
 * Gemini Service - Servicio para integración con Google Gemini AI
 */

import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private genAI: GoogleGenerativeAI;
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    
    if (!this.apiKey) {
      this.logger.error('GEMINI_API_KEY no está configurada');
      throw new Error('GEMINI_API_KEY es requerida');
    }

    this.genAI = new GoogleGenerativeAI(this.apiKey);
    this.logger.log('Gemini Service inicializado');
  }

  /**
   * Crear modelo con tools (Function Calling)
   */
  createModelWithTools(tools: any[]): any {
    // Convertir tools de formato MCP a formato Gemini
    const geminiTools = tools.map(tool => ({
      name: tool.name,
      description: tool.description,
      parameters: tool.inputSchema,
    }));

    this.logger.log(`Creando modelo con ${geminiTools.length} tools`);
    this.logger.log(`Tool definitions: ${JSON.stringify(geminiTools, null, 2)}`);

    const model = this.genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      tools: [{ functionDeclarations: geminiTools }],
    } as any);

    return model;
  }

  /**
   * Iniciar chat con contexto
   */
  startChat(model: any, history: any[] = []) {
    return model.startChat({
      history,
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });
  }
}
