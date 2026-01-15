# 💳 Payment Service - UNIFIT

Microservicio de pagos con patrón Adapter, webhooks bidireccionales y autenticación HMAC.

## 📋 Características

- ✅ Patrón Adapter para múltiples pasarelas de pago
- ✅ Adapters: Stripe, MockAdapter (desarrollo)
- ✅ Normalización de webhooks a formato común
- ✅ Sistema de partners B2B con webhooks bidireccionales
- ✅ Autenticación HMAC-SHA256 para webhooks
- ✅ API Key para partners
- ✅ Registro y gestión de partners

## 🏗️ Arquitectura - Patrón Adapter

```
┌─────────────────────────────────────────────────┐
│         Payment Service Wrapper                │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌───────────────────────────────────────┐    │
│  │   PaymentProvider (Interface)         │    │
│  └───────────────────────────────────────┘    │
│         ▲           ▲            ▲            │
│         │           │            │            │
│    ┌────┴───┐  ┌───┴────┐  ┌───┴──────┐    │
│    │ Stripe │  │  Mock  │  │Mercado   │    │
│    │Adapter │  │Adapter │  │Pago      │    │
│    └────────┘  └────────┘  │Adapter   │    │
│                             └──────────┘    │
└─────────────────────────────────────────────────┘
                    ↓
        Normalización de Webhooks
                    ↓
        Notificación a Partners
```

## 🚀 Instalación

```bash
cd payment-service
npm install
```

## ⚙️ Configuración

```bash
cp .env.example .env
# Editar .env con tus credenciales
```

## 🎯 Ejecución

```bash
npm run start:dev
```

## 📡 Endpoints

### Pagos

#### POST /payments
Crea un nuevo pago

```json
{
  "amount": 5000,
  "currency": "USD",
  "description": "Pago de reserva",
  "customerEmail": "user@example.com",
  "userId": "uuid",
  "reservationId": "uuid",
  "metadata": {
    "reservaId": "123",
    "tipo": "mensualidad"
  }
}
```

#### GET /payments/:id
Obtiene el estado de un pago

#### POST /payments/webhook
Recibe webhooks de la pasarela de pago (Stripe, etc.)

### Partners

#### POST /partners/register
Registra un nuevo partner para webhooks B2B

```json
{
  "name": "Hotel Paradise",
  "webhookUrl": "https://partner.com/webhooks/unifit",
  "subscribedEvents": [
    "payment.succeeded",
    "payment.failed",
    "reservation.confirmed"
  ]
}
```

**Response:**
```json
{
  "message": "Partner registrado exitosamente",
  "partner": {
    "id": "uuid",
    "name": "Hotel Paradise",
    "apiKey": "unifit_abc123...",
    "hmacSecret": "secret_xyz...",
    "webhookUrl": "https://partner.com/webhooks/unifit",
    "subscribedEvents": ["payment.succeeded", ...]
  },
  "instructions": {
    "step1": "Guarda tu apiKey y hmacSecret",
    "step2": "Incluye apiKey en header X-API-Key",
    "step3": "Verifica firma HMAC en webhooks",
    "step4": "HMAC-SHA256(payload, hmacSecret)"
  }
}
```

#### POST /partners/webhook
Recibe webhooks de partners externos

**Headers:**
```
X-API-Key: unifit_abc123...
X-UNIFIT-Signature: hmac_signature
```

**Body:**
```json
{
  "eventType": "tour.purchased",
  "timestamp": "2026-01-11T10:00:00Z",
  "data": {
    "tourId": "tour_123",
    "reservationId": "res_456",
    "userId": "user_789",
    "amount": 150.00
  }
}
```

## 🔐 Autenticación HMAC

### Generar firma (Partner enviando a UNIFIT)

```javascript
const crypto = require('crypto');

const payload = JSON.stringify(event);
const signature = crypto
  .createHmac('sha256', hmacSecret)
  .update(payload)
  .digest('hex');

// Incluir en header X-UNIFIT-Signature
```

### Verificar firma (UNIFIT recibiendo de Partner)

```javascript
const expectedSignature = crypto
  .createHmac('sha256', partner.hmacSecret)
  .update(JSON.stringify(payload))
  .digest('hex');

const isValid = crypto.timingSafeEqual(
  Buffer.from(signature),
  Buffer.from(expectedSignature)
);
```

## 🔄 Flujo de Pago Completo

```
1. Frontend → POST /payments
2. Payment Service → PaymentAdapter.createPaymentIntent()
3. PaymentAdapter → Pasarela (Stripe/Mock)
4. Payment Service → Guarda pago en BD
5. Payment Service → Retorna clientSecret
6. Frontend → Confirma pago con clientSecret
7. Pasarela → POST /payments/webhook (pago exitoso)
8. Payment Service → Normaliza evento
9. Payment Service → Actualiza BD
10. Payment Service → Notifica a partners (webhooks)
11. Partners → Reciben evento y procesan
```

## 🌐 Integración B2B con Otros Grupos

### Coordinación entre grupos:

**Grupo A (UNIFIT - Gimnasio)**
```javascript
// Enviamos evento cuando un usuario paga
POST https://grupo-b.com/webhooks
Headers: 
  X-API-Key: groupb_api_key
  X-UNIFIT-Signature: hmac_signature

Body:
{
  "eventType": "payment.succeeded",
  "data": {
    "userId": "uuid",
    "amount": 50.00,
    "service": "gym_membership"
  }
}
```

**Grupo B (Tours) recibe y responde**
```javascript
// Grupo B ofrece tour relacionado
POST https://unifit.com/partners/webhook
Headers:
  X-API-Key: unifit_api_key
  X-UNIFIT-Signature: hmac_signature

Body:
{
  "eventType": "tour.offered",
  "data": {
    "userId": "uuid",
    "tourId": "tour_123",
    "discount": 20
  }
}
```

## 📊 Base de Datos

### Tabla: payments
- id, provider_payment_id, provider
- amount, currency, status
- user_id, reservation_id
- metadata (JSONB)

### Tabla: partners
- id, name, api_key, hmac_secret
- webhook_url, subscribed_events
- active

### Tabla: webhook_events
- id, event_type, payment_id
- payload, provider, processed

## 📚 Referencias

- [Adapter Pattern](https://refactoring.guru/design-patterns/adapter)
- [HMAC Authentication](https://en.wikipedia.org/wiki/HMAC)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
