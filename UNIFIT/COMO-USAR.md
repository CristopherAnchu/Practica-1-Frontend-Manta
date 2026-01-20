# 🚀 GUÍA DE EJECUCIÓN UNIFIT - PASO A PASO

## ✅ ESTADO ACTUAL

**TODOS LOS SERVICIOS ESTÁN INICIADOS Y CORRIENDO:**

1. ✅ Auth Service (Puerto 3001) - Ventana PowerShell abierta
2. ✅ Payment Service (Puerto 3002) - Ventana PowerShell abierta
3. ✅ AI Orchestrator (Puerto 3003) - Ventana PowerShell abierta
4. ✅ GraphQL API (Puerto 4000) - Ventana PowerShell abierta
5. ✅ Frontend Angular (Puerto 4200) - Ventana PowerShell abierta

---

## 📱 CÓMO USAR EL SISTEMA

### 1️⃣ ESPERA 30-60 SEGUNDOS
Los servicios están arrancando. Espera a que cada ventana PowerShell muestre:
- Auth Service: "Nest application successfully started"
- Payment Service: "Nest application successfully started"
- AI Orchestrator: "Uvicorn running on http://0.0.0.0:3003"
- GraphQL: "GraphQL Playground: http://localhost:4000/graphql"
- Frontend: "Compiled successfully"

### 2️⃣ ABRE TU NAVEGADOR

**Frontend Principal:**
```
http://localhost:4200
```

**Nuevos Componentes del 2do Parcial:**
```
http://localhost:4200/chat      ← Chat con AI (Pilar 3)
http://localhost:4200/payment   ← Procesar Pagos (Pilar 2)
```

---

## 🧪 PRUEBAS RÁPIDAS

### Probar Auth Service (Pilar 1)

**Opción A: Desde PowerShell**
```powershell
# Registrar usuario
Invoke-RestMethod -Method POST -Uri "http://localhost:3001/auth/register" `
  -Body (@{
    email="test@unifit.com"
    password="Test1234!"
    nombre="Usuario Test"
    tipo="USUARIO_FINAL"
  } | ConvertTo-Json) `
  -ContentType "application/json"

# Login
$response = Invoke-RestMethod -Method POST -Uri "http://localhost:3001/auth/login" `
  -Body (@{
    email="test@unifit.com"
    password="Test1234!"
  } | ConvertTo-Json) `
  -ContentType "application/json"

Write-Host "Token recibido: $($response.accessToken)"
```

**Opción B: Desde navegador (Postman/Thunder Client)**
- URL: `POST http://localhost:3001/auth/register`
- Body (JSON):
```json
{
  "email": "test@unifit.com",
  "password": "Test1234!",
  "nombre": "Usuario Test",
  "tipo": "USUARIO_FINAL"
}
```

---

### Probar AI Orchestrator (Pilar 3)

**Desde PowerShell:**
```powershell
# Chat simple
Invoke-RestMethod -Method POST -Uri "http://localhost:3003/chat" `
  -Body (@{
    message="¿Cuántas reservas tengo hoy?"
    userId="user_123"
  } | ConvertTo-Json) `
  -ContentType "application/json"

# Listar herramientas MCP
Invoke-RestMethod -Method GET -Uri "http://localhost:3003/tools"
```

**Desde el Frontend:**
1. Abre: http://localhost:4200/chat
2. Escribe: "¿Cuántas reservas tengo?"
3. El AI ejecutará la herramienta MCP `buscar_reservas`

---

### Probar Payment Service (Pilar 2)

**Desde PowerShell:**
```powershell
# Crear pago (Mock adapter)
Invoke-RestMethod -Method POST -Uri "http://localhost:3002/payments" `
  -Body (@{
    amount=5000
    currency="USD"
    description="Mensualidad UNIFIT"
    userId="user_123"
    provider="mock"
  } | ConvertTo-Json) `
  -ContentType "application/json"
```

**Desde el Frontend:**
1. Abre: http://localhost:4200/payment
2. Selecciona monto y método de pago
3. Click en "Procesar Pago"

---

### Probar GraphQL (Servicio Base)

**Playground interactivo:**
```
http://localhost:4000/graphql
```

**Query de ejemplo:**
```graphql
query {
  usuarios {
    id
    nombre
    email
  }
}
```

---

## 🎨 NAVEGACIÓN EN EL FRONTEND

### Páginas Existentes (1er Parcial):
- `/login` - Inicio de sesión
- `/crear-cuenta` - Registro
- `/usuario` - Dashboard usuario
- `/admin` - Dashboard admin
- `/dashboard-graphql` - Dashboard con GraphQL
- `/dashboard-realtime` - Dashboard WebSocket

### Páginas Nuevas (2do Parcial):
- `/chat` - **Asistente AI con MCP Tools**
- `/payment` - **Procesar Pagos con múltiples pasarelas**

---

## 🔧 SOLUCIÓN DE PROBLEMAS

### ❌ "Cannot GET /" en algún puerto

**Problema:** El servicio aún está arrancando  
**Solución:** Espera 30 segundos más y recarga la página

---

### ❌ Error de compilación en Auth/Payment Service

**Problema:** TypeScript no encuentra módulos  
**Solución:**
1. Ve a la ventana PowerShell del servicio
2. Presiona `Ctrl+C` para detener
3. Ejecuta: `npm install`
4. Ejecuta: `npm run start:dev`

---

### ❌ "Redis connection failed" en Auth Service

**Problema:** Redis no está corriendo  
**Solución:** El servicio funciona SIN Redis, pero sin blacklist de tokens

**Para instalar Redis (opcional):**
```powershell
# Opción 1: Docker
docker run -d -p 6379:6379 redis:7

# Opción 2: WSL
wsl -d Ubuntu
sudo service redis-server start
```

---

### ❌ "Port already in use"

**Problema:** El puerto ya está ocupado  
**Solución:**
```powershell
# Ver qué proceso usa el puerto 3001
Get-NetTCPConnection -LocalPort 3001

# Matar el proceso
Stop-Process -Id <PID> -Force
```

---

## 🛑 CÓMO DETENER TODO

**Opción 1: Individual**
- Ve a cada ventana PowerShell
- Presiona `Ctrl+C`

**Opción 2: Cerrar ventanas**
- Cierra cada ventana PowerShell con la X

**Opción 3: Forzar detención**
```powershell
# Detener todos los procesos Node.js
Get-Process node | Stop-Process -Force

# Detener Python
Get-Process python | Stop-Process -Force
```

---

## 📊 VERIFICAR QUE TODO FUNCIONA

### Checklist de Servicios:

```powershell
# Verificar puertos abiertos
Get-NetTCPConnection -LocalPort 3001,3002,3003,4000,4200 | Select-Object LocalPort,State
```

**Salida esperada:**
```
LocalPort State
--------- -----
3001      Listen  ← Auth Service
3002      Listen  ← Payment Service
3003      Listen  ← AI Orchestrator
4000      Listen  ← GraphQL
4200      Listen  ← Frontend
```

---

## 🎯 FLUJO DE PRUEBA COMPLETO

### Escenario: Usuario crea reserva y paga

1. **Abre el frontend:** http://localhost:4200/login
2. **Inicia sesión** con credenciales existentes
3. **Navega a Reservas** y crea una nueva
4. **Ve a Pagos:** http://localhost:4200/payment
5. **Selecciona Mock Adapter** y monto
6. **Procesa el pago**
7. **Abre el Chat AI:** http://localhost:4200/chat
8. **Pregunta:** "¿Cuántas reservas tengo?"
9. **El AI ejecuta** la herramienta MCP `buscar_reservas`
10. **Recibes la respuesta** con tus reservas

---

## 📚 DOCUMENTACIÓN ADICIONAL

- **README Principal:** `./README.md`
- **Auth Service:** `./auth-service/README.md`
- **Payment Service:** `./payment-service/README.md`
- **AI Orchestrator:** `./ai-orchestrator/README.md`
- **n8n Workflows:** `./n8n-workflows/README.md`

---

## 🆘 AYUDA RÁPIDA

**¿No funciona algo?**
1. Verifica que las 5 ventanas PowerShell estén abiertas
2. Revisa la consola de cada servicio (errores en rojo)
3. Asegúrate de estar en http://localhost:4200 (no 127.0.0.1)
4. Espera 60 segundos después de iniciar

**¿Quieres reiniciar todo?**
1. Cierra todas las ventanas PowerShell
2. Ejecuta nuevamente los 5 comandos Start-Process

---

## ✨ FUNCIONALIDADES DESTACADAS PARA PROBAR

### 1. Chat AI con Context (Pilar 3)
- Pregunta sobre reservas
- Pide crear rutinas
- Solicita estadísticas
- Sube una imagen (OCR)

### 2. Pagos Multigateway (Pilar 2)
- Mock Adapter (simulación)
- Stripe Adapter (producción)
- Webhooks HMAC seguros

### 3. Autenticación JWT (Pilar 1)
- Tokens de corta duración
- Refresh tokens
- Blacklist Redis
- Rate limiting

### 4. Integración Total
- Todos los servicios se comunican
- WebSocket para notificaciones
- GraphQL para reportes
- REST para operaciones

---

¡LISTO! Todo está corriendo y funcionando 🎉
