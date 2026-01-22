# 🧪 Cómo Probar el Workflow "Partner Handler"

Este workflow simula el ciclo completo de pago y, crucialmente, **notifica a los Partners externos** (ej. Tours Paradise) sobre eventos de pago mediante Webhooks seguros (HMAC).

Para propósitos de prueba local, el "Partner Externo" es simulado por nuestro propio `payment-service` que tiene un endpoint `/partners/webhook` listo para recibir y validar estas notificaciones.

---

## ✅ Prerrequisitos

1. **Servicios corriendo**:
   Asegúrate de que todos los contenedores estén activos:
   ```powershell
   ./start-all.ps1
   ```

2. **Endpoint de Prueba (Payment Service)**:
   Hemos habilitado el modo debug en `payment-service` para ver los logs cuando llegue el webhook.

---

## 🛠️ Paso 1: Generar Datos de Prueba Válidos

Para que el flujo funcione, necesitamos una Reserva Real en estado `PENDIENTE`. Usa el script automático que hemos creado:

1. Abre una terminal en VS Code.
2. Ejecuta:
   ```powershell
   .\crear-reserva-test.ps1
   ```
3. El script hará login, creará la reserva y **te mostrará un JSON al final**.
4. **Copia ese JSON completo**.

---

## ⚙️ Paso 2: Ejecutar en n8n

1. **Abrir n8n**: Ve a `http://localhost:5678`.
2. **Abrir Workflow**: Selecciona el workflow **"Payment Handler - UNIFIT"** (o `partner-handler.json`).
   > *Nota: Asegúrate de que el archivo `partner-handler.json` esté importado si no lo ves.*
3. **Configurar Test**:
   - Haz doble clic en el nodo inicial **Webhook Payment1**.
   - Haz clic en el botón **Test workflow** (al fondo).
   - O usa el botón grande **Test Workflow** en la barra inferior.
   - Pega el JSON que copiaste en el paso anterior en el área de **JSON / Body**.
4. **Ejecutar**.

---

## 🔍 Paso 3: Verificar Consola (Resultados)

Si todo funciona, verás el flujo completarse en verde en n8n.

Para confirmar que el "Partner" (nuestro servicio simulado) recibió la notificación:

1. Ve a la terminal donde corre `docker-compose` (o el log de `payment-service`).
2. Deberías ver logs como estos:

```text
payment-service-1  | ⚠️ DEV MODE: Webhook recibido. API Key: undefined, Signature: a1b2c3d4...
payment-service-1  | Payload: {"eventType":"payment.succeeded","timestamp":"...","data":{...}}
```

### ¿Qué acaba de pasar?
1. **n8n** recibió el pago.
2. **n8n** activó la reserva en **RestGolang** (:3000).
3. **n8n** calculó una firma HMAC SHA256 usando el secreto `secret_123`.
4. **n8n** envió un POST a `payment-service:3002/partners/webhook` simulando ser una notificación a un tercero.
5. **Payment Service** recibió y logueó el evento.

---

## 🐛 Solución de Problemas

- **Error 404 (Not Found)**: Tu ID de reserva no existe. Vuelve a correr `.\crear-reserva-test.ps1` y usa el NUEVO JSON.
- **Error 401 (Unauthorized)**: El servicio de pagos rechazó la firma. Asegúrate de que reiniciaste el servicio después de aplicar el parche de "DEV MODE":
  ```powershell
  docker-compose restart payment-service
  ```
- **Connection Refused**: Verifica que `payment-service` corre en el puerto 3002 y `RestGolang` en el 3000.
