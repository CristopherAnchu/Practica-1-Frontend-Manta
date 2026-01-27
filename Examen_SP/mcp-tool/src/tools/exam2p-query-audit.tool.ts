import { BackendClient } from '../services/backend-client';
import { MCPTool, ToolResult } from '../types/mcp.types';

export const exam2pQueryAuditTool: MCPTool = {
  name: 'exam2p_query_audit',
  description: 'Query audit records from the system. Allows filtering by optional limit to get the most recent records.',
  inputSchema: {
    type: 'object',
    properties: {
      limit: {
        type: 'number',
        description: 'Maximum number of records to return (optional). If not specified, returns all records.',
        minimum: 1,
      },
    },
    required: [],
  },
  handler: async (args: any, context: { backendClient: BackendClient }): Promise<ToolResult> => {
    try {
      const { limit } = args;

      // Build URL with optional parameter
      let path = '/exam2p-audit';
      if (limit && limit > 0) {
        path += `?limit=${limit}`;
      }

      // Call microservice endpoint
      const records = await context.backendClient.get(path);

      if (!records || records.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: 'No audit records found in the system.',
            },
          ],
        };
      }

      // Format response
      const text = `Audit records found: ${records.length}\n\n` +
        records.map((r: any, index: number) => 
          `${index + 1}. ID: ${r.logId}\n` +
          `   Entity: ${r.exam2p_entity}\n` +
          `   Record ID: ${r.exam2p_recordId}\n` +
          `   Action: ${r.exam2p_action}\n` +
          `   User: ${r.exam2p_user}\n` +
          `   Timestamp: ${new Date(r.exam2p_timestamp).toLocaleString('en-US')}\n` +
          `   Detail: ${r.exam2p_detail || 'N/A'}`
        ).join('\n\n');

      return {
        content: [
          {
            type: 'text',
            text: text,
          },
        ],
      };

    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error querying audit records: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  },
};
