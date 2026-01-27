const axios = require('axios');

const MCP_SERVER_URL = 'http://localhost:3001';
let requestId = 0;

async function testMCPServer() {
  console.log('🧪 Testing Exam2P Audit MCP Server\n');

  try {
    // Test 1: Health check
    console.log('📋 Test 1: Health Check');
    const health = await axios.get(`${MCP_SERVER_URL}/health`);
    console.log(`✅ Status: ${health.data.status}`);
    console.log(`📊 Service: ${health.data.service}`);
    console.log(`🔧 Tools: ${health.data.tools}`);
    console.log('\n---\n');

    // Test 2: List tools
    console.log('📋 Test 2: List Tools (JSON-RPC)');
    const listResponse = await axios.post(`${MCP_SERVER_URL}/mcp/tools/list`, {
      jsonrpc: '2.0',
      id: ++requestId,
      method: 'tools/list',
      params: {},
    });
    console.log(`✅ Available tools: ${listResponse.data.result.tools.length}`);
    listResponse.data.result.tools.forEach((tool) => {
      console.log(`   - ${tool.name}: ${tool.description}`);
    });
    console.log('\n---\n');

    // Test 3: Execute tool without limit
    console.log('📋 Test 3: Execute exam2p_query_audit (without limit)');
    const callResponse1 = await axios.post(`${MCP_SERVER_URL}/mcp/tools/call`, {
      jsonrpc: '2.0',
      id: ++requestId,
      method: 'tools/call',
      params: {
        name: 'exam2p_query_audit',
        arguments: {},
      },
    });
    
    if (callResponse1.data.error) {
      console.log('❌ Error:', callResponse1.data.error.message);
    } else {
      const content = callResponse1.data.result.content[0].text;
      console.log('✅ Response:');
      console.log(content.substring(0, 500)); // Show first 500 chars
      if (content.length > 500) {
        console.log('... (response truncated)');
      }
    }
    console.log('\n---\n');

    // Test 4: Execute tool with limit
    console.log('📋 Test 4: Execute exam2p_query_audit (limit: 3)');
    const callResponse2 = await axios.post(`${MCP_SERVER_URL}/mcp/tools/call`, {
      jsonrpc: '2.0',
      id: ++requestId,
      method: 'tools/call',
      params: {
        name: 'exam2p_query_audit',
        arguments: {
          limit: 3,
        },
      },
    });
    
    if (callResponse2.data.error) {
      console.log('❌ Error:', callResponse2.data.error.message);
    } else {
      const content = callResponse2.data.result.content[0].text;
      console.log('✅ Response:');
      console.log(content);
    }
    console.log('\n---\n');

    console.log('✅ All tests completed successfully\n');

  } catch (error) {
    console.error('❌ Error in tests:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n⚠️  Make sure the MCP Server is running:');
      console.error('   cd mcp-tool && npm run dev');
    }
    
    process.exit(1);
  }
}

testMCPServer();
