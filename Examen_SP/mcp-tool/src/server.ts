/**
 * MCP Server - Model Context Protocol Server for Audit
 * Express server implementing JSON-RPC 2.0 for tool execution
 */

import express, { Request, Response } from 'express';
import cors from 'cors';
import { Logger } from './utils/logger';
import { BackendClient } from './services/backend-client';
import { ToolRegistry } from './tools/registry';
import { exam2pQueryAuditTool } from './tools/exam2p-query-audit.tool';
import { JSONRPCRequest, JSONRPCResponse, ToolContext } from './types/mcp.types';

class MCPServer {
  private app: express.Application;
  private logger: Logger;
  private toolRegistry: ToolRegistry;
  private backendClient: BackendClient;
  private port: number;

  constructor() {
    this.app = express();
    this.logger = new Logger('MCPServer');
    this.toolRegistry = new ToolRegistry();
    this.port = parseInt(process.env.PORT || '3001', 10);

    // Initialize Backend Client
    const backendURL = process.env.BACKEND_URL || 'http://localhost:3000';
    this.backendClient = new BackendClient(backendURL);

    // Configure middleware
    this.setupMiddleware();

    // Register tools
    this.registerTools();

    // Configure routes
    this.setupRoutes();
  }

  /**
   * Configure Express middleware
   */
  private setupMiddleware(): void {
    // CORS
    this.app.use(cors());

    // JSON parser with 50MB limit
    this.app.use(express.json({ limit: '50mb' }));

    // Request logging
    this.app.use((req, res, next) => {
      this.logger.info(`${req.method} ${req.path}`);
      next();
    });
  }

  /**
   * Register all available tools
   */
  private registerTools(): void {
    this.logger.info('Registering tools...');
    this.toolRegistry.register(exam2pQueryAuditTool);
    this.logger.success(`${this.toolRegistry.count()} tools registered`);
  }

  /**
   * Configure server routes
   */
  private setupRoutes(): void {
    // Health check
    this.app.get('/health', (req: Request, res: Response) => {
      res.json({
        status: 'ok',
        service: 'MCP Server - Audit Service',
        tools: this.toolRegistry.count(),
        timestamp: new Date().toISOString(),
      });
    });

    // JSON-RPC: List tools
    this.app.post('/mcp/tools/list', async (req: Request, res: Response) => {
      try {
        const request = req.body as JSONRPCRequest;

        const response: JSONRPCResponse = {
          jsonrpc: '2.0',
          id: request.id,
          result: {
            tools: this.toolRegistry.list(),
          },
        };

        this.logger.success(`Listed ${this.toolRegistry.count()} tools`);
        res.json(response);
      } catch (error) {
        this.logger.error('Error listing tools:', error);
        const response: JSONRPCResponse = {
          jsonrpc: '2.0',
          id: req.body.id || null,
          error: {
            code: -32603,
            message: 'Internal error',
            data: error instanceof Error ? error.message : String(error),
          },
        };
        res.status(500).json(response);
      }
    });

    // JSON-RPC: Execute tool
    this.app.post('/mcp/tools/call', async (req: Request, res: Response) => {
      try {
        const request = req.body as JSONRPCRequest;
        const { name, arguments: args } = request.params;

        this.logger.log(`Executing tool: ${name}`);
        this.logger.debug(`Arguments: ${JSON.stringify(args)}`);

        // Find tool
        const tool = this.toolRegistry.get(name);
        if (!tool) {
          const response: JSONRPCResponse = {
            jsonrpc: '2.0',
            id: request.id,
            error: {
              code: -32601,
              message: `Tool not found: ${name}`,
            },
          };
          return res.status(404).json(response);
        }

        // Execute tool
        const context: ToolContext = {
          backendClient: this.backendClient,
        };

        const result = await tool.handler(args, context);

        const response: JSONRPCResponse = {
          jsonrpc: '2.0',
          id: request.id,
          result,
        };

        this.logger.success(`Tool executed: ${name}`);
        res.json(response);
      } catch (error) {
        this.logger.error('Error executing tool:', error);
        const response: JSONRPCResponse = {
          jsonrpc: '2.0',
          id: req.body.id || null,
          error: {
            code: -32603,
            message: 'Error executing tool',
            data: error instanceof Error ? error.message : String(error),
          },
        };
        res.status(500).json(response);
      }
    });
  }

  /**
   * Start server
   */
  public start(): void {
    this.app.listen(this.port, () => {
      this.logger.success(`MCP Server started on port ${this.port}`);
      this.logger.info(`Health check: http://localhost:${this.port}/health`);
      this.logger.info(`Available tools: ${this.toolRegistry.count()}`);
    });
  }
}

// Start server
const server = new MCPServer();
server.start();
