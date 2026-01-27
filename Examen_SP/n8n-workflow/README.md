# Workflow n8n - exam2p-flujo-auditoria

## Descripción
Workflow automatizado para procesar alertas de auditoría cuando se eliminan registros.

## Flujo de Nodos

### 1. Webhook (Entrada)
- **Tipo:** Webhook
- **Método:** POST
- **Path:** `/webhook/exam2p-auditoria`
- **Función:** Recibe eventos del microservicio cuando se registra una eliminación

### 2. IF (Validación)
- **Condición:** `exam2p_accion === "ELIMINAR"`
- **Función:** Valida que la acción sea una eliminación
- **Salidas:**
  - ✅ True: Continúa al nodo Gemini
  - ❌ False: Responde sin procesar

### 3. HTTP Request (Gemini)
- **API:** Google Gemini Pro
- **Función:** Genera un mensaje de alerta profesional usando IA
- **Input:** Datos del registro de auditoría
- **Output:** Mensaje generado por Gemini

### 4. Telegram (Notificación)
- **Función:** Envía alerta al canal/chat de Telegram
- **Formato:** Markdown
- **Contenido:**
  - Mensaje generado por Gemini
  - Detalles del registro (entidad, ID, usuario, fecha)

### 5. Respond to Webhook (Confirmación)
- **Función:** Confirma la recepción y procesamiento del evento
- **Response:** JSON con status de éxito

## Configuración

### Variables de Entorno Requeridas

```bash
# En n8n, configurar:
TELEGRAM_CHAT_ID=tu_chat_id_de_telegram
```

### Credenciales Necesarias

1. **Google Gemini API**
   - Crear credencial tipo "Google PaLM API"
   - Agregar API Key de Google AI Studio

2. **Telegram Bot**
   - Crear bot con @BotFather
   - Obtener token del bot
   - Configurar credencial "Telegram account"

## Instalación en n8n

### Opción 1: Importar JSON
1. Abrir n8n: `http://localhost:5678`
2. Click en "..." → "Import from File"
3. Seleccionar `exam2p-flujo-auditoria.json`
4. Configurar credenciales
5. Activar workflow

### Opción 2: Crear Manualmente
1. Crear nuevo workflow
2. Agregar nodos en el orden especificado
3. Configurar conexiones entre nodos
4. Guardar como "exam2p-flujo-auditoria"

## Payload de Entrada Esperado

```json
{
  "evento": "exam2p.auditoria.eliminacion",
  "fechaHora": "2026-01-27T10:30:00.000Z",
  "datos": {
    "registroId": 1,
    "exam2p_entidad": "Usuario",
    "exam2p_registroAfectadoId": 123,
    "exam2p_accion": "ELIMINAR",
    "exam2p_usuario": "admin@example.com",
    "exam2p_fechaHora": "2026-01-27T10:30:00.000Z",
    "exam2p_detalle": "Usuario eliminado desde panel de administración"
  }
}
```

## Ejemplo de Notificación Telegram

```
🚨 ALERTA DE AUDITORÍA

⚠️ Se ha detectado una eliminación crítica en el sistema.
El usuario admin@example.com eliminó el registro #123 de la entidad Usuario.

📊 Detalles:
• Entidad: Usuario
• ID: 123
• Usuario: admin@example.com
• Fecha: 2026-01-27T10:30:00.000Z
```

## Evidencia para Examen

### Capturas Necesarias:
1. ✅ JSON exportado del workflow
2. ✅ Notificación en Telegram mostrando:
   - Mensaje de Gemini
   - Datos del registro
   - Timestamp
3. ✅ Log de ejecución en n8n (exitosa)

## Prueba del Workflow

### 1. Usando cURL
```bash
curl -X POST http://localhost:5678/webhook/exam2p-auditoria \
  -H "Content-Type: application/json" \
  -d '{
    "evento": "exam2p.auditoria.eliminacion",
    "fechaHora": "2026-01-27T10:30:00.000Z",
    "datos": {
      "registroId": 1,
      "exam2p_entidad": "Producto",
      "exam2p_registroAfectadoId": 456,
      "exam2p_accion": "ELIMINAR",
      "exam2p_usuario": "test@example.com",
      "exam2p_fechaHora": "2026-01-27T10:30:00.000Z",
      "exam2p_detalle": "Producto eliminado - Prueba"
    }
  }'
```

### 2. Desde el Microservicio
El microservicio emite automáticamente el webhook cuando:
- Se recibe un evento RabbitMQ
- La acción es "ELIMINAR"

## Troubleshooting

### Webhook no recibe datos
- Verificar que n8n esté corriendo en puerto 5678
- Verificar URL en `.env` del microservicio
- Activar workflow en n8n

### Gemini no responde
- Verificar API Key válida
- Verificar cuota de API
- Revisar formato del request

### Telegram no envía
- Verificar token del bot
- Verificar chat_id correcto
- Bot debe estar agregado al chat/canal
