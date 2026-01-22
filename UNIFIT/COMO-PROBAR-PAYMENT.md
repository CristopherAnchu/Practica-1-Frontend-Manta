# Guía de Prueba: Payment Handler Workflow (Webhook)

Este documento describe los pasos para probar el workflow de **Payment Handler** en n8n, el cual simula la recepción de una confirmación de pago (Webhook de un proveedor como Stripe) y desencadena acciones en el ecosistema UNIFIT (activación de reservas, notificaciones).

## 1. Prerrequisitos

Antes de iniciar la prueba, asegúrate de que todos los servicios necesarios estén en ejecución.

1.  **Ejecutar Script de Inicio**:
    Abre una terminal PowerShell y ejecuta:
    ```powershell
    .\start-all.ps1
    ```
    Esto iniciará:
    *   **RestGolang** (Puerto 3000)
    *   **GraphQL API** (Puerto 4000)
    *   **WebSocket Server** (Puerto 8080)
    *   **AI Orchestrator** (Puerto 3003)

2.  **Iniciar Payment Service**:
    El servicio de pagos (`payment-service`) **no** se inicia automáticamente con el script básico `start-all.ps1`. Debes iniciarlo manualmente:
    *   Abre una **nueva pestaña** de terminal PowerShell.
    *   Ejecuta:
    ```powershell
    cd payment-service
    npm run start:dev
    # El servicio inicia en puerto 3002
    ```

3.  **Iniciar n8n**:
    Asegúrate de que tu contenedor n8n esté corriendo (`docker-compose up -d`).

## 2. Definir Datos de Prueba

Para que la prueba sea exitosa, necesitas una **reserva (booking)** real en la base de datos que se pueda "activar".

**Obtener un ID de Reserva Válido:**
1.  Si tienes acceso al Frontend (localhost:4200), crea una reserva nueva.
2.  O usa `curl` / Postman contra el backend de Go:
    ```bash
    curl http://localhost:3000/reservas
    # Copia el ID de alguna reserva con estado "PENDIENTE"
    ```
    *Ejemplo de ID: `550e8400-e29b-41d4-a716-446655440000`*

## 3. Ejecutar la Prueba (Disparar Webhook)

El workflow se activa mediante una llamada HTTP POST (Webhook).

**Endpoint del Webhook (n8n):**
*   **Modo Test**: `http://localhost:5678/webhook-test/payment` (Recomendado para ver el flujo en la UI)
*   **Modo Producción**: `http://localhost:5678/webhook/payment` (Requiere activar el workflow)

**Payload (JSON):**
Copia el siguiente JSON y reemplaza `TU_ID_DE_RESERVA_AQUI` con el ID real obtenido en el paso 2.

```json
{
  "paymentId": "pay_test_123456789",
  "amount": 2500,
  "currency": "USD",
  "type": "succeeded",
  "metadata": {
    "reservationId": "31a1ecb4-6714-49e9-be4e-07c488408400",
    "userEmail": "cristopheromg35@gmail.com"
  }
}
```

### Opción A: Usando Postman
1.  Crea un nuevo Request **POST**.
2.  URL: `http://localhost:5678/webhook-test/payment`
3.  Body -> Raw -> JSON.
4.  Pega el JSON de arriba.
5.  En n8n, presiona **"Execute Workflow"**.
6.  En Postman, presiona **"Send"**.

### Opción B: Usando cURL (Terminal)
```bash
curl -X POST http://localhost:5678/webhook-test/payment \
  -H "Content-Type: application/json" \
  -d '{
    "paymentId": "pay_test_123456789",
    "amount": 2500,
    "currency": "USD",
    "type": "succeeded",
    "metadata": {
      "reservationId": "TU_ID_DE_RESERVA_AQUI",
      "userEmail": "tu-email@ejemplo.com"
    }
  }'
```

## 4. Verificar Resultados

Si todo funcionó correctamente:

1.  **n8n UI**: Verás que la ejecución se completó en verde.
2.  **Respuesta HTTP**: Recibirás un JSON: `{"received": true, "paymentId": "...", "status": "processed"}`.
3.  **Logs de RestGolang**: Deberías ver una petición a `POST /reservas/{id}/activate`.
4.  **Estado de la Reserva**: Si consultas nuevamente la reserva en `http://localhost:3000/reservas/{id}`, su estado debería haber cambiado a `CONFIRMADA` (o el estado que defina tu lógica de `activate`).
5.  **Emails/Notificaciones**:
    *   (Si tienes SMTP configurado) Se enviará un correo. Si no, revisa el nodo "Send Confirmation Email" que puede dar error o estar simulado.
    *   (Si el WebSocket está conectado) El cliente recibirá una notificación en tiempo real.

## Solución de Problemas Comunes

*   **Error: Connection Refused (n8n)**:
    *   Asegúrate de que los servicios locales (Golang, Payment) estén corriendo.
    *   Verifica que n8n puede ver a `host.docker.internal`.
*   **Error: 404 Not Found (RestGolang)**:
    *   El ID de la reserva en el JSON no existe en tu base de datos local. Crea una nueva reserva.
*   **Workflow no se activa**:
    *   Asegúrate de estar usando la URL correcta (`/webhook-test/` si estás ejecutando manualmente, `/webhook/` si está activo en fondo).
