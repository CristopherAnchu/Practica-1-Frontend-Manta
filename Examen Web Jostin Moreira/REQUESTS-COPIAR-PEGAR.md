# 📋 Copiar/Pegar - Requests Thunder Client

## 🎯 Test 1: Crear Producto

**URL:** `POST http://localhost:3000/api/products`

**Body (copiar todo):**
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

---

## 🎯 Test 2: Actualizar Producto

**URL:** `PATCH http://localhost:3000/api/products/{PEGAR_ID_AQUI}`

**Body:**
```json
{
  "basePrice": 29.99,
  "description": "Camiseta premium con diseño personalizable - ACTUALIZADA"
}
```

---

## 🎯 Test 3: Crear Variación (Talla M)

**URL:** `POST http://localhost:3000/api/variations`

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

## 🎯 Test 4: Crear Variación (Talla L)

**URL:** `POST http://localhost:3000/api/variations`

**Body:**
```json
{
  "productId": "{PEGAR_PRODUCT_ID_AQUI}",
  "type": "size",
  "name": "Talla L",
  "priceModifier": 2.00,
  "stock": 50,
  "isAvailable": true
}
```

---

## 🎯 Test 5: Crear Personalización

**URL:** `POST http://localhost:3000/api/customizations`

**Body:**
```json
{
  "productId": "{PEGAR_PRODUCT_ID_AQUI}",
  "type": "text",
  "name": "Texto personalizado",
  "description": "Agregar nombre o frase en la camiseta",
  "priceModifier": 5.00,
  "isAvailable": true,
  "options": {
    "maxLength": 20,
    "colors": ["negro", "blanco", "rojo"]
  }
}
```

---

## 🎯 Test 6: Crear Orden Completa

**URL:** `POST http://localhost:3000/api/orders`

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
      "customizationData": {
        "text": "JUAN PÉREZ",
        "color": "negro"
      },
      "customizationTotal": 5.00,
      "itemTotal": 69.98
    }
  ],
  "subtotal": 69.98,
  "tax": 10.50,
  "shippingCost": 5.00,
  "discount": 5.00,
  "total": 80.48,
  "status": "pending",
  "shippingAddress": {
    "street": "Calle Mayor 123",
    "city": "Madrid",
    "state": "Madrid",
    "postalCode": "28001",
    "country": "España"
  },
  "paymentMethod": "credit_card",
  "notes": "Entrega antes de las 18:00"
}
```

---

## 🎯 Test 7: Actualizar Estado de Orden → PAID

**URL:** `PATCH http://localhost:3000/api/orders/{PEGAR_ORDER_ID_AQUI}/status`

**Body:**
```json
{
  "status": "paid"
}
```

---

## 🎯 Test 8: Actualizar Estado de Orden → PROCESSING

**URL:** `PATCH http://localhost:3000/api/orders/{PEGAR_ORDER_ID_AQUI}/status`

**Body:**
```json
{
  "status": "processing"
}
```

---

## 🎯 Test 9: Actualizar Estado de Orden → SHIPPED

**URL:** `PATCH http://localhost:3000/api/orders/{PEGAR_ORDER_ID_AQUI}/status`

**Body:**
```json
{
  "status": "shipped"
}
```

---

## 🎯 Test 10: Webhook Directo - Prueba 1

**URL:** `POST http://localhost:3000/api/webhook/notificaciones`

**Body:**
```json
{
  "id": "test-123",
  "entity": "test",
  "operation": "create",
  "data": {
    "message": "Esto es una prueba directa del webhook",
    "timestamp": "2025-11-25T20:00:00.000Z"
  },
  "timestamp": "2025-11-25T20:00:00.000Z"
}
```

---

## 🎯 Test 11: Webhook Directo - Notificación de Stock Bajo

**URL:** `POST http://localhost:3000/api/webhook/notificaciones`

**Body:**
```json
{
  "id": "stock-alert-001",
  "entity": "inventory",
  "operation": "update",
  "data": {
    "productId": "abc-123",
    "productName": "Camiseta Personalizada",
    "variation": "Talla M",
    "currentStock": 5,
    "threshold": 10,
    "alert": "Stock bajo"
  },
  "timestamp": "2025-11-25T20:05:00.000Z"
}
```

---

## 🎯 Test 12: Webhook Directo - Pago Recibido

**URL:** `POST http://localhost:3000/api/webhook/notificaciones`

**Body:**
```json
{
  "id": "payment-789",
  "entity": "payment",
  "operation": "create",
  "data": {
    "orderId": "ORD-123",
    "amount": 80.48,
    "currency": "EUR",
    "method": "credit_card",
    "status": "approved",
    "transactionId": "TXN-456789"
  },
  "timestamp": "2025-11-25T20:10:00.000Z"
}
```

---

## 📊 Tests GET (No generan notificaciones)

### Listar Productos
```
GET http://localhost:3000/api/products
```

### Ver Producto por ID
```
GET http://localhost:3000/api/products/{PRODUCT_ID}
```

### Productos por Categoría
```
GET http://localhost:3000/api/products/category/ropa
```

### Listar Variaciones
```
GET http://localhost:3000/api/variations
```

### Variaciones de un Producto
```
GET http://localhost:3000/api/variations/product/{PRODUCT_ID}
```

### Listar Órdenes
```
GET http://localhost:3000/api/orders
```

### Órdenes por Usuario
```
GET http://localhost:3000/api/orders/user/user-123
```

### Órdenes por Estado
```
GET http://localhost:3000/api/orders/status?status=pending
```

---

## 🎨 Productos de Ejemplo Variados

### Producto 2: Taza Personalizada
```json
{
  "name": "Taza Cerámica Premium",
  "description": "Taza de cerámica blanca para personalizar",
  "category": "hogar",
  "basePrice": 12.99,
  "imageUrl": "https://example.com/mug.jpg",
  "isActive": true
}
```

### Producto 3: Gorra Deportiva
```json
{
  "name": "Gorra Deportiva Bordada",
  "description": "Gorra ajustable con bordado personalizado",
  "category": "accesorios",
  "basePrice": 18.50,
  "imageUrl": "https://example.com/cap.jpg",
  "isActive": true
}
```

### Producto 4: Mouse Pad
```json
{
  "name": "Mouse Pad Gaming",
  "description": "Mouse pad con diseño personalizable",
  "category": "tecnologia",
  "basePrice": 9.99,
  "imageUrl": "https://example.com/mousepad.jpg",
  "isActive": true
}
```

---

## 🚀 Secuencia Rápida (5 minutos)

**1. Crear Producto → Copiar ID**
**2. Crear 2 Variaciones → Usar Product ID**
**3. Crear Orden → Ver notificaciones**
**4. Cambiar Estado 3 veces → Ver updates en tiempo real**
**5. Test Webhook Directo → Confirmar funcionamiento**

---

## 💾 Header Común (Agregar en todos los POST/PATCH)

```
Content-Type: application/json
```

---

## 🎯 Estados Válidos para Órdenes

```
- pending      (Pendiente)
- paid         (Pagada)
- processing   (En proceso)
- shipped      (Enviada)
- delivered    (Entregada)
- cancelled    (Cancelada)
```

---

## 🎨 Categorías Válidas para Productos

```
- ropa
- hogar
- accesorios
- tecnologia
- otros
```

---

## 🔥 Tip: Guardar Requests en Thunder Client FREE

Después de crear cada request:

1. Click en **"Save"** (esquina superior derecha)
2. Nombre sugerido: `Test 1 - Crear Producto`
3. Se guarda en **"Requests"** (sidebar)
4. ✅ Reutilizable siempre sin necesidad de collection

---

## 📝 Plantilla Vacía para Copiar

```json
{
  
}
```

---

¡Copia y pega directamente en Thunder Client! 🚀
