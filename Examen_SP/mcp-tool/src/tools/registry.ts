/**
 * Registry of available tools
 */

import { MCPTool, ToolSchema } from '../types/mcp.types';

export class ToolRegistry {
  private tools: Map<string, MCPTool> = new Map();

  /**
   * Register a tool
   */
  register(tool: MCPTool): void {
    this.tools.set(tool.name, tool);
  }

  /**
   * Get a tool by name
   */
  get(name: string): MCPTool | undefined {
    return this.tools.get(name);
  }

  /**
   * Listar todas las tools (solo schemas)
   */
  list(): ToolSchema[] {
    return Array.from(this.tools.values()).map(tool => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema,
    }));
  }

  /**
   * Contar tools registradas
   */
  count(): number {
    return this.tools.size;
  }
}
