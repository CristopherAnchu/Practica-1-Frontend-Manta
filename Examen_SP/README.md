# Exam 2P - Audit Module

## Score: 10 POINTS (35% of the exam)
## Time: 180 MINUTES (3 HOURS)

## General Description
Implementation of an Audit Module that spans the 4 architectural layers of the practical workshops.

## Project Structure

### Implemented Components

1. **Microservice (25%)** - `exam2p-audit-service`
   - Independent NestJS microservice with its own SQL DB
   - Listens to RabbitMQ events
   - Emits webhook to n8n

2. **Webhook to n8n (25%)**
   - WebhookEmitterService
   - Event: `exam2p.audit.deletion`
   
3. **MCP Tool (25%)** - `exam2p_query_audit`
   - JSON Schema with optional parameter: limit
   - Endpoint: GET /exam2p-audit
   
4. **n8n Workflow (25%)** - `exam2p-audit-workflow`
   - Webhook input
   - IF: Validates action === "DELETE"
   - HTTP Request (Gemini)
   - Telegram: Sends alert
   - Respond to Webhook

## Main Entity

**Exam2PAuditLog** (names in ENGLISH with exam2p prefix)

| Attribute | Type | Description |
|----------|------|-------------|
| logId | number | PK, autoincrement |
| exam2p_entity | string | Name of the affected entity |
| exam2p_recordId | number | ID of the modified/deleted record |
| exam2p_action | string | "CREATE" \| "UPDATE" \| "DELETE" |
| exam2p_user | string | User who performed the action |
| exam2p_timestamp | Date | Date and time of the action |
| exam2p_detail | string | Additional description |

## Required Evidence

1. **Microservice (25%)**: Code + Queue + DB
2. **Webhook (25%)**: Code + n8n Log
3. **MCP Tool (25%)**: Code + Gemini
4. **n8n Workflow (25%)**: JSON + Telegram

## Usage Instructions

### 1. Installation
```bash
# Install microservice dependencies
cd exam2p-audit-service
npm install

# Start Docker (RabbitMQ + PostgreSQL)
cd ..
docker-compose up -d
```

### 2. Start Microservice
```bash
cd exam2p-audit-service
npm run start:dev
```

### 3. Configure n8n
- Import workflow from `n8n-workflow/exam2p-audit-workflow.json`
- Activate the workflow

### 4. Test MCP Tool
```bash
cd mcp-tool
npm start
```

## Configuration

### Environment Variables (Microservice)
```env
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=exam2p_audit
RABBITMQ_URL=amqp://admin:admin@localhost:5672
N8N_WEBHOOK_URL=http://localhost:5678/webhook/exam2p-audit
```

### RabbitMQ
- Queue: `exam2p.record.deleted`
- Exchange: `exam2p.events`

### Database
- Database name: `exam2p_audit`
- Table: `exam2p_audit_logs`

### REST API
- Endpoint: `GET /exam2p-audit`
- Query param: `?limit=5`

### MCP Tool
- Tool name: `exam2p_query_audit`
- Parameter: `limit` (optional)

### Webhook Event
- Event name: `exam2p.audit.deletion`

1. Los nombres deben ser EXACTAMENTE los indicados (en ESPAÑOL)
2. Presentar cada pregunta al docente para registrar calificación
3. Internet permitido para: IA, documentación, repositorio personal
4. Redes sociales/chats: 1ra-2pts, 2da-4pts, 3ra-retiro
5. Móvil prohibido → retiro. Copia → nota 0
6. Commit "Examen 2P - Auditoría" 1 hora después
