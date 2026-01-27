#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';

const server = new Server(
  {
    name: 'exam2p-mcp-auditoria',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// URL del endpoint REST
const API_URL = process.env.API_URL || 'http://localhost:3000/exam2p-auditoria';

// Listar herramientas disponibles
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'exam2p_consultar_auditoria',
        description: 'Consulta los registros de auditoría del sistema. Permite filtrar por límite opcional.',
        inputSchema: {
          type: 'object',
          properties: {
            limite: {
              type: 'number',
              description: 'Número máximo de registros a retornar (opcional). Si no se especifica, retorna todos.',
              minimum: 1,
            },
          },
          required: [],
        },
      },
    ],
  };
});

// Ejecutar herramienta
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'exam2p_consultar_auditoria') {
    try {
      const { limite } = request.params.arguments || {};
      
      // Construir URL con parámetro opcional
      let url = API_URL;
      if (limite && limite > 0) {
        url += `?limite=${limite}`;
      }

      console.error(`[MCP] Consultando auditoría: ${url}`);

      // Llamar al endpoint REST
      const response = await axios.get(url);
      const registros = response.data;

      console.error(`[MCP] Registros obtenidos: ${registros.length}`);

      // Formatear respuesta
      const resultado = {
        totalRegistros: registros.length,
        registros: registros.map(r => ({
          id: r.registroId,
          entidad: r.exam2p_entidad,
          registroAfectadoId: r.exam2p_registroAfectadoId,
          accion: r.exam2p_accion,
          usuario: r.exam2p_usuario,
          fechaHora: r.exam2p_fechaHora,
          detalle: r.exam2p_detalle,
        })),
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(resultado, null, 2),
          },
        ],
      };
    } catch (error) {
      console.error('[MCP] Error al consultar auditoría:', error.message);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              error: true,
              mensaje: `Error al consultar auditoría: ${error.message}`,
            }, null, 2),
          },
        ],
        isError: true,
      };
    }
  }

  throw new Error(`Herramienta desconocida: ${request.params.name}`);
});

// Iniciar servidor
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('[MCP] Servidor exam2p_consultar_auditoria iniciado');
  console.error(`[MCP] Conectado a API: ${API_URL}`);
}

main().catch((error) => {
  console.error('[MCP] Error fatal:', error);
  process.exit(1);
});
