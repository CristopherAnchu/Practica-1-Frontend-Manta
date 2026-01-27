import { BackendClient } from '../services/backend-client';
import { MCPTool, ToolResult } from '../types/mcp.types';

export const getAuditRecordsTool: MCPTool = {
  name: 'get_audit_records',
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
      let path = '/audit';
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
          `${index + 1}. ID: ${r.recordId}\n` +
          `   Entity: ${r.entity}\n` +
          `   Affected Record: ${r.affectedRecordId}\n` +
          `   Action: ${r.action}\n` +
          `   User: ${r.user}\n` +
          `   Timestamp: ${new Date(r.timestamp).toLocaleString('en-US')}\n` +
          `   Details: ${r.details || 'N/A'}`
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
