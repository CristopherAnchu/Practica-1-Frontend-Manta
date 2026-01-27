# MCP Server - exam2p_consultar_auditoria

## Descripción
MCP Server con JSON-RPC 2.0 para consultar registros de auditoría del sistema.

## Arquitectura

```
Gemini (Client)
     ↓ JSON-RPC 2.0
MCP Server (Express) ← Puerto 3001
     ↓ HTTP REST
Microservicio de Auditoría ← Puerto 3000
     ↓
PostgreSQL
```

## Tool Disponible

```json
{
  "name": "exam2p_consultar_auditoria",
  "description": "Consulta los registros de auditoría del sistema",
  "inputSchema": {
    "type": "object",
    "properties": {
      "limite": {
        "type": "number",
        "description": "Número máximo de registros a retornar (opcional)",
        "minimum": 1
      }
    },
    "required": []
  }
}
```

## Instalación

```bash
cd mcp-tool
npm install
```

## Configuración

Crear archivo `.env`:

```env
PORT=3001
BACKEND_URL=http://localhost:3000
```

## Ejecución

### Desarrollo (con hot-reload)
```bash
npm run dev
```

### Producción
```bash
npm run build
npm start
```

## Endpoints JSON-RPC 2.0

### 1. Listar Tools
**POST** `/mcp/tools/list`

Request:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list",
  "params": {}
}
```

Response:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [
      {
        "name": "exam2p_consultar_auditoria",
        "description": "Consulta los registros de auditoría del sistema",
        "inputSchema": { ... }
      }
    ]
  }
}
```

### 2. Ejecutar Tool
**POST** `/mcp/tools/call`

Request:
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "exam2p_consultar_auditoria",
    "arguments": {
      "limite": 10
    }
  }
}
```

Response:
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Registros de auditoría:\n..."
      }
    ]
  }
}
```

### 3. Health Check
**GET** `/health`

Response:
```json
{
  "status": "ok",
  "service": "MCP Server - Auditoría",
  "tools": 1,
  "timestamp": "2026-01-27T10:30:00.000Z"
}
```

## Integración con Gemini

El MCP Server expone las tools en formato compatible con Gemini Function Calling:

1. Gemini solicita la lista de tools
2. MCP Server retorna el schema de `exam2p_consultar_auditoria`
3. Gemini decide usar la tool con argumentos
4. MCP Server ejecuta la consulta al backend
5. MCP Server retorna los resultados a Gemini

## Prueba con cURL

```bash
# Listar tools
curl -X POST http://localhost:3001/mcp/tools/list \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/list",
    "params": {}
  }'

# Ejecutar tool
curl -X POST http://localhost:3001/mcp/tools/call \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/call",
    "params": {
      "name": "exam2p_consultar_auditoria",
      "arguments": { "limite": 5 }
    }
  }'
```

## Endpoint Backend Conectado

**GET** `http://localhost:3000/exam2p-auditoria?limite={numero}`

- Sin parámetro: retorna todos los registros
- Con límite: retorna los N registros más recientes
