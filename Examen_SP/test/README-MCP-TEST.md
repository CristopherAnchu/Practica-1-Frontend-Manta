# Script de Prueba - MCP Server

Este script prueba el MCP Server usando JSON-RPC 2.0.

## Uso

```bash
# Primero inicia el MCP Server
cd mcp-tool
npm run dev

# En otra terminal, ejecuta las pruebas
cd test
npm run test:mcp
```

## Qué hace

1. Lista las tools disponibles (JSON-RPC 2.0)
2. Ejecuta la tool `exam2p_consultar_auditoria` sin límite
3. Ejecuta la tool con límite de 5 registros
4. Verifica el health check

## Requisitos

- MCP Server corriendo en `localhost:3001`
- Microservicio de auditoría en `localhost:3000`
