# 🧪 Guía de Pruebas - Thunder Client (Sin Importar)

## 📝 Crear Requests Manualmente en Thunder Client

### 🎯 Test 1: Crear Producto (REST → Webhook → WebSocket)

1. **Abrir Thunder Client** en VS Code
2. Click en **"New Request"**
3. **Configurar:**

```
Method: POST
URL: http://localhost:3000/api/products
```

4. **Headers** (pestaña Headers):
```
Content-Type: application/json
```

5. **Body** (pestaña Body → JSON):
```json
{
  "name": "Camiseta Personalizada",
  "description": "Camiseta 100% algodón con diseño personalizable",
  "category": "ropa",
  "basePrice": 25.99,
  "imageUrl": "https://example.com/shirt.jpg",
  "isActive": true
}
```

6. Click en **Send**

**✅ Resultado esperado:**
- Thunder Client: Producto creado con `id`
- Terminal servidor: `✅ Webhook notificado: product - create - {id}`
- Cliente HTML: Notificación aparece instantáneamente

---

### 🎯 Test 2: Actualizar Producto

**IMPORTANTE:** Copia el `id` del producto creado en Test 1

```
Method: PATCH
URL: http://localhost:3000/api/products/{PEGAR_ID_AQUI}
```

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "basePrice": 29.99,
  "description": "Camiseta premium - ACTUALIZADA"
}
```

---

### 🎯 Test 3: Crear Variación

**IMPORTANTE:** Usa el `id` del producto del Test 1

```
Method: POST
URL: http://localhost:3000/api/variations
```

**Body:**
```json
{
  "productId": "{PEGAR_PRODUCT_ID_AQUI}",
  "type": "size",
  "name": "Talla M",
  "priceModifier": 0,
  "stock": 100,
  "isAvailable": true
}
```

---

### 🎯 Test 4: Crear Orden

```
Method: POST
URL: http://localhost:3000/api/orders
```

**Body:**
```json
{
  "userId": "user-123",
  "items": [
    {
      "productId": "cualquier-id",
      "variationId": "cualquier-id",
      "quantity": 2,
      "unitPrice": 29.99,
      "customizationData": { "text": "Mi nombre" },
      "customizationTotal": 5.00,
      "itemTotal": 64.98
    }
  ],
  "subtotal": 64.98,
  "tax": 9.75,
  "shippingCost": 5.00,
  "discount": 0,
  "total": 79.73,
  "status": "pending",
  "shippingAddress": {
    "street": "Calle Principal 123",
    "city": "Madrid",
    "state": "Madrid",
    "postalCode": "28001",
    "country": "España"
  },
  "paymentMethod": "credit_card"
}
```

---

### 🎯 Test 5: Actualizar Estado de Orden

**IMPORTANTE:** Usa el `id` de la orden del Test 4

```
Method: PATCH
URL: http://localhost:3000/api/orders/{PEGAR_ORDER_ID_AQUI}/status
```

**Body:**
```json
{
  "status": "paid"
}
```

---

### 🎯 Test 6: Webhook Directo (Sin pasar por REST)

```
Method: POST
URL: http://localhost:3000/api/webhook/notificaciones
```

**Body:**
```json
{
  "id": "test-123",
  "entity": "test",
  "operation": "create",
  "data": {
    "message": "Esto es una prueba directa del webhook",
    "timestamp": "2025-11-25T19:00:00.000Z"
  },
  "timestamp": "2025-11-25T19:00:00.000Z"
}
```

**✅ Resultado esperado:**
- Thunder Client: `{ "success": true, "message": "Notificación enviada" }`
- Cliente HTML: Notificación aparece inmediatamente

---

## 🔥 Flujo de Prueba Recomendado

### Preparación:
1. ✅ Servidor corriendo: `npm run start:prod` en `rest/`
2. ✅ Cliente HTML abierto: `websocket-client.html` en navegador
3. ✅ Thunder Client abierto en VS Code

### Secuencia de Tests:
```
Test 1: Crear Producto
  ↓ (copiar id del producto)
Test 2: Actualizar Producto
  ↓
Test 3: Crear Variación (usar productId)
  ↓
Test 4: Crear Orden
  ↓ (copiar id de la orden)
Test 5: Actualizar Estado de Orden
  ↓
Test 6: Webhook Directo (prueba independiente)
```

---

## 📊 Qué Observar

### En Thunder Client:
```json
{
  "id": "uuid-generado",
  "name": "Camiseta Personalizada",
  "basePrice": 25.99,
  "createdAt": "2025-11-25T19:45:00.000Z"
}
```

### En Terminal del Servidor:
```
✅ Webhook notificado: product - create - abc-123
```

### En Cliente HTML:
```
📨 Notificaciones Recibidas
┌─────────────────────────────────────┐
│ product  ✨ CREADO     19:45:23    │
│ ID: abc-123                          │
│ {                                    │
│   "id": "abc-123",                   │
│   "name": "Camiseta Personalizada", │
│   "basePrice": 25.99                 │
│ }                                    │
└─────────────────────────────────────┘

Estadísticas:
Total: 1   Creaciones: 1   Actualizaciones: 0
```

---

## 🐛 Solución de Problemas

### ❌ Error 404 - Cannot POST /api/products
**Solución:** Servidor no está corriendo
```bash
cd rest
npm run start:prod
```

---

### ❌ Error 400 - Validation failed
**Solución:** Verifica que el JSON esté completo
- Todos los campos requeridos presentes
- `productId` válido para variaciones
- JSON bien formado (sin comas extras)

---

### ❌ Cliente HTML no recibe notificaciones
**Solución:** 
1. Abre consola del navegador (F12)
2. Debe ver: `✅ Conectado al WebSocket`
3. Si no, recarga la página

---

### ❌ Error: FOREIGN KEY constraint failed
**Solución:**
- Crea el producto PRIMERO
- Luego crea variaciones usando el `productId` del producto creado

---

## 🎬 Video Tutorial (Paso a Paso)

### 1. Abrir Cliente HTML
- Navegar a: `C:\Users\Laptop\Desktop\Examen Web`
- Doble click en `websocket-client.html`
- Debe mostrar "● CONECTADO"

### 2. Crear Request en Thunder Client
- VS Code → Extensión Thunder Client (ícono rayo ⚡)
- Click en "New Request"
- Seleccionar método: POST
- Pegar URL: `http://localhost:3000/api/products`

### 3. Agregar Headers
- Click en pestaña "Headers"
- Click en "Add Header"
- Name: `Content-Type`
- Value: `application/json`

### 4. Agregar Body
- Click en pestaña "Body"
- Seleccionar "JSON"
- Pegar el JSON del producto

### 5. Enviar Request
- Click en botón "Send" (azul)
- Ver respuesta abajo
- Copiar el `id` de la respuesta

### 6. Ver Notificación en HTML
- Cambiar a ventana del navegador
- Ver notificación aparecer con animación
- Estadísticas se actualizan automáticamente

---

## 💡 Tips para Thunder Client FREE

### Guardar Requests (Sin Collections):
1. Después de crear request, click en "Save"
2. Dar nombre descriptivo: "Crear Producto - WebSocket Test"
3. Aparecerá en "Requests" (sidebar izquierdo)
4. Reutilizable sin pagar

### Usar Variables de Entorno:
1. Click en icono engranaje ⚙️
2. "Env" → "New Environment"
3. Agregar:
```
baseUrl: http://localhost:3000/api
productId: (dejar vacío, copiar después)
```

4. En requests usar:
```
URL: {{baseUrl}}/products
Body: "productId": "{{productId}}"
```

### Copiar/Pegar IDs:
1. Después de crear producto, copiar `id` de respuesta
2. Pegar directamente en siguiente request
3. No requiere variables de entorno

---

## 🚀 Atajos de Thunder Client

| Acción | Atajo |
|--------|-------|
| Nuevo Request | `Ctrl+Alt+N` |
| Enviar Request | `Ctrl+Alt+Enter` |
| Ver History | Click en "History" (sidebar) |
| Repetir Último | Seleccionar en History |

---

## 📋 Checklist Pre-Test

Antes de empezar las pruebas:

- [ ] Servidor corriendo en terminal
- [ ] Puerto 3000 libre
- [ ] Cliente HTML abierto en navegador
- [ ] Cliente HTML muestra "CONECTADO"
- [ ] Thunder Client abierto en VS Code
- [ ] Terminal del servidor visible (para ver logs)

---

## 🎯 Prueba Rápida (2 minutos)

### Mínimo Test Funcional:

**1. Test Webhook Directo:**
```
POST http://localhost:3000/api/webhook/notificaciones
{
  "id": "test-1",
  "entity": "test",
  "operation": "create",
  "data": { "mensaje": "Hola WebSocket!" },
  "timestamp": "2025-11-25T20:00:00.000Z"
}
```

**2. Ver en Cliente HTML:**
- Notificación aparece instantáneamente
- Estadísticas: Total: 1, Creaciones: 1

**✅ Si funciona:** Sistema operativo al 100%

---

## 📞 Endpoints Disponibles

### GET (No generan notificaciones):
```
GET /api/products
GET /api/products/:id
GET /api/variations
GET /api/customizations
GET /api/carts
GET /api/orders
```

### POST (Generan notificaciones WebSocket):
```
POST /api/products          → entity: "product"
POST /api/variations        → entity: "variation"
POST /api/customizations    → entity: "customization"
POST /api/orders            → entity: "order"
POST /api/carts/:id/items   → entity: "cart-item"
```

### PATCH (Generan notificaciones WebSocket):
```
PATCH /api/products/:id            → entity: "product"
PATCH /api/variations/:id          → entity: "variation"
PATCH /api/customizations/:id      → entity: "customization"
PATCH /api/orders/:id/status       → entity: "order-status"
```

---

## 🎉 ¡Listo para Probar!

Sigue los tests en orden, copia los IDs necesarios, y observa las notificaciones en tiempo real en el cliente HTML.

**Recuerda:** Thunder Client FREE permite guardar requests individuales, solo no permite collections/folders. ¡Pero funciona perfectamente para testing!
