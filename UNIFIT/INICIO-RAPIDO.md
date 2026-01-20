# 🎯 Guía Rápida de Inicio - UNIFIT Extensión 2do Parcial

## ✅ Estado de Implementación

### Completado (100%)

#### 🔐 Pilar 1: Auth Service (15%)
- ✅ Microservicio NestJS independiente
- ✅ JWT con access y refresh tokens
- ✅ Blacklist Redis
- ✅ Rate limiting
- ✅ 6 endpoints funcionales
- ✅ Dockerfile creado

#### 💳 Pilar 2: Payment Service (20%)
- ✅ Patrón Adapter implementado
- ✅ Stripe y Mock adapters
- ✅ Sistema de Partners B2B
- ✅ Webhooks HMAC-SHA256
- ✅ 5 endpoints funcionales
- ✅ Dockerfile creado

#### 🤖 Pilar 3: AI Orchestrator (20%)
- ✅ Patrón Strategy implementado
- ✅ 3 LLM adapters (Gemini, OpenAI, Mock)
- ✅ 5 MCP Tools funcionales
- ✅ Procesamiento multimodal (texto, imagen, PDF)
- ✅ Dockerfile creado

#### 🔄 Pilar 4: n8n Event Bus (15%)
- ✅ 4 workflows completos
  - Payment Handler
  - Partner Handler
  - MCP Input Handler
  - Scheduled Tasks
- ✅ Documentación completa

#### 🎨 Frontend Angular
- ✅ ChatComponent (AI)
- ✅ PaymentComponent (Pagos)
- ✅ Rutas configuradas
- ✅ Environment actualizado

#### 📦 Infraestructura
- ✅ Docker Compose completo
- ✅ Script PowerShell de inicio
- ✅ README principal
- ✅ Documentación por servicio

---

## 🚀 Instrucciones de Inicio

### Opción 1: Script PowerShell (RECOMENDADO)

```powershell
# Desde la carpeta UNIFIT
.\start-all-extended.ps1
```

Este script:
1. Verifica PostgreSQL (Neon Cloud)
2. Inicia Redis si está disponible
3. Levanta los 4 pilares nuevos
4. Levanta servicios base (REST, GraphQL, WebSocket)
5. Inicia el frontend Angular
6. Muestra resumen con URLs

### Opción 2: Docker Compose

```powershell
# Desde la carpeta UNIFIT
docker-compose up -d
```

Esto levanta TODOS los servicios en contenedores.

### Opción 3: Manual (Desarrollo)

```powershell
# Terminal 1: Auth Service
cd auth-service
npm install  # Solo la primera vez
npm run start:dev

# Terminal 2: Payment Service
cd payment-service
npm install  # Solo la primera vez
npm run start:dev

# Terminal 3: AI Orchestrator
cd ai-orchestrator
pip install -r requirements.txt  # Solo la primera vez
python main.py

# Terminal 4: REST API
cd RestGolang
go run main.go

# Terminal 5: GraphQL
cd graphql
npm install  # Solo la primera vez
npm run start:dev

# Terminal 6: WebSocket
cd websocket-server
pip install -r requirements.txt  # Solo la primera vez
python server.py

# Terminal 7: Frontend
cd gym-uleam
npm install  # Solo la primera vez
ng serve

# Terminal 8: n8n
npx n8n
```

---

## 🧪 Pruebas Rápidas

### 1. Probar Auth Service (Puerto 3001)

```powershell
# Registrar usuario
Invoke-RestMethod -Method POST -Uri "http://localhost:3001/auth/register" -Body (@{
    email="test@unifit.com"
    password="Test1234!"
    nombre="Usuario Test"
    tipo="USUARIO_FINAL"
} | ConvertTo-Json) -ContentType "application/json"

# Login
$response = Invoke-RestMethod -Method POST -Uri "http://localhost:3001/auth/login" -Body (@{
    email="test@unifit.com"
    password="Test1234!"
} | ConvertTo-Json) -ContentType "application/json"

# Guardar token
$token = $response.accessToken
Write-Host "Access Token: $token"
```

### 2. Probar Payment Service (Puerto 3002)

```powershell
# Crear pago con Mock adapter
Invoke-RestMethod -Method POST -Uri "http://localhost:3002/payments" -Body (@{
    amount=5000
    currency="USD"
    description="Mensualidad UNIFIT"
    userId="user_123"
    provider="mock"
} | ConvertTo-Json) -ContentType "application/json"

# Registrar Partner B2B
Invoke-RestMethod -Method POST -Uri "http://localhost:3002/partners/register" -Body (@{
    name="Partner Test"
    webhookUrl="https://partner.com/webhook"
    subscribedEvents=@("payment.succeeded", "payment.failed")
} | ConvertTo-Json) -ContentType "application/json"
```

### 3. Probar AI Orchestrator (Puerto 3003)

```powershell
# Chat simple
Invoke-RestMethod -Method POST -Uri "http://localhost:3003/chat" -Body (@{
    message="¿Cuántas reservas tengo hoy?"
    userId="user_123"
} | ConvertTo-Json) -ContentType "application/json"

# Listar herramientas MCP
Invoke-RestMethod -Method GET -Uri "http://localhost:3003/tools"
```

### 4. Probar Frontend

Navega a:
- http://localhost:4200 - Inicio
- http://localhost:4200/chat - Asistente AI
- http://localhost:4200/payment - Procesar Pagos

### 5. Probar n8n

Navega a:
- http://localhost:5678
- Usuario: `admin`
- Contraseña: `unifit2026`

Importa workflows desde `n8n-workflows/`

---

## 📊 URLs de Todos los Servicios

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Frontend** | http://localhost:4200 | Interfaz principal |
| **Auth Service** | http://localhost:3001 | Autenticación JWT |
| **REST API** | http://localhost:3000 | API REST Golang |
| **Payment Service** | http://localhost:3002 | Pasarelas de pago |
| **AI Orchestrator** | http://localhost:3003 | Chatbot AI + MCP |
| **GraphQL** | http://localhost:4000/graphql | API GraphQL |
| **n8n** | http://localhost:5678 | Event Bus |
| **WebSocket** | ws://localhost:8080 | Tiempo real |

---

## 🔧 Solución de Problemas

### Error: "Cannot find module '@nestjs/typeorm'"
**Solución:** Reiniciar VS Code después de `npm install` en auth-service y payment-service

### Error: "Redis connection failed"
**Solución:** 
```powershell
# Instalar Redis (Windows)
# Opción 1: Docker
docker run -d -p 6379:6379 redis:7

# Opción 2: WSL
wsl -d Ubuntu redis-server

# Opción 3: Memurai (Windows native)
# Descargar de https://www.memurai.com/
```

### Error: Tesseract not found (OCR)
**Solución:**
```powershell
# Descargar e instalar Tesseract OCR
# https://github.com/UB-Mannheim/tesseract/wiki
# Agregar a PATH: C:\Program Files\Tesseract-OCR
```

### Error: Puerto ya en uso
**Solución:**
```powershell
# Ver proceso usando puerto 3001
Get-NetTCPConnection -LocalPort 3001

# Matar proceso
Stop-Process -Id <PID> -Force
```

---

## 📚 Documentación Detallada

- [README Principal](./README.md) - Arquitectura completa
- [Auth Service](./auth-service/README.md) - Endpoints, ejemplos
- [Payment Service](./payment-service/README.md) - Adapters, webhooks
- [AI Orchestrator](./ai-orchestrator/README.md) - MCP Tools, multimodal
- [n8n Workflows](./n8n-workflows/README.md) - Workflows, configuración

---

## 🎓 Evaluación - Checklist

### Pilar 1: Auth Service (15%)
- [x] Servicio independiente NestJS
- [x] JWT access + refresh tokens
- [x] Validación local (sin consultas constantes)
- [x] Base de datos propia
- [x] Rate limiting
- [x] Blacklist Redis
- [x] 6 endpoints funcionales
- [x] README completo

### Pilar 2: Payment Service (20%)
- [x] Patrón Adapter implementado
- [x] 2+ adapters (Stripe, Mock)
- [x] Normalización de webhooks
- [x] Sistema Partners B2B
- [x] HMAC signature verification
- [x] Webhooks bidireccionales
- [x] README completo

### Pilar 3: AI Orchestrator (20%)
- [x] Patrón Strategy para LLMs
- [x] 3 adapters (Gemini, OpenAI, Mock)
- [x] MCP Server con 5+ tools
- [x] Procesamiento multimodal
- [x] OCR para imágenes
- [x] PDFs parsing
- [x] README completo

### Pilar 4: n8n Event Bus (15%)
- [x] "Todo evento externo pasa por n8n"
- [x] 4+ workflows implementados
- [x] Payment Handler
- [x] Partner Handler
- [x] MCP Input Handler
- [x] Scheduled Tasks
- [x] README completo

### Infraestructura y Documentación (30%)
- [x] Docker Compose funcional
- [x] Dockerfiles optimizados
- [x] README principal completo
- [x] Diagramas de arquitectura
- [x] Instrucciones de instalación claras
- [x] Ejemplos de testing
- [x] Frontend integrado
- [x] Script de inicio automático

**TOTAL: 100% Implementado**

---

## 🏆 Logros Técnicos

1. ✅ **Microservicios Puros**: Cada pilar es independiente
2. ✅ **Patrones de Diseño**: Adapter y Strategy correctamente implementados
3. ✅ **Seguridad**: JWT, HMAC, Rate Limiting, Blacklist
4. ✅ **Escalabilidad**: Docker Compose con health checks
5. ✅ **Integración**: 8 servicios comunicándose correctamente
6. ✅ **Frontend Moderno**: Angular 20 con componentes standalone
7. ✅ **Documentación**: README por cada servicio + principal
8. ✅ **Testing**: Ejemplos cURL y PowerShell

---

## 📧 Contacto

**Proyecto:** UNIFIT - Sistema de Gestión de Gimnasio  
**Asignatura:** Aplicaciones y Servicios Web  
**Institución:** Universidad Laica Eloy Alfaro de Manabí  
**Período:** Segundo Parcial 2026  

---

¡Proyecto completo y listo para evaluación! 🎉
