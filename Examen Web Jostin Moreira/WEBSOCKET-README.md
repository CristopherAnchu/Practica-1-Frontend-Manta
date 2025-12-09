# 🔔 Sistema de Notificaciones en Tiempo Real - WebSocket

## 📋 Arquitectura Implementada

```
REST API → Webhook → WebSocketGateway → Cliente
```

### ✅ Características Implementadas

1. **Separación de responsabilidades**: REST NO se comunica directamente con WebSocketGateway
2. **Webhook intermediario**: Endpoint `POST /api/webhook/notificaciones` 
3. **Emisión global**: Sin rooms, todos los clientes conectados reciben todas las notificaciones
4. **Socket.io configurado**: Sin desconexiones (pingTimeout: 60s, pingInterval: 25s)
5. **Integración completa**: Todas las operaciones POST/PUT notifican automáticamente

---

## 🚀 Cómo Probar el Flujo Completo

### Paso 1: Abrir Cliente WebSocket

1. Abre el archivo `websocket-client.html` en tu navegador
2. Verás el estado **"● CONECTADO"** en verde
3. El dashboard mostrará estadísticas en tiempo real

**URL del cliente HTML:**
```
file:///c:/Users/Laptop/Desktop/Examen%20Web/websocket-client.html
```

---

### Paso 2: Importar Colección Thunder Client

1. En VS Code, abre la extensión **Thunder Client**
2. Click en **Collections** → **⋮** → **Import**
3. Selecciona: `thunder-collection-websocket.json`
4. Verás 4 carpetas con 9 requests pre-configurados

---

### Paso 3: Probar Flujo REST → Webhook → WebSocket

#### 🧪 Test 1: Crear Producto

**Thunder Client:**
```http
POST http://localhost:3000/api/products
Content-Type: application/json

{
  "name": "Camiseta Personalizada",
  "description": "Camiseta 100% algodón",
  "category": "ropa",
  "basePrice": 25.99,
  "imageUrl": "https://example.com/shirt.jpg",
  "isActive": true
}
```

**Resultado esperado:**
1. REST responde con el producto creado
2. Consola del servidor muestra: `✅ Webhook notificado: product - create - {id}`
3. Cliente WebSocket recibe notificación instantánea:
   ```json
   {
     "id": "uuid-del-producto",
     "entity": "product",
     "operation": "create",
     "data": { ...producto completo... },
     "timestamp": "2025-11-25T19:41:50.000Z"
   }
   ```

---

#### 🧪 Test 2: Actualizar Producto

**Thunder Client:**
```http
PATCH http://localhost:3000/api/products/{productId}
Content-Type: application/json

{
  "basePrice": 29.99,
  "description": "Camiseta premium - ACTUALIZADA"
}
```

**Resultado esperado:**
- Notificación WebSocket con `operation: "update"`
- Estadísticas del dashboard actualizadas

---

#### 🧪 Test 3: Crear Variación

**Thunder Client:**
```http
POST http://localhost:3000/api/variations
Content-Type: application/json

{
  "productId": "{productId}",
  "type": "size",
  "name": "Talla M",
  "priceModifier": 0,
  "stock": 100,
  "isAvailable": true
}
```

**Resultado esperado:**
- Notificación WebSocket: `entity: "variation"`, `operation: "create"`

---

#### 🧪 Test 4: Crear Orden

**Thunder Client:**
```http
POST http://localhost:3000/api/orders
Content-Type: application/json

{
  "userId": "user-123",
  "items": [...],
  "subtotal": 64.98,
  "tax": 9.75,
  "shippingCost": 5.00,
  "total": 79.73,
  "status": "pending",
  "shippingAddress": {...},
  "paymentMethod": "credit_card"
}
```

**Resultado esperado:**
- Notificación WebSocket: `entity: "order"`, `operation: "create"`

---

#### 🧪 Test 5: Actualizar Estado de Orden

**Thunder Client:**
```http
PATCH http://localhost:3000/api/orders/{orderId}/status
Content-Type: application/json

{
  "status": "paid"
}
```

**Resultado esperado:**
- Notificación WebSocket: `entity: "order-status"`, `operation: "update"`

---

#### 🧪 Test 6: Webhook Directo (Sin pasar por REST)

**Thunder Client:**
```http
POST http://localhost:3000/api/webhook/notificaciones
Content-Type: application/json

{
  "id": "test-123",
  "entity": "test",
  "operation": "create",
  "data": {
    "message": "Prueba directa del webhook"
  },
  "timestamp": "2025-11-25T19:00:00.000Z"
}
```

**Resultado esperado:**
- Webhook responde: `{ success: true, message: "Notificación enviada", ... }`
- Cliente WebSocket recibe la notificación inmediatamente

---

## 📊 Operaciones que Envían Notificaciones

### ✅ Productos
- `POST /api/products` → `entity: "product"`, `operation: "create"`
- `PATCH /api/products/:id` → `entity: "product"`, `operation: "update"`

### ✅ Variaciones
- `POST /api/variations` → `entity: "variation"`, `operation: "create"`
- `PATCH /api/variations/:id` → `entity: "variation"`, `operation: "update"`

### ✅ Personalizaciones
- `POST /api/customizations` → `entity: "customization"`, `operation: "create"`
- `PATCH /api/customizations/:id` → `entity: "customization"`, `operation: "update"`

### ✅ Carritos
- `POST /api/carts/:id/items` → `entity: "cart-item"`, `operation: "create"`

### ✅ Órdenes
- `POST /api/orders` → `entity: "order"`, `operation: "create"`
- `PATCH /api/orders/:id/status` → `entity: "order-status"`, `operation: "update"`

---

## 🔧 Configuración Socket.io

```typescript
@WebSocketGateway({
  cors: { origin: '*', credentials: true },
  pingTimeout: 60000,    // 60 segundos sin respuesta = desconexión
  pingInterval: 25000,   // Ping cada 25 segundos
  transports: ['websocket', 'polling']
})
```

### ¿Por qué no se desconecta?

1. **pingInterval (25s)**: Servidor envía ping cada 25 segundos
2. **pingTimeout (60s)**: Espera 60 segundos por pong antes de desconectar
3. **transports**: Soporta WebSocket puro + long-polling como fallback
4. **reconnection**: Cliente se reconecta automáticamente si se desconecta

---

## 🎨 Cliente HTML - Características

### Dashboard en Tiempo Real

1. **Estadísticas:**
   - Total de notificaciones recibidas
   - Contador de creaciones
   - Contador de actualizaciones
   - Tiempo conectado

2. **Lista de Notificaciones:**
   - Animación de entrada (slide-in)
   - Color diferenciado por operación
   - Timestamp en formato local
   - JSON formateado del payload completo

3. **Controles:**
   - 🔌 Reconectar: Fuerza reconexión al servidor
   - 🔌 Desconectar: Cierra conexión WebSocket
   - 🗑️ Limpiar: Borra lista de notificaciones

---

## 🐛 Solución de Problemas

### ❌ Cliente no se conecta

**Verifica:**
```bash
# ¿Servidor corriendo?
http://localhost:3000/api

# Consola del navegador (F12) debe mostrar:
✅ Conectado al WebSocket
```

---

### ❌ Notificaciones no llegan

**Verifica en consola del servidor:**
```
✅ Webhook notificado: product - create - {id}
```

Si no aparece, el WebhookService no está siendo llamado.

---

### ❌ Error CORS

**Solución:** Ya está configurado en el gateway con `cors: { origin: '*' }`

---

## 📁 Estructura de Archivos

```
rest/src/
├── websocket/
│   ├── webhook/
│   │   ├── webhook.controller.ts  ← POST /webhook/notificaciones
│   │   └── webhook.service.ts     ← Helper para notificar desde servicios
│   ├── gateway/
│   │   └── notifications.gateway.ts ← Socket.io gateway
│   └── websocket.module.ts        ← Módulo @Global()
├── products/
│   └── products.service.ts        ← Llama a webhookService.notifyCreate/Update
├── variations/
│   └── variations.service.ts      ← Llama a webhookService.notifyCreate/Update
├── customizations/
│   └── customizations.service.ts  ← Llama a webhookService.notifyCreate/Update
├── carts/
│   └── carts.service.ts           ← Llama a webhookService.notifyCreate (addItem)
└── orders/
    └── orders.service.ts          ← Llama a webhookService.notifyCreate/Update

websocket-client.html              ← Cliente HTML para pruebas
thunder-collection-websocket.json  ← Colección Thunder Client
```

---

## 🎯 Próximos Pasos (Opcional)

1. **GraphQL:** Implementar resolvers con subscriptions
2. **Autenticación:** JWT para WebSocket connections
3. **Rooms:** Canales por userId o tipo de entidad
4. **Persistencia:** Guardar notificaciones en DB
5. **Rate Limiting:** Limitar notificaciones por segundo

---

## ✅ Checklist de Validación

- [x] REST API corre en `http://localhost:3000/api`
- [x] WebSocket Gateway inicializado correctamente
- [x] Endpoint webhook responde en `/api/webhook/notificaciones`
- [x] Cliente HTML se conecta sin errores
- [x] POST de productos genera notificación WebSocket
- [x] PATCH de productos genera notificación WebSocket
- [x] Todas las operaciones POST/PUT notifican correctamente
- [x] Cliente muestra notificaciones en tiempo real
- [x] Socket.io configurado para no desconectarse
- [x] Emisión global (no rooms) funciona

---

## 📞 Testing con Thunder Client

### Flujo Recomendado:

1. **Abrir cliente HTML**
2. **Ejecutar en orden:**
   - ✨ Crear Producto
   - ✏️ Actualizar Producto
   - ✨ Crear Variación
   - ✏️ Actualizar Variación
   - ✨ Crear Orden
   - ✏️ Actualizar Estado de Orden
   - 🎯 Webhook Directo

3. **Ver dashboard del cliente HTML actualizarse en tiempo real**

---

## 🎉 ¡Listo para Demostrar!

Tu sistema completo está funcionando:
- ✅ Dominio puro con 6 entidades
- ✅ REST API con 38 endpoints
- ✅ SQLite database
- ✅ Webhook intermediario
- ✅ WebSocket notifications en tiempo real
- ✅ Cliente HTML para visualización

**URL del servidor:** http://localhost:3000/api  
**Cliente WebSocket:** `websocket-client.html`  
**Colección Thunder Client:** `thunder-collection-websocket.json`
