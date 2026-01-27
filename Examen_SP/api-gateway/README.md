# API Gateway con Gemini AI

## Descripción
API Gateway que integra Google Gemini AI con el MCP Server para consultar auditoría usando lenguaje natural.

## Arquitectura Completa

```
Usuario
  ↓ Pregunta en lenguaje natural
API Gateway (NestJS) ← Puerto 3003
  ├─ Gemini Service (Google AI)
  └─ MCP Client
       ↓ JSON-RPC 2.0
     MCP Server ← Puerto 3001
       ↓ HTTP REST
     Microservicio de Auditoría ← Puerto 3000
       ↓
     PostgreSQL
```

## Instalación

```bash
cd api-gateway
npm install
```

## Configuración

Editar `.env`:

```env
PORT=3003
GEMINI_API_KEY=tu_api_key_de_gemini_aqui
MCP_SERVER_URL=http://localhost:3001
```

### Obtener API Key de Gemini

1. Ve a https://makersuite.google.com/app/apikey
2. Crea una API Key
3. Copia la key al archivo `.env`

## Ejecución

```bash
npm run start:dev
```

## Uso

### Endpoint: POST /chat

**Request:**
```bash
curl -X POST http://localhost:3003/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Muéstrame los últimos 5 registros de auditoría"
  }'
```

**Response:**
```json
{
  "response": "Aquí están los últimos 5 registros de auditoría:\n\n1. ID: 5\n   Entidad: Producto\n   ...",
  "toolsUsed": true,
  "iterations": 1
}
```

## Ejemplos de Consultas en Lenguaje Natural

```bash
# Obtener registros recientes
"Dame los últimos 3 registros de auditoría"

# Todos los registros
"¿Cuántos registros de auditoría hay en total?"

# Información general
"¿Qué registros de eliminación hay?"
```

## Cómo Funciona

1. **Usuario pregunta** en lenguaje natural
2. **Gemini AI** analiza la pregunta y decide usar la tool `exam2p_consultar_auditoria`
3. **API Gateway** ejecuta la tool vía MCP Client
4. **MCP Server** consulta el microservicio de auditoría
5. **Gemini AI** procesa los resultados y genera respuesta en lenguaje natural
6. **Usuario recibe** respuesta clara y estructurada

## Arquitectura de Módulos

### GeminiModule
- `GeminiService`: Integración con Google Generative AI
- Maneja Function Calling

### McpClientModule  
- `McpClientService`: Cliente JSON-RPC 2.0 para MCP Server
- Lista y ejecuta tools

### ChatModule
- `ChatService`: Orquesta Gemini + MCP
- `ChatController`: Endpoint REST

## Logs

El sistema genera logs detallados:

```
[ChatService] 👤 Usuario: Dame los últimos 5 registros
[McpClientService] 🔧 Tools disponibles: 1
[ChatService] 🤖 Gemini solicita ejecutar 1 funciones
[McpClientService] 🔧 Ejecutando tool: exam2p_consultar_auditoria
[ChatService] ✅ Tool ejecutada
[ChatService] 🤖 Gemini: Aquí están los últimos 5 registros...
```

## Troubleshooting

### Error: GEMINI_API_KEY no configurada
- Configura tu API Key en `.env`
- Obtén una en https://makersuite.google.com/app/apikey

### Error: No se pudo conectar con MCP Server
- Asegúrate de que el MCP Server esté corriendo en puerto 3001
- Verifica `MCP_SERVER_URL` en `.env`

### Gemini no usa la tool
- Revisa que el MCP Server esté respondiendo
- Intenta preguntas más específicas sobre auditoría
