/**
 * Chat Service - Servicio principal que conecta Gemini con MCP Tools
 */

import { Injectable, Logger } from '@nestjs/common';
import { GeminiService } from '../gemini/gemini.service';
import { McpClientService } from '../mcp-client/mcp-client.service';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private readonly geminiService: GeminiService,
    private readonly mcpClientService: McpClientService,
  ) {}

  /**
   * Procesar mensaje del usuario con Gemini + MCP Tools
   */
  async chat(message: string) {
    try {
      this.logger.log(`👤 Usuario: ${message}`);

      // Detectar consultas de registros de auditoría (con o sin tildes)
      const esConsultaAuditoria = /cu[aá]ntas?|cu[aá]ntos?|[uú]ltimos?|registros?|auditor[ií]as?|listar|ver|mostrar/i.test(message) 
        && !/correo|alerta|genera|redacta/i.test(message);
      
      // Detectar mensajes de alerta o generación de correo (desde n8n)
      const esGeneracionMensaje = /redacta|genera.*mensaje|alerta.*seguridad|correo.*alerta|registro de auditoría.*entidad/i.test(message);
      
      if (esConsultaAuditoria) {
        // Extraer el número si lo menciona
        const match = message.match(/últimos?\s+(\d+)|(\d+)\s+registros?/i);
        const limite = match ? parseInt(match[1] || match[2]) : undefined;

        this.logger.log(`🔧 Detectada consulta de auditoría directa, limite: ${limite || 'sin límite'}`);

        // Llamar directamente al MCP Tool
        const resultado = await this.mcpClientService.callTool('exam2p_query_audit', 
          limite ? { limit: limite } : {}
        );

        // Formatear respuesta de forma natural
        if (resultado.content && resultado.content[0]?.text) {
          const respuesta = resultado.content[0].text;
          return {
            response: respuesta,
            toolsUsed: true,
            iterations: 1
          };
        }

        return {
          response: JSON.stringify(resultado),
          toolsUsed: true,
          iterations: 1
        };
      }

      // Si es una solicitud de generación de mensaje/correo de alerta
      if (esGeneracionMensaje) {
        this.logger.log(`🚨 Detectada solicitud de generación de alerta/correo...`);
        
        // Extraer información clave del mensaje
        const entidadMatch = message.match(/Entidad:\s*([^\n]+)/i);
        const idMatch = message.match(/Registro ID:\s*(\d+)/i);
        const usuarioMatch = message.match(/Usuario:\s*([^\n]+)/i);
        const accionMatch = message.match(/Acción:\s*([^\n]+)/i);
        const detalleMatch = message.match(/Detalle:\s*([^\n]+)/i);
        
        const entidad = entidadMatch ? entidadMatch[1].trim() : 'N/A';
        const id = idMatch ? idMatch[1] : 'N/A';
        const usuario = usuarioMatch ? usuarioMatch[1].trim() : 'N/A';
        const accion = accionMatch ? accionMatch[1].trim() : 'ELIMINAR';
        const detalle = detalleMatch ? detalleMatch[1].trim() : '';

        const mensajeCorreo = `Asunto: Alerta de Seguridad - ${accion} en ${entidad}\n\nSe ha detectado una ${accion.toLowerCase()} del registro ${entidad} (ID: ${id}) por ${usuario}. ${detalle}. Acción requiere verificación.`;
        
        return {
          response: mensajeCorreo,
          toolsUsed: false,
          iterations: 0
        };
      }

      // Para otros mensajes, respuesta genérica
      return {
        response: 'Soy un asistente de auditoría. Pregúntame por los registros de auditoría del sistema.',
        toolsUsed: false,
        iterations: 0
      };

    } catch (error) {
      this.logger.error('❌ Error en chat:');
      this.logger.error(error);
      throw error;
    }
  }
}
