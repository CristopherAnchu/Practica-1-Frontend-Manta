# 🔄 n8n Event Bus - UNIFIT

Workflows de n8n para orquestación de eventos externos.

## 📋 Principio Fundamental

**"Todo evento externo pasa por n8n"**

n8n actúa como el Event Bus central del sistema, orquestando:
- Webhooks de pasarelas de pago
- Webhooks de partners B2B
- Notificaciones externas (email, Telegram, WhatsApp)
- Tareas programadas (cron jobs)

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────┐
│         External Events                 │
│  (Stripe, Partners, Email, etc.)        │
└───────────────┬─────────────────────────┘
                ↓
┌───────────────────────────────────────────┐
│            n8n Event Bus                  │
│         (Puerto 5678)                     │
├───────────────────────────────────────────┤
│                                           │
│  Workflows:                               │
│  1. Payment Handler                       │
│  2. Partner Handler                       │
│  3. MCP Input Handler                     │
│  4. Scheduled Tasks                       │
│                                           │
└───────────────┬───────────────────────────┘
                ↓
┌───────────────────────────────────────────┐
│      UNIFIT Microservices                 │
│  (Auth, Payment, AI, REST, GraphQL, WS)   │
└───────────────────────────────────────────┘
```

## 🚀 Instalación

### Opción 1: Docker (Recomendado)

```bash
# Incluido en docker-compose.yml
docker-compose up n8n
```

### Opción 2: NPM

```bash
npm install -g n8n
n8n start
```

## 🎯 Acceso

- **URL**: http://localhost:5678
- **Usuario**: Configurar en primer acceso
- **Password**: Configurar en primer acceso

## 📊 Workflows Obligatorios

### 1. Payment Handler ⭐

**Propósito**: Procesar webhooks de pasarelas de pago

**Flujo:**
```
1. Webhook Trigger (POST /webhook/payment)
2. Validar payload (verificar firma)
3. Normalizar datos
4. Actualizar base de datos
5. Activar servicio/reserva
6. Enviar notificación WebSocket
7. Enviar email de confirmación
8. Disparar webhook a partners
```

**Nodos:**
- Webhook (Trigger)
- Function: Validate Signature
- HTTP Request: Update Payment Status
- HTTP Request: Activate Service
- WebSocket: Send Notification
- Send Email
- HTTP Request: Notify Partners

**Ejemplo de payload de entrada:**
```json
{
  "type": "payment.succeeded",
  "paymentId": "pay_123",
  "amount": 5000,
  "currency": "USD",
  "metadata": {
    "reservationId": "res_456",
    "userId": "user_789"
  }
}
```

### 2. Partner Handler ⭐

**Propósito**: Recibir y procesar webhooks de partners

**Flujo:**
```
1. Webhook Trigger (POST /webhook/partner)
2. Verificar firma HMAC
3. Validar API Key
4. Procesar según tipo de evento
5. Ejecutar acción de negocio
6. Enviar ACK al partner
7. Registrar evento en BD
```

**Nodos:**
- Webhook (Trigger)
- Function: Verify HMAC
- Switch: Event Type
- HTTP Request: Process Event
- HTTP Request: Send ACK
- Postgres: Log Event

**Ejemplo de payload:**
```json
{
  "eventType": "tour.purchased",
  "partnerId": "partner_abc",
  "timestamp": "2026-01-11T10:00:00Z",
  "data": {
    "tourId": "tour_123",
    "userId": "user_789",
    "amount": 150.00
  }
}
```

### 3. MCP Input Handler (Opcional)

**Propósito**: Recibir mensajes de Telegram/Email y enviar a AI

**Flujo:**
```
1. Telegram/Email Trigger
2. Extraer contenido y adjuntos
3. HTTP Request: AI Orchestrator /chat/multimodal
4. Procesar respuesta
5. Responder por el mismo canal
```

**Nodos:**
- Telegram Trigger / Email Trigger
- Function: Extract Content
- HTTP Request: AI Orchestrator
- Telegram: Send Message / Send Email

### 4. Scheduled Tasks ⭐

**Propósito**: Ejecutar tareas programadas

**Tareas:**

**a) Reporte Diario (cada día a las 8am)**
```
1. Cron Trigger: 0 8 * * *
2. HTTP Request: GET /estadisticas
3. Function: Format Report
4. Send Email: Admin
```

**b) Limpieza de Datos (cada semana)**
```
1. Cron Trigger: 0 0 * * 0
2. HTTP Request: DELETE /tokens/expired
3. HTTP Request: DELETE /payments/old
4. Log: Cleanup Complete
```

**c) Recordatorios de Reservas (cada hora)**
```
1. Cron Trigger: 0 * * * *
2. HTTP Request: GET /reservas/proximas
3. Loop: Each Reservation
4. Send Email/WebSocket: Reminder
```

**d) Health Checks (cada 5 minutos)**
```
1. Cron Trigger: */5 * * * *
2. HTTP Request: GET /health (todos los servicios)
3. If: Service Down
4. Send Alert: Telegram/Email
```

## 📥 Importar Workflows

Los workflows están en formato JSON en esta carpeta:

1. `payment-handler.json`
2. `partner-handler.json`
3. `mcp-input-handler.json`
4. `scheduled-tasks.json`

**Para importar:**
1. Abrir n8n (http://localhost:5678)
2. Click en "Workflows" → "Import from File"
3. Seleccionar archivo JSON
4. Configurar credenciales
5. Activar workflow

## 🔐 Configurar Credenciales

En n8n, configurar:

**PostgreSQL:**
- Host: postgres
- Database: neondb
- User: neondb_owner
- Password: [tu password]

**SMTP (Email):**
- Host: smtp.gmail.com
- Port: 587
- User: tu-email@gmail.com
- Password: [app password]

**Telegram (Opcional):**
- Bot Token: [tu bot token]
- Chat ID: [tu chat id]

**HTTP Auth:**
- Headers: Authorization: Bearer [token]

## 🌐 URLs de Webhooks

Para recibir webhooks en n8n:

**Payment Webhook:**
```
http://localhost:5678/webhook/payment
```

**Partner Webhook:**
```
http://localhost:5678/webhook/partner
```

**Test Webhook:**
```
http://localhost:5678/webhook-test/[workflow-id]
```

## 🧪 Testing

### Probar Payment Handler:

```bash
curl -X POST http://localhost:5678/webhook/payment \
  -H "Content-Type: application/json" \
  -d '{
    "type": "payment.succeeded",
    "paymentId": "pay_test_123",
    "amount": 5000
  }'
```

### Probar Partner Handler:

```bash
curl -X POST http://localhost:5678/webhook/partner \
  -H "Content-Type: application/json" \
  -H "X-API-Key: partner_api_key" \
  -H "X-UNIFIT-Signature: hmac_signature" \
  -d '{
    "eventType": "tour.purchased",
    "data": {"userId": "123"}
  }'
```

## 📊 Monitoreo

n8n proporciona:
- Historial de ejecuciones
- Logs de errores
- Métricas de performance
- Webhooks fallidos para retry

**Ver ejecuciones:**
1. Click en workflow
2. Tab "Executions"
3. Ver detalles de cada ejecución

## 🔄 Retry Strategy

Configurar en cada nodo HTTP Request:
- Retry on Fail: Yes
- Max Retries: 3
- Retry Interval: 5000ms

## 📚 Referencias

- [n8n Documentation](https://docs.n8n.io/)
- [Workflow Templates](https://n8n.io/workflows)
- [Function Node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.function/)

## 💡 Tips

1. Usar "Sticky Notes" para documentar workflows
2. Nombrar nodos descriptivamente
3. Validar payloads con "IF" nodes
4. Usar "Error Trigger" para manejar fallos
5. Activar workflows gradualmente (uno por uno)
