# 🏋️ UNIFIT - Sistema de Gestión de Gimnasio Universitario

## 📋 Descripción del Proyecto

**UNIFIT** es un sistema completo de gestión de gimnasio desarrollado con **arquitectura de microservicios distribuidos**, implementando patrones modernos de desarrollo y las últimas tecnologías.

### ⚡ Segundo Parcial - Extensiones Implementadas

Este proyecto extiende el sistema del primer parcial con **4 Pilares Arquitectónicos**:

1. **🔐 Microservicio de Autenticación** (Puerto 3001)
2. **💳 Payment Service con Webhooks B2B** (Puerto 3002)
3. **🤖 AI Orchestrator con MCP** (Puerto 3003)
4. **🔄 n8n Event Bus** (Puerto 5678)

---

## 🏗️ Arquitectura Completa del Sistema

```
┌────────────────────────────────────────────────────────────────────┐
│                    FRONTEND (Angular 20)                           │
│                       Puerto 4200                                  │
└─────────────────────────────┬──────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        API GATEWAY (Opcional)                       │
└────────┬────────┬────────┬────────┬────────┬────────┬──────────────┘
         │        │        │        │        │        │
         ↓        ↓        ↓        ↓        ↓        ↓
    ┌────────┐┌────────┐┌────────┐┌────────┐┌────────┐┌────────┐
    │  Auth  ││  REST  ││GraphQL ││Payment ││   AI   ││WebSocket│
    │  :3001 ││  :3000 ││  :4000 ││  :3002 ││  :3003 ││  :8080 │
    │ NestJS ││ Golang ││ NestJS ││ NestJS ││ Python ││ Python │
    └────┬───┘└────┬───┘└────┬───┘└────┬───┘└────┬───┘└────┬───┘
         │         │         │         │         │         │
         └─────────┴─────────┴─────────┴─────────┴─────────┘
                              ↓
         ┌────────────────────────────────────────────┐
         │     PostgreSQL (Neon Cloud) + Redis        │
         └────────────────────────────────────────────┘
                              ↑
         ┌────────────────────┴────────────────────────┐
         │          n8n Event Bus (:5678)              │
         │   Payment Handler | Partner Handler         │
         │   Scheduled Tasks | MCP Input Handler       │
         └─────────────────────────────────────────────┘
```

---

## 🎯 Componentes del Sistema

### 📦 Primer Parcial (Base)

| Componente | Tecnología | Puerto | Descripción |
|------------|-----------|--------|-------------|
| REST API | Golang + GORM | 3000 | API REST principal con autenticación JWT |
| GraphQL API | NestJS + Apollo | 4000 | Consultas complejas y reportes |
| WebSocket | Python + Socket.IO | 8080 | Comunicación en tiempo real |
| Frontend | Angular 20 | 4200 | Interfaz de usuario SPA |

### ⭐ Segundo Parcial (Nuevos Pilares)

| Pilar | Componente | Tecnología | Puerto | Cumplimiento |
|-------|-----------|-----------|--------|--------------|
| **Pilar 1** | Auth Service | NestJS + JWT + Redis | 3001 | ✅ 15% |
| **Pilar 2** | Payment Service | NestJS + Adapter Pattern | 3002 | ✅ 20% |
| **Pilar 3** | AI Orchestrator | Python + FastAPI + MCP | 3003 | ✅ 20% |
| **Pilar 4** | n8n Event Bus | n8n Cloud | 5678 | ✅ 15% |

---

## 🔐 Pilar 1: Microservicio de Autenticación (15%)

### Características Implementadas:

✅ **Auth Service independiente** (NestJS)  
✅ **JWT con access y refresh tokens**  
✅ **Validación local de tokens** (sin consultas constantes)  
✅ **Base de datos propia** (PostgreSQL)  
✅ **Rate limiting** en login (10 intentos/minuto)  
✅ **Blacklist de tokens revocados** (Redis)  
✅ **Refresh token rotation**  

### Endpoints:

```
POST /auth/register    - Registrar usuario
POST /auth/login       - Iniciar sesión
POST /auth/logout      - Cerrar sesión
POST /auth/refresh     - Renovar access token
GET  /auth/me          - Información del usuario
GET  /auth/validate    - Validar token (interno)
```

### Documentación:
📄 Ver: `auth-service/README.md`

---

## 💳 Pilar 2: Payment Service + Webhooks B2B (20%)

### Características Implementadas:

✅ **Patrón Adapter** para pasarelas de pago  
✅ **Adapters**: StripeAdapter, MockAdapter  
✅ **Normalización de webhooks** a formato común  
✅ **Sistema de Partners B2B** con registro  
✅ **Autenticación HMAC-SHA256** para webhooks  
✅ **Webhooks bidireccionales** con otros grupos  
✅ **API Key** para partners  

### Endpoints:

```
POST /payments                  - Crear pago
GET  /payments/:id              - Estado de pago
POST /payments/webhook          - Recibir webhook de pasarela
POST /partners/register         - Registrar partner
POST /partners/webhook          - Recibir webhook de partner
```

### Integración B2B:

El sistema permite comunicación bidireccional con otros grupos:

```javascript
// Grupo A (UNIFIT) notifica pago exitoso
→ POST https://grupo-b.com/webhooks
   Headers: X-UNIFIT-Signature: hmac_sha256

// Grupo B responde con oferta
→ POST https://unifit.com/partners/webhook
   Headers: X-API-Key, X-UNIFIT-Signature
```

### Documentación:
📄 Ver: `payment-service/README.md`

---

## 🤖 Pilar 3: AI Orchestrator + MCP (20%)

### Características Implementadas:

✅ **Patrón Strategy** para proveedores LLM  
✅ **Adapters**: GeminiAdapter, OpenAIAdapter, MockAdapter  
✅ **MCP Server** con 5 herramientas  
✅ **Procesamiento multimodal**: Texto + Imágenes + PDFs  
✅ **OCR** para extracción de texto de imágenes  
✅ **Integración** con REST, GraphQL y Payment  

### MCP Tools (5 herramientas):

| # | Tool | Tipo | Descripción |
|---|------|------|-------------|
| 1 | `buscar_reservas` | Consulta | Busca reservas con filtros |
| 2 | `obtener_usuario` | Consulta | Información de usuario |
| 3 | `crear_reserva` | Acción | Crea nueva reserva |
| 4 | `crear_rutina` | Acción | Crea rutina personalizada |
| 5 | `estadisticas_gimnasio` | Reporte | Genera estadísticas |

### Endpoints:

```
POST /chat                - Chat con texto
POST /chat/multimodal     - Chat con imágenes/PDFs
GET  /tools               - Listar herramientas MCP
POST /tools/{tool_name}   - Ejecutar herramienta
```

### Ejemplos de uso:

```
Usuario: "¿Cuántas reservas tengo hoy?"
AI: Ejecuta buscar_reservas(userId="123")
    → "Tienes 3 reservas activas para hoy"

Usuario: [Sube imagen de cédula]
AI: OCR extrae datos
    → Ejecuta crear_usuario() con datos extraídos
```

### Documentación:
📄 Ver: `ai-orchestrator/README.md`

---

## 🔄 Pilar 4: n8n Event Bus (15%)

### Características Implementadas:

✅ **Principio**: "Todo evento externo pasa por n8n"  
✅ **Workflow 1**: Payment Handler  
✅ **Workflow 2**: Partner Handler  
✅ **Workflow 3**: MCP Input Handler  
✅ **Workflow 4**: Scheduled Tasks  

### Workflows Implementados:

**1. Payment Handler:**
```
Webhook → Validar → Actualizar BD → Activar Servicio 
→ Notificar WebSocket → Email → Webhook Partners
```

**2. Partner Handler:**
```
Webhook → Verificar HMAC → Procesar Evento 
→ Acción de Negocio → Enviar ACK
```

**3. Scheduled Tasks:**
- Reporte diario (8am)
- Limpieza de datos (semanal)
- Recordatorios de reservas (cada hora)
- Health checks (cada 5min)

### Documentación:
📄 Ver: `n8n-workflows/README.md`

---

## 🚀 Instalación y Ejecución

### Opción 1: Docker Compose (Recomendado)

```bash
# 1. Clonar repositorio
git clone https://github.com/CristopherAnchu/Practica-1-Frontend-Manta.git
cd Practica-1-Frontend-Manta/UNIFIT

# 2. Configurar variables de entorno
cp auth-service/.env.example auth-service/.env
cp payment-service/.env.example payment-service/.env
cp ai-orchestrator/.env.example ai-orchestrator/.env

# 3. Iniciar todos los servicios
docker-compose up -d

# 4. Verificar servicios
docker-compose ps
```

### Opción 2: Manual (Desarrollo)

```bash
# Terminal 1: Auth Service
cd auth-service
npm install
npm run start:dev

# Terminal 2: Payment Service
cd payment-service
npm install
npm run start:dev

# Terminal 3: AI Orchestrator
cd ai-orchestrator
pip install -r requirements.txt
python main.py

# Terminal 4: REST API
cd RestGolang
go run main.go

# Terminal 5: GraphQL
cd graphql
npm install
npm run start:dev

# Terminal 6: WebSocket
cd websocket-server
pip install -r requirements.txt
python server.py

# Terminal 7: Frontend
cd gym-uleam
npm install
ng serve

# Terminal 8: n8n
npx n8n
```

### Opción 3: Script PowerShell Automatizado

```powershell
.\start-all-extended.ps1
```

---

## 🌐 URLs de Acceso

| Servicio | URL | Credenciales |
|----------|-----|--------------|
| Frontend | http://localhost:4200 | - |
| Auth Service | http://localhost:3001 | - |
| REST API | http://localhost:3000 | - |
| GraphQL Playground | http://localhost:4000/graphql | - |
| Payment Service | http://localhost:3002 | - |
| AI Orchestrator | http://localhost:3003 | - |
| WebSocket | http://localhost:8080 | - |
| n8n | http://localhost:5678 | admin / unifit2026 |

---

## 📊 Base de Datos

**PostgreSQL en Neon (Cloud)**

```
Host: ep-blue-lab-adyjs4fj-pooler.c-2.us-east-1.aws.neon.tech
Database: neondb
SSL: Required
```

**Esquema compartido:**
- `users` - Usuarios del sistema
- `auth_users` - Auth Service (usuarios autenticación)
- `refresh_tokens` - Refresh tokens
- `payments` - Pagos
- `partners` - Partners B2B
- `webhook_events` - Eventos de webhooks
- `reservas` - Reservas
- `rutinas` - Rutinas
- `equipos` - Equipos
- Etc.

**Redis:**
- Blacklist de tokens revocados
- Cache de sesiones

---

## 🔗 Integración entre Componentes

### Flujo Completo: Pago de Reserva

```
1. Usuario → Frontend: Crear reserva
2. Frontend → REST API: POST /reservas (autenticado con JWT)
3. REST API → Valida JWT localmente (sin consultar Auth Service)
4. REST API → Crea reserva pendiente
5. Frontend → Payment Service: POST /payments
6. Payment Service → Stripe/Mock: Crear intención de pago
7. Usuario → Confirma pago en frontend
8. Stripe → n8n: POST /webhook/payment (pago exitoso)
9. n8n → Payment Service: Actualizar estado
10. n8n → REST API: Activar reserva
11. n8n → WebSocket: Notificar en tiempo real
12. n8n → Email: Enviar confirmación
13. n8n → Partners: Notificar grupos colaboradores
14. Partner → n8n: POST /webhook/partner (ofrecer tour)
15. AI Orchestrator → Analiza y sugiere al usuario
```

---

## 📚 Documentación Adicional

- 📄 [Auth Service](./auth-service/README.md)
- 📄 [Payment Service](./payment-service/README.md)
- 📄 [AI Orchestrator](./ai-orchestrator/README.md)
- 📄 [n8n Workflows](./n8n-workflows/README.md)
- 📄 [GraphQL API](./graphql/README.md)
- 📄 [WebSocket Server](./websocket-server/README.md)

---

## 🧪 Testing

### Auth Service

```bash
# Registrar usuario
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@unifit.com","password":"Test1234!","nombre":"Test User"}'

# Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@unifit.com","password":"Test1234!"}'
```

### Payment Service

```bash
# Crear pago
curl -X POST http://localhost:3002/payments \
  -H "Content-Type: application/json" \
  -d '{"amount":5000,"currency":"USD","description":"Mensualidad","userId":"user_123"}'

# Registrar partner
curl -X POST http://localhost:3002/partners/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Partner Test","webhookUrl":"https://partner.com/webhook","subscribedEvents":["payment.succeeded"]}'
```

### AI Orchestrator

```bash
# Chat simple
curl -X POST http://localhost:3003/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"¿Cuántas reservas tengo?","userId":"user_123"}'

# Chat con imagen
curl -X POST http://localhost:3003/chat/multimodal \
  -F "message=¿Qué dice este documento?" \
  -F "file=@documento.pdf"
```

---

## 👥 Equipo de Desarrollo

**Grupo: [Nombre del Grupo]**

- Integrante 1: [Nombre] - [Responsabilidad]
- Integrante 2: [Nombre] - [Responsabilidad]
- Integrante 3: [Nombre] - [Responsabilidad]

---

## 📖 Referencias Técnicas

### Arquitectura y Patrones:
- [Microservices Pattern](https://microservices.io/)
- [Adapter Pattern](https://refactoring.guru/design-patterns/adapter)
- [Strategy Pattern](https://refactoring.guru/design-patterns/strategy)
- [Event-Driven Architecture](https://martinfowler.com/articles/201701-event-driven.html)

### Autenticación:
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OAuth 2.0 Token Refresh](https://oauth.net/2/grant-types/refresh-token/)

### Webhooks:
- [HMAC Authentication](https://en.wikipedia.org/wiki/HMAC)
- [Webhook Security](https://webhooks.fyi/)

### IA y MCP:
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Google Gemini API](https://ai.google.dev/)
- [OpenAI Function Calling](https://platform.openai.com/docs/guides/function-calling)

### Event Bus:
- [n8n Documentation](https://docs.n8n.io/)
- [Workflow Automation](https://n8n.io/workflows)

---

## 📝 Licencia

MIT License - UNIFIT 2026

---

## 🎓 Proyecto Académico

**Asignatura**: Aplicaciones y Servicios Web  
**Institución**: Universidad Laica Eloy Alfaro de Manabí  
**Período**: Segundo Parcial 2026  

---

¡Gracias por revisar nuestro proyecto! 🚀
