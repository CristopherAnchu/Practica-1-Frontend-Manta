/**
 * Tipos para MCP (Model Context Protocol)
 */

export interface JSONRPCRequest {
  jsonrpc: '2.0';
  id: number | string;
  method: string;
  params: any;
}

export interface JSONRPCResponse {
  jsonrpc: '2.0';
  id: number | string;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

export interface ToolSchema {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface ToolResult {
  content: Array<{
    type: 'text';
    text: string;
  }>;
}

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: any;
  handler: (args: any, context: any) => Promise<ToolResult>;
}

export interface ToolContext {
  backendClient: any;
}
